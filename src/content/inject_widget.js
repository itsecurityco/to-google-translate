Config.loadConfig().then(() => {
    let config = Config.config;

    document.body.insertAdjacentHTML("beforeend", `<div id="tgt_google_translate_element" style="display: none"></div>`);

    let callbackScript = document.createElement('script');
    callbackScript.type = 'text/javascript';
    callbackScript.text = `function tgt_googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: '${config.tpPageLang}',
        layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL
    }, 'tgt_google_translate_element');
    
    let checkExist = setInterval(function () {
        if (document.getElementById(":1.container")) {
            document.querySelector('#tgt_google_translate_element select').value = '${config.tpUserLang}';
            document.querySelector('#tgt_google_translate_element select').dispatchEvent(new Event('change'));
            clearInterval(checkExist);
        }
    }, 300);
}`;
    document.body.appendChild(callbackScript);

    let widgetScript = document.createElement('script');
    widgetScript.src = "//translate.google.com/translate_a/element.js?cb=tgt_googleTranslateElementInit";
    document.head.appendChild(widgetScript);
});
