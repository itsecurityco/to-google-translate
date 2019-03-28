Config.getOptions().then(options => {
    if (options.enableHotkeys) {
        document.onkeyup = function (e) {
            if (e.ctrlKey && e.altKey && e.code === "KeyC") {
                let selectedText = window.getSelection().toString();
                if (selectedText) {
                    show_modal(options.translateURL + selectedText);
                }
            }
        };
    }
});
