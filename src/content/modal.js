class Modal {

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
            this.element = document.querySelector(targetSelector);
        } else {
            this.element = document.createElement("div");
            document.body.appendChild(this.element);
        }

        this.shadow = this.element.attachShadow({mode: "open"});

        return fetch(chrome.runtime.getURL('src/content/modal.html'))
            .then(resp => resp.text())
            .then(html => {

                this.shadow.innerHTML = html;

                if (this.fullscreen) {
                    this.shadow.querySelector(".modal").classList.add("modal-fullscreen");

                    Config.loadConfig().then(() => {
                        let pageLang = this.shadow.querySelector("#contentPageLang");
                        let userLang = this.shadow.querySelector("#contentUserLang");

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

                        let selectLang = this.shadow.querySelectorAll(".select-lang");
                        selectLang[0].onchange = () => this.changeLanguage(pageLang.value, userLang.value);
                        selectLang[1].onchange = () => this.changeLanguage(pageLang.value, userLang.value);

                    });
                }

                this.shadow.querySelector(".modal-body").style.background = `url(${chrome.runtime.getURL('icons/loading.gif')}) center center no-repeat`;

                this.shadow.querySelector("iframe").onload = () => {
                    this.shadow.querySelector("iframe").contentWindow.postMessage({action: "hideHeader"}, "*");
                };

                this.shadow.querySelector("iframe").src = this.url;

                this.shadow.querySelector(".close").onclick = () => this.destroy();
                this.shadow.querySelector(".new-tab").onclick = () => this.openNewTab();
                let modal = this.shadow.querySelector(".modal");
                modal.onclick = (event) => {
                    if (event.target === modal) {
                        this.destroy();
                    }
                };

                return true;
            });
    }

    changeLanguage(from, to) {
        this.shadow.querySelector("iframe").contentWindow.postMessage({action: "changeLang", from: from, to: to}, "*");
    }

    openNewTab() {
        let url = this.shadow.querySelector("iframe").src;
        chrome.runtime.sendMessage({action: 'newTab', url: url});
    }

    show() {
        this.shadow.querySelector(".modal").style.display = "block";
    }

    hide() {
        this.shadow.querySelector(".modal").style.display = "none";
    }

    destroy() {
        this.element.remove();
    }
}
