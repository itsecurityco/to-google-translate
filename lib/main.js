/* To Google Translate
 * 
 * This extensión create a context menu in your firefox with a item 
 * named "To Google Translate". When you click it, It send the previously 
 * selected text to Google Tranaslate. The default directión for translation is: 
 * from English to Spanish.
 * 
 * version: 0.2
 * license: MPL 2.0
 * author: Juan M. Escobar T.
 * email: juanmauricioescobar@gmail.com 
 * twitter: @itsecurityco */

var contextMenu = require("sdk/context-menu")
var tabs = require("sdk/tabs")
var self = require("self")

var menuItem = contextMenu.Item({
    label: "To Google Translate",
    image: self.data.url("icon.png"),
    context: contextMenu.SelectionContext(),
    contentScript: 'self.on("click", function() {' +
                    '   var text = window.getSelection().toString();' +
                    '   self.postMessage(text);' +
                    '});',
    onMessage: function(selectionText) {
        tabs.open("http://translate.google.com/#en/es/" + encodeURIComponent(selectionText))
    }
});