class Config {

    constructor(loadConfig = true, ready_cb = null) {
        if (loadConfig) {
            Config.loadConfig().then(() => {
                if (ready_cb && typeof ready_cb === "function") {
                    ready_cb(Config.config);
                }
            });
        }
    }

    static async defaultOptions (){
        let defaultLanguage = (await Config.getLanguages()).text.find(o => o.code === Config.getDefaultLanguage()) ? Config.getDefaultLanguage() : "es";

        let defaultDomain = Config.getGoogleTranslatorDomain();

        return {
            'pageLang': 'auto',
            'userLang': defaultLanguage,
            'ttsLang': 'en-US',
            'tpPageLang': 'auto',
            'tpUserLang': defaultLanguage,
            'enableTT': true,
            'enableTTS': true,
            'enableTP': true,
            'selectedDomain': 'global',
            'openMode': 'newTab',
            'gtDomain': Config.getGoogleTranslatorDomain(),
            'translateURL': `https://${defaultDomain}/?sl=auto&tl=${defaultLanguage}&text=`,
            'ttsURL': `https://${defaultDomain}/translate_tts?ie=UTF-8&total=1&idx=0&client=tw-ob&tl=en-US&q=`,
            'translatePageURL': `https://${defaultDomain}/translate?sl=auto&tl=${defaultLanguage}&u=`
        }
    }

    static async getOptions() {
        let defaultOptions = await Config.defaultOptions();

        return new Promise((resolve, reject) => {
            chrome.storage.local.get(defaultOptions, items => {
                resolve(items);
            });
        });
    }

    static async getOption(option) {
        let defaultOptions = await Config.defaultOptions();

        return new Promise((resolve, reject) => {
            chrome.storage.local.get(option, items => {
                if(items.hasOwnProperty(option)) {
                    resolve(items[option]);
                } else if(defaultOptions.hasOwnProperty(option)){
                    resolve(defaultOptions[option]);
                } else {
                    reject();
                }
            });
        });
    }

    static async setOptions(options) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.set(options, items => {
                resolve(items);
            });
        });
    }

    static async loadConfig() {
        let promises = [];
        promises.push(Config.getOptions().then(config => {
            return Config.config = config;
        }));
        promises.push(Config.getLanguages().then(languages => {
            return Config.supportedLanguages = languages;
        }));
        return Promise.all(promises);
    }

    static async getLanguages() {
        return await (await fetch(chrome.runtime.getURL('supported_languages.json'))).json();
    }

    static getDefaultLanguage() {
        return navigator.language.toLowerCase().split('-')[0];
    }

    static getGoogleTranslatorDomain() {
        let offset = new Date().getTimezoneOffset();
        // Domain for China
        if (offset / 60 === -8) {
            return "translate.google.cn";
            // Domain for rest of world
        } else {
            return "translate.google.com";
        }
    }
}