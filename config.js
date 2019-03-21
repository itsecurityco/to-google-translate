class Config {

    constructor(ready_cb = null) {
        this.getOptions().then(config => {
            this.config = config;
            if (ready_cb && typeof ready_cb === "function") {
                ready_cb(this.config);
            }
        });
    }

    async getOptions() {
        let defaultLanguage = (await this.getLanguages()).text.find(o => o.code === Config.getDefaultLanguage()) ? Config.getDefaultLanguage() : "es";

        let defaultDomain = this.getGoogleTranslatorDomain();

        return new Promise((resolve, reject) => {
            chrome.storage.local.get({
                'pageLang': 'auto',
                'userLang': defaultLanguage,
                'ttsLang': 'en-US',
                'TPpageLang': 'auto',
                'TPuserLang': defaultLanguage,
                'enableTT': true,
                'enableTTS': true,
                'enableTP': true,
                'selectedDomain': 'global',
                'gtDomain': this.getGoogleTranslatorDomain(),
                'translateURL': `https://${defaultDomain}/?sl=${pageLang.value}&tl=${userLang.value}&text=`,
                'ttsURL': `https://${defaultDomain}/translate_tts?ie=UTF-8&total=1&idx=0&client=tw-ob&tl=${ttsLang.value}&q=`,
                'translatePageURL': `https://${defaultDomain}/translate?sl=${TPpageLang.value}&tl=${TPuserLang.value}&u=`
            }, items => {
                resolve(items);
            });
        });
    }

    async getLanguages() {
        return await (await fetch(chrome.runtime.getURL('supported_languages.json'))).json();

    }

    static getDefaultLanguage() {
        return navigator.language.toLowerCase().split('-')[0];
    }

    getGoogleTranslatorDomain() {
        let offset = new Date().getTimezoneOffset();
        // Domain for China
        if (offset / 60 == -8) {
            return "translate.google.cn";
            // Domain for rest of world
        } else {
            return "translate.google.com";
        }
    }
}