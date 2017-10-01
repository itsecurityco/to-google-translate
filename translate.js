/**
* Juan Escobar (https://github.com/itseco)
*
* @link      https://github.com/itseco/to-google-translate
* @copyright Copyright (c) 2017, Juan Escobar.  All rights reserved.
* @license   Copyrights licensed under the New BSD License.
* 
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*     * Redistributions of source code must retain the above copyright
*       notice, this list of conditions and the following disclaimer.
*     * Redistributions in binary form must reproduce the above copyright
*       notice, this list of conditions and the following disclaimer in the
*       documentation and/or other materials provided with the distribution.
*     * Neither the name of the <organization> nor the
*       names of its contributors may be used to endorse or promote products
*       derived from this software without specific prior written permission.
* 
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
* ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
* DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
* ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
* SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
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
