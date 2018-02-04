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
var enableTT = document.querySelector('#enableTT');
var enableTTS = document.querySelector('#enableTTS');

function saveOptions(e) {
    e.preventDefault();
    storage.set({
        'pageLang': pageLang.value,
        'userLang': userLang.value,
        'ttsLang': ttsLang.value,
        'enableTT': enableTT.checked,
        'enableTTS': enableTTS.checked,
        'translateURL': `https://translate.google.com/#${pageLang.value}/${userLang.value}/`,
        'ttsURL': `https://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&client=tw-ob&tl=${ttsLang.value}&q=`
    }, function () {
        updateContextMenuTitle('translate', 
            chrome.i18n.getMessage('contextMenuTitleTranslate', [pageLang.value, userLang.value]));
        updateContextMenuTitle('tts', 
            chrome.i18n.getMessage('contextMenuTitleTextToSpeech', ttsLang.value));
        showMessage('Settings saved');
        
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
        
    });
}

function loadOptions() {
    storage.get({
        'pageLang': 'auto',
        'userLang': 'es',
        'ttsLang': 'en',
        'enableTT': true,
        'enableTTS': true
    }, function (items) {
        pageLang.value = items.pageLang;
        userLang.value = items.userLang;
        ttsLang.value = items.ttsLang;
        enableTT.checked = items.enableTT;
        enableTTS.checked = items.enableTTS;
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