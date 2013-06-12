/* To Google Translate
 * 
 * This extension create two context menu in your firefox with a item 
 * named "To Google Translate" and "To Google Translate Voice". 
 * When you click it, It send the previously selected text to 
 * Google Translate for translating and to Google Translate Voice
 * for play the text. The default direction for translation/play is: 
 * from English to Spanish.
 * 
 * version: 0.3
 * license: MPL 2.0
 * author: Juan M. Escobar T.
 * email: juanmauricioescobar@gmail.com 
 * twitter: @itsecurityco */

// Import the context-menu API 
var contextMenu = require("sdk/context-menu")
// Import the tabs API 
var tabs = require("sdk/tabs")
// Import the self API
var self = require("sdk/self")

// Create a Menu Item
// It will send the selected text to Google Translate 
// for translation
var menuItem = contextMenu.Item({
    label: "To Google Translate",
    image: self.data.url("gtranslate.png"),
    context: contextMenu.SelectionContext(),
    contentScript: 'self.on("click", function() {' +
                    '   var text = window.getSelection().toString();' +
                    '   self.postMessage(text);' +
                    '});',
    onMessage: function(selectionText) {
        tabs.open("http://translate.google.com/#en/es/" + encodeURIComponent(selectionText))
    }
});

// Create a Menu Item
// It will send the selected text to translate.google.com/translate_tts?&tl=en&q=
// The page will play the text to voice
var menuItem2 = contextMenu.Item({
    label: "To Google Translate Voice",
    image: self.data.url("mic.png"),
    context: contextMenu.SelectionContext(),
    contentScript: 'self.on("click", function() {'+
                    '   var text = window.getSelection().toString();' +
                    '   self.postMessage(text);' +
                    '});',
    onMessage: function(selectionText) {
        tabs.open("http://translate.google.com/translate_tts?tl=en&q=" + encodeURIComponent(selectionText))
    }
});