/**
* Juan Escobar (https://github.com/itseco)
*
* @link      https://github.com/itseco/to-google-translate
* @copyright Copyright (c) 2017, Juan Escobar.  All rights reserved.
* @license   Copyrights licensed under the New BSD License.
*/

var storage = chrome.storage.local;

storage.get({
    'from': 'en',
    'to': 'es'
}, function (items) {
    var from = items.from, to = items.to;

    chrome.contextMenus.create({
        id: 'translate',
        title: chrome.i18n.getMessage('contextMenuTitle') + `[${from}/${to}]`,
        contexts: ['selection']
    });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId == 'translate') {
        storage.get('url', function (item) {
            chrome.tabs.create({
                url: item.url + encodeURIComponent(info.selectionText)
            });
        });
    }
});