/**
 * Juan Escobar (https://github.com/itseco)
 *
 * @link      https://github.com/itseco/to-google-translate
 * @copyright Copyright (c) 2017, Juan Escobar.  All rights reserved.
 * @license   Copyrights licensed under the New BSD License.
 */

document.addEventListener('DOMContentLoaded', loadOptions);
let pageLang, userLang, ttsLang, tpPageLang, tpUserLang, enableTT, enableTTS, enableTP;

function saveOptions(e) {
    e.preventDefault();

    let domains = {
        global: "fanyi.sogou.com",
        china: "fanyi.sogou.com"
    };

    let selectedDomain = document.querySelector('input[name=selectedDomain]:checked').value;
    if (!domains.hasOwnProperty(selectedDomain)) {
        selectedDomain = "global";
    }

    let gtDomain = domains[selectedDomain];

    Config.setOptions({
        'pageLang': pageLang.value,
        'userLang': userLang.value,
        'ttsLang': ttsLang.value,
        'tpPageLang': tpPageLang.value,
        'tpUserLang': tpUserLang.value,
        'enableTT': enableTT.checked,
        'enableTTS': enableTTS.checked,
        'enableTP': enableTP.checked,
        'selectedDomain': selectedDomain,
        'gtDomain': gtDomain,
/*         'translateURL': `https://${gtDomain}/#view=home&op=translate&sl=${pageLang.value}&tl=${userLang.value}&text=`,
        'ttsURL': `https://${gtDomain}/translate_tts?ie=UTF-8&total=1&idx=0&client=tw-ob&tl=${ttsLang.value}&q=`,
        'translatePageURL': `https://${gtDomain}/translate?sl=${tpPageLang.value}&tl=${tpUserLang.value}&u=`
 */
        'translateURL': `https://${gtDomain}/#auto/zh-CHT/`,
        'ttsURL': `https://${gtDomain}/translate_tts?ie=UTF-8&total=1&idx=0&client=tw-ob&tl=${ttsLang.value}&q=`,
        'translatePageURL': `https://${gtDomain}/translate?sl=${tpPageLang.value}&tl=${tpUserLang.value}&u=`

    })
        .then(() => {
            showMessage(chrome.i18n.getMessage('optionsMessageSaved'));
            chrome.extension.getBackgroundPage().window.location.reload()
        });

}

function loadOptions() {

    document.querySelector('form').addEventListener('submit', saveOptions);

    pageLang = document.querySelector('#pageLang');
    userLang = document.querySelector('#userLang');
    ttsLang = document.querySelector('#ttsLang');
    tpPageLang = document.querySelector('#tpPageLang');
    tpUserLang = document.querySelector('#tpUserLang');
    enableTT = document.querySelector('#enableTT');
    enableTTS = document.querySelector('#enableTTS');
    enableTP = document.querySelector('#enableTP');

    new Config(true, config => {

        let textOptions = [];

        function createOption(text, value) {
            let option = document.createElement("option");
            option.text = text;
            option.value = value;
            return option;
        }

        for (let lang of Config.supportedLanguages.text) {
            textOptions.push(createOption(lang.language, lang.code));
        }

        for (let lang of Config.supportedLanguages.tts) {
            ttsLang.add(createOption(lang.language, lang.code));
        }

        let autoOption = createOption("Auto", "auto")

        pageLang.add(autoOption.cloneNode(true));
        tpPageLang.add(autoOption.cloneNode(true));
        ttsLang.add(autoOption.cloneNode(true));

        for (let option of textOptions) {
            pageLang.add(option.cloneNode(true));
            userLang.add(option.cloneNode(true));

            tpPageLang.add(option.cloneNode(true));
            tpUserLang.add(option.cloneNode(true));
        }

        pageLang.value = config.pageLang;
        userLang.value = config.userLang;
        ttsLang.value = config.ttsLang;
        tpPageLang.value = config.tpPageLang;
        tpUserLang.value = config.tpUserLang;
        enableTT.checked = config.enableTT;
        enableTTS.checked = config.enableTTS;
        enableTP.checked = config.enableTP;
        document.querySelector(`input[name=selectedDomain][value="${config.selectedDomain}"]`).checked = true

    });

}

function showMessage(msg) {
    let message = document.querySelector('#message');
    message.innerText = msg;
    message.style.display = 'block';
    setTimeout(function () {
        message.style.display = 'none';
    }, 3000);
}
