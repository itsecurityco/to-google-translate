let tgt_model;

chrome.runtime.onMessage.addListener(function (message, sender, callback) {
    if (message.url) {
        if (tgt_model === undefined) {
            show_modal(message.url, message.fullscreen);
        } else {
            close_modal();
        }
    }
});

function show_modal(url, fullscreen = false) {
    let agentMatch = window.navigator.userAgent.match(/Firefox\/([0-9]+)\./);
    let firefoxVersion = agentMatch ? parseInt(agentMatch[1]) : 0;
    
    tgt_model = firefoxVersion > 63
        ? new Modal({url: url, fullscreen: fullscreen}, false)
        : new ModalIframe({url: url, fullscreen: fullscreen}, false);
    
    tgt_model.build().then(() => {
        tgt_model.show();
    });
}

function close_modal() {
    tgt_model.destroy();
    tgt_model = undefined; // Leave back to initial state undefined.
}

