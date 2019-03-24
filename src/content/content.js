browser.runtime.onMessage.addListener(function (message, sender, callback) {

    if (message.url) {
        let tgt_model = new Modal({url: message.url, fullscreen: message.fullscreen}, false);
        tgt_model.build().then(() => {
            tgt_model.show();
        });
    }

});