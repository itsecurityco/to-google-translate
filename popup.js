browser.webRequest.onHeadersReceived.addListener(
    function (info) {
        let headers = info.responseHeaders;
        for (let i = headers.length - 1; i >= 0; --i) {
            let header = headers[i].name.toLowerCase();
            if (header == 'x-frame-options' || header == 'frame-options') {
                headers.splice(i, 1);
            }
        }
        return {responseHeaders: headers};
    },
    {
        urls: ['*://*/*'],
        types: ['sub_frame']
    },
    ['blocking', 'responseHeaders']
);

document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.local.get('gtDomain', items => {
        if (items.gtDomain) {
            document.getElementById("google_translate").src = "https://" + items.gtDomain;
        }
    });
});