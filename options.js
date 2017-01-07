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
var from = document.querySelector('#from');
var to = document.querySelector('#to');

function saveOptions(e) {
    e.preventDefault();
    storage.set({
        'from': from.value,
        'to': to.value,
        'url': `https://translate.google.com/#${from.value}/${to.value}/`
    }, function () {
        chrome.contextMenus.update('translate', {
            title: chrome.i18n.getMessage('contextMenuTitle') + ` [${from.value}/${to.value}]`
        }, function () {
            showMessage('Settings saved');
        });
    });
}

function loadOptions() {
    storage.get({'from': 'en', 'to': 'es'}, function (items) {
        from.value = items.from;
        to.value = items.to;
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