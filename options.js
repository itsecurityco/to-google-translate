/**
* Juan Escobar (https://github.com/itseco)
*
* @link      https://github.com/itseco/to-google-translate
* @copyright Copyright (c) 2017, Juan Escobar.  All rights reserved.
* @license   Copyrights licensed under the New BSD License.
*/

document.addEventListener('DOMContentLoaded', loadOptions);
document.querySelector('form').addEventListener('submit', saveOptions);

var storage = chrome.storage.local;
var pageLang = document.querySelector('#pageLang');
var userLang = document.querySelector('#userLang');
var ttsLang = document.querySelector('#ttsLang');
var TPpageLang = document.querySelector('#TPpageLang');
var TPuserLang = document.querySelector('#TPuserLang');
var enableTT = document.querySelector('#enableTT');
var enableTTS = document.querySelector('#enableTTS');
var enableTP = document.querySelector('#enableTP');

function saveOptions(e) {
    e.preventDefault();

    let domains = {
        global: "translate.google.com",
        china: "translate.google.cn"
    };

    let selectedDomain = document.querySelector('input[name=selectedDomain]:checked').value;
    if(!domains.hasOwnProperty(selectedDomain)){
        selectedDomain = "global";
    }
    gtDomain = domains[selectedDomain];

    storage.set({
        'pageLang': pageLang.value,
        'userLang': userLang.value,
        'ttsLang': ttsLang.value,
        'TPpageLang': TPpageLang.value,
        'TPuserLang': TPuserLang.value,
        'enableTT': enableTT.checked,
        'enableTTS': enableTTS.checked,
        'enableTP': enableTP.checked,
        'selectedDomain': selectedDomain,
        'gtDomain': domains[selectedDomain],
        'translateURL': `https://${gtDomain}/#view=home&op=translate&sl=${pageLang.value}&tl=${userLang.value}&text=`,
        'ttsURL': `https://${gtDomain}/translate_tts?ie=UTF-8&total=1&idx=0&client=tw-ob&tl=${ttsLang.value}&q=`,
        'translatePageURL': `https://${gtDomain}/translate?sl=${TPpageLang.value}&tl=${TPuserLang.value}&u=`
    }, function () {

        showMessage(chrome.i18n.getMessage('optionsMessageSaved'));
        chrome.extension.getBackgroundPage().window.location.reload()
        
    });
}

function loadOptions() {
    fetch(chrome.runtime.getURL('supported_languages.json'))
        .then(response => response.json())
        .then(languages => {

            let textOptions = [];
            function createOption(text,value) {
                let option = document.createElement("option");
                option.text = text;
                option.value = value;
                return option;
            }

            for(let lang of languages.text){
                textOptions.push(createOption(lang.language, lang.code));
            }

            for(let lang of languages.tts){
                ttsLang.add(createOption(lang.language, lang.code));
            }

            let autoOption = createOption("Auto", "auto")

            pageLang.add(autoOption.cloneNode(true));
            TPpageLang.add(autoOption.cloneNode(true));
            ttsLang.add(autoOption.cloneNode(true));

            for(let option of textOptions){
                pageLang.add(option.cloneNode(true));
                userLang.add(option.cloneNode(true));

                TPpageLang.add(option.cloneNode(true));
                TPuserLang.add(option.cloneNode(true));
            }

            let defaultLanguage = languages.text.find(o => o.code === getDefaultLanguage()) ? getDefaultLanguage() : "es";

            storage.get({
                'pageLang': 'auto',
                'userLang': defaultLanguage,
                'ttsLang': 'en-US',
                'TPpageLang': 'auto',
                'TPuserLang': defaultLanguage,
                'enableTT': true,
                'enableTTS': true,
                'enableTP': true,
                'selectedDomain': 'global',
                'gtDomain': getGoogleTranslatorDomain()
            }, function (items) {
                pageLang.value = items.pageLang;
                userLang.value = items.userLang;
                ttsLang.value = items.ttsLang;
                TPpageLang.value = items.TPpageLang;
                TPuserLang.value = items.TPuserLang;
                enableTT.checked = items.enableTT;
                enableTTS.checked = items.enableTTS;
                enableTP.checked = items.enableTP;
                gtDomain = items.gtDomain;
                document.querySelector(`input[name=selectedDomain][value="${items.selectedDomain}"]`).checked = true
            });

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

function getDefaultLanguage() {
    return navigator.language.toLowerCase().split('-')[0];
}

function getGoogleTranslatorDomain() {
    let offset = new Date().getTimezoneOffset();
    // Domain for China
    if (offset/60 == -8) {
        return "translate.google.cn"; 
    // Domain for rest of world
    } else { 
        return "translate.google.com"; 
    }
}