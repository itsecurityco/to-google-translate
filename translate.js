/**
* Juan Escobar (https://github.com/itseco)
*
* @link      https://github.com/itseco/to-google-translate
* @copyright Copyright (c) 2017, Juan Escobar.  All rights reserved.
* @license   Copyrights licensed under the New BSD License.
*/

var storage = chrome.storage.local;

storage.get({
    'pageLang': 'en',
    'userLang': 'es',
    'ttsLang': 'en'
}, function (items) {
    var pageLang = items.pageLang,
        userLang = items.userLang,
        ttsLang = items.ttsLang;

    chrome.contextMenus.create({
        id: 'translate',
        title: chrome.i18n.getMessage('contextMenuTitleTranslate', [pageLang, userLang]),
        contexts: ['selection']
    });

    chrome.contextMenus.create({
        id: 'tts',
        title: chrome.i18n.getMessage('contextMenuTitleTextToSpeech', ttsLang),
        contexts: ['selection']
    });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    var selectedText = info.selectionText;

    if (info.menuItemId == 'translate') {
        storage.get({
            'translateURL': 'https://translate.google.com/#en/es/'
        }, function (item) {
            chrome.tabs.create({
                url: item.translateURL + encodeURIComponent(selectedText)
            });
        });
    }

    if (info.menuItemId == 'tts') {
        storage.get({
            'ttsURL': 'https://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&client=tw-ob&tl=en&q='
        }, function (item) {
            chrome.tabs.create({
                url: item.ttsURL + encodeURIComponent(selectedText) +
                    '&textlen=' + selectedText.length
            });
        });
    }
});