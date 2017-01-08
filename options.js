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

function saveOptions(e) {
    e.preventDefault();
    storage.set({
        'pageLang': pageLang.value,
        'userLang': userLang.value,
        'ttsLang': ttsLang.value,
        'translateURL': `https://translate.google.com/#${pageLang.value}/${userLang.value}/`,
        'ttsURL': `https://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&client=tw-ob&tl=${ttsLang.value}&q=`
    }, function () {
        updateContextMenuTitle('translate', 
            chrome.i18n.getMessage('contextMenuTitleTranslate', [pageLang.value, userLang.value]));
        updateContextMenuTitle('tts', 
            chrome.i18n.getMessage('contextMenuTitleTextToSpeech', ttsLang.value));
        showMessage('Settings saved');
    });
}

function loadOptions() {
    storage.get({
        'pageLang': 'en',
        'userLang': 'es',
        'ttsLang': 'en'
    }, function (items) {
        pageLang.value = items.pageLang;
        userLang.value = items.userLang;
        ttsLang.value = items.ttsLang;
    });
}

function updateContextMenuTitle(id, value) {
    chrome.contextMenus.update(id, {
        title: value
    });
}

function showMessage(msg) {
    var message = document.querySelector('#message');
    message.innerText = msg;
    message.style.display = 'block';
    setTimeout(function () {
        message.style.display = 'none';
    }, 3000);
}