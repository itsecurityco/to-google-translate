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



chrome.webRequest.onHeadersReceived.addListener(info => {
        let headers = info.responseHeaders.filter(header => {
                let name = header.name.toLowerCase();
                return name !== 'x-frame-options' && name !== 'frame-options';
            }
        );
        return {responseHeaders: headers};
    },
    {
        urls: [
            '*://translate.google.com/*',
            '*://translate.google.cn/*'
        ],
        types: ['sub_frame']
    },
    ['blocking', 'responseHeaders']
);


new Config(true, items => {

    let {pageLang, userLang, ttsLang, tpPageLang, tpUserLang, enableTT, enableTTS, enableTP} = items;

    chrome.contextMenus.removeAll(function () {
        // create Translate context menu
        if (enableTT) {
            chrome.contextMenus.create({
                id: 'translate',
                title: chrome.i18n.getMessage('contextMenuTitleTranslate', [pageLang, userLang]),
                contexts: ['selection']
            });
            chrome.contextMenus.create({
                id: 'wiktionary',
                title: 'Wiktionary lookup',
                contexts: ['selection']
            });
            chrome.contextMenus.create({
                id: 'glosbe',
                title: 'Glosbe',
                contexts: ['selection']
            });
            chrome.contextMenus.create({
                id: 'reverso',
                title: 'Reverso Context',
                contexts: ['selection']
            });
        }
        // create Listen context menu
        if (enableTTS) {
            chrome.contextMenus.create({
                id: 'tts',
                title: chrome.i18n.getMessage('contextMenuTitleTextToSpeech', ttsLang),
                contexts: ['selection']
            });
        }
        // create Translate Page context menu
        if (enableTP) {
            chrome.contextMenus.create({
                id: 'translatePage',
                title: chrome.i18n.getMessage('contextMenuTitleTranslatePage', [tpPageLang, tpUserLang]),
                contexts: ['all']
            });

            chrome.contextMenus.create({
                id: 'translatePageLink',
                title: chrome.i18n.getMessage('contextMenuTitleTranslatePageLink', [tpPageLang, tpUserLang]),
                contexts: ['link']
            });
        }
    });
});

browser.commands.onCommand.addListener(function (shortcut) {

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        let tab = tabs[0];
        let config = Config.config;

        if (shortcut === "translate" || shortcut === "tts") {
            chrome.tabs.executeScript({code: "window.getSelection().toString();"}, function (selection) {
                let selectedText = selection[0] || "";

                if (shortcut === "translate") {
                    openTranslate(config.translateURL + encodeURIComponent(selectedText), tab);
                } else if (shortcut === "tts") {
                    openTranslate(config.ttsURL + encodeURIComponent(selectedText) + '&textlen=' + selectedText.length, tab);
                }
            });
        } else if (shortcut === "translatePage") {
            openTranslate(config.translatePageURL + encodeURIComponent(tab.url), tab, true);
        }
    });
});

// manage click context menu
chrome.contextMenus.onClicked.addListener(function (info, tab) {

    let selectedText = info.selectionText;
    let config = Config.config;
    let langFrom = Config.supportedLanguages.text.find(x => x.code === Config.config.pageLang).language;
    let langTo = Config.supportedLanguages.text.find(x => x.code === Config.config.userLang).language;

    switch (info.menuItemId) {
        case 'reverso':
            browser.tabs.create({
                url: `https://context.reverso.net/translation/${langFrom.toLowerCase()}-${langTo.toLowerCase()}/${selectedText.toLowerCase()}`,
            }).then(null, () => alert("failed to make a new tab"));
            break;
        case 'glosbe':
            browser.tabs.create({
                url: `https://glosbe.com/${Config.config.pageLang}/${Config.config.userLang}/${selectedText.toLowerCase()}`,
            }).then(null, () => alert("failed to make a new tab"));
            break;
        case 'wiktionary':
            browser.tabs.create({
                url: "https://en.wiktionary.org/wiki/" + selectedText.toLowerCase() + `#${langFrom}`,
            }).then(null, () => alert("failed to make a new tab"));
            break;
        case 'translate':
            openTranslate(config.translateURL + encodeURIComponent(selectedText), tab);
            break;
        case  'tts':
            openTranslate(config.ttsURL + encodeURIComponent(selectedText) + '&textlen=' + selectedText.length, tab);
            break;
        case 'translatePage':
            openTranslate(config.translatePageURL + encodeURIComponent(info.pageUrl), tab, true);
            break;
        case 'translatePageLink':
            openTranslate(config.translatePageURL + encodeURIComponent(info.linkUrl), tab, true);
            break;
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'newTab') {
        chrome.tabs.create({url: request.url});
    }
});

chrome.runtime.onInstalled.addListener(function (info) {
    if (info.reason === "install") {
        chrome.runtime.openOptionsPage();
    }
});

function openTranslate(url, tab, fullscreen = false) {
    if (Config.config.openMode === "modal") {
        chrome.tabs.sendMessage(tab.id, {
            url: url,
            fullscreen: fullscreen
        });
    } else {
        tabCreateWithOpenerTabId(url, tab);
    }
}

// Create a tab with openerTabId if version of Firefox is above 57
// https://github.com/itsecurityco/to-google-translate/pull/19
function tabCreateWithOpenerTabId(uri, tab) {
    browser.runtime.getBrowserInfo().then(info => {
        let newTabConfig = {
            url: uri
        };
        if (Math.round(parseInt(info.version)) > 56) {
            // openerTabId supported
            newTabConfig.openerTabId = tab.id;
        }
        chrome.tabs.create(newTabConfig);
    });
}