class ModalIframe {

    constructor(data, build = true) {
        this.url = data.url;
        this.html = data.html;
        this.fullscreen = data.fullscreen;

        if ((data.url || data.html) && build) {
            this.build();
        }
    }

    async build(targetSelector) {
        if (targetSelector) {
            this.baseElement = document.querySelector(targetSelector);
        } else {
            this.baseElement = document.body;
        }

        this.iframe = document.createElement('iframe');
        this.iframe.style.cssText = `
            position: fixed;
            z-index: 999999;
            padding-top: 0;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;`;

        this.baseElement.appendChild(this.iframe);

        this.iframe.onload = () => {

            this.iframeContent = (this.iframe.contentWindow.document || this.iframe.contentDocument);

            if (this.fullscreen) {
                this.iframeContent.querySelector(".modal").classList.add("modal-fullscreen");

                Config.loadConfig().then(() => {
                    let pageLang = this.iframeContent.querySelector("#contentPageLang");
                    let userLang = this.iframeContent.querySelector("#contentUserLang");

                    let textOptions = [];

                    function createOption(text, value) {
                        let option = document.createElement("option");
                        option.text = text;
                        option.value = value;
                        return option;
                    }

                    for (let lang of Config.supportedLanguages.text) {
                        textOptions.push(createOption(lang.language, lang.code));
                    }

                    pageLang.add(createOption("Auto", "auto"));

                    for (let option of textOptions) {
                        pageLang.add(option.cloneNode(true));
                        userLang.add(option.cloneNode(true));
                    }

                    pageLang.value = Config.config.pageLang;
                    userLang.value = Config.config.userLang;

                    let selectLang = this.iframeContent.querySelectorAll(".select-lang");
                    selectLang[0].onchange = () => this.changeLanguage(pageLang.value, userLang.value);
                    selectLang[1].onchange = () => this.changeLanguage(pageLang.value, userLang.value);

                });
            }

            this.iframeContent.querySelector(".modal-body").style.background = `url(${chrome.runtime.getURL('icons/loading.gif')}) center center no-repeat`;

            this.iframeContent.querySelector("iframe").onload = () => {
                this.iframeContent.querySelector("iframe").contentWindow.postMessage({action: "hideHeader"}, "*");
            };

            this.iframeContent.querySelector("iframe").src = this.url;


            this.iframeContent.querySelector(".close").onclick = () => this.destroy();
            this.iframeContent.querySelector(".new-tab").onclick = () => this.openNewTab();
            let modal = this.iframeContent.querySelector(".modal");

            modal.onclick = (event) => {
                if (event.target === modal) {
                    this.destroy();
                }
            };

            l10n.updateSubtree(this.iframeContent.querySelector(".modal"));
        };

        this.iframe.src = chrome.runtime.getURL('src/content/modal_iframe.html');

    }

    changeLanguage(from, to) {
        this.iframeContent.querySelector("iframe").contentWindow.postMessage({
            action: "changeLang",
            from: from,
            to: to
        }, "*");
    }

    openNewTab() {
        let url = this.iframeContent.querySelector("iframe").src;
        chrome.runtime.sendMessage({action: 'newTab', url: url});
    }

    show() {
        this.iframeContent.querySelector(".modal").style.display = "block";
    }

    hide() {
        this.iframeContent.querySelector(".modal").style.display = "none";
    }

    destroy() {
        this.iframe.remove();
    }
}
