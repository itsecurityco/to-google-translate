chrome.runtime.onMessage.addListener(function (message, sender, callback) {
    if (message.url) {
        show_modal(message.url, message.fullscreen);
    }
});

function show_modal(url, fullscreen = false) {
    let tgt_model = new Modal({url: url, fullscreen: fullscreen}, false);
    tgt_model.build().then(() => {
        tgt_model.show();
    });
}