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
    storage.set({
        'pageLang': pageLang.value,
        'userLang': userLang.value,
        'ttsLang': ttsLang.value,
        'TPpageLang': TPpageLang.value,
        'TPuserLang': TPuserLang.value,
        'enableTT': enableTT.checked,
        'enableTTS': enableTTS.checked,
        'enableTP': enableTP.checked,
        'translateURL': `https://${gtDomain}/?sl=${pageLang.value}&tl=${userLang.value}&text=`,
        'ttsURL': `https://${gtDomain}/translate_tts?ie=UTF-8&total=1&idx=0&client=tw-ob&tl=${ttsLang.value}&q=`,
        'translatePageURL': `https://${gtDomain}/translate?sl=${TPpageLang.value}&tl=${TPuserLang.value}&u=`
    }, function () {
        updateContextMenuTitle('translate', 
            chrome.i18n.getMessage('contextMenuTitleTranslate', [pageLang.value, userLang.value]));
        updateContextMenuTitle('tts', 
            chrome.i18n.getMessage('contextMenuTitleTextToSpeech', ttsLang.value));
        updateContextMenuTitle('translatePage',
            chrome.i18n.getMessage('contextMenuTitleTranslatePage', [TPpageLang.value, TPuserLang.value]));
        updateContextMenuTitle('translatePageLink',
            chrome.i18n.getMessage('contextMenuTitleTranslatePageLink', [TPpageLang.value, TPuserLang.value]));
        showMessage(chrome.i18n.getMessage('optionsMessageSaved'));

        if (enableTT.checked == false) {
            removeContextMenu('translate');
        } else {
            chrome.contextMenus.create({
                id: 'translate',
                title: chrome.i18n.getMessage('contextMenuTitleTranslate', [pageLang.value, userLang.value]),
                contexts: ['selection']
            });
        }

        if (enableTTS.checked == false) {
            removeContextMenu('tts');
        } else {
            chrome.contextMenus.create({
                id: 'tts',
                title: chrome.i18n.getMessage('contextMenuTitleTextToSpeech', ttsLang.value),
                contexts: ['selection']
            });
        }

        if (enableTP.checked == false) {
            removeContextMenu('translatePage');
            removeContextMenu('translatePageLink');
        } else {
            chrome.contextMenus.create({
                id: 'translatePage',
                title: chrome.i18n.getMessage('contextMenuTitleTranslatePage', [TPpageLang.value, TPuserLang.value]),
                contexts: ['all']
            });

            chrome.contextMenus.create({
                id: 'translatePageLink',
                title: chrome.i18n.getMessage('contextMenuTitleTranslatePageLink', [TPpageLang.value, TPuserLang.value]),
                contexts: ['link']
            });
        }
        
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

            storage.get({
                'pageLang': 'auto',
                'userLang': 'es',
                'ttsLang': 'en-US',
                'TPpageLang': 'auto',
                'TPuserLang': 'es',
                'enableTT': true,
                'enableTTS': true,
                'enableTP': true,
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
            });

    });
}

function updateContextMenuTitle(id, value) {
    chrome.contextMenus.update(id, {
        title: value
    });
}

function removeContextMenu(id) {
    chrome.contextMenus.remove(id);
}

function showMessage(msg) {
    var message = document.querySelector('#message');
    message.innerText = msg;
    message.style.display = 'block';
    setTimeout(function () {
        message.style.display = 'none';
    }, 3000);
}

function getGoogleTranslatorDomain() {
    var offset = new Date().getTimezoneOffset();
    // Domain for China
    if (offset/60 == -8) {
        return "translate.google.cn"; 
    // Domain for rest of world
    } else { 
        return "translate.google.com"; 
    }
}