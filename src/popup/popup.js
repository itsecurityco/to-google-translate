browser.webRequest.onHeadersReceived.addListener(info => {
        let headers = info.responseHeaders.filter(header => {
                let name = header.name.toLowerCase();
                return name !== 'x-frame-options' && name !== 'frame-options';
            }
        );
        return {responseHeaders: headers};
    },
    {
        urls: ['*://*/*'],
        types: ['sub_frame']
    },
    ['blocking', 'responseHeaders']
);

document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.local.get('translateURL', items => {
        if (items.translateURL) {
            document.getElementById("google_translate").src = items.translateURL;
        }
    });
});
