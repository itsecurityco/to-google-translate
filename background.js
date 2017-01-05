function onError(error) {
  console.log(`Error: ${error}`);
}

function onGot(item) {
  var from = "en";
  var to = "es";

  if (item.from) from = item.from;
  if (item.to) to = item.to;
  
  var url = `https://translate.google.com/#${from}/${to}/`;

  browser.contextMenus.create({
    id: "translate",
    title: browser.i18n.getMessage("contextMenuTitle") + ` [${from}/${to}]`,
    contexts: ["all"]
  });

  browser.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId == "translate") {
        var selected_text = info.selectionText;
        browser.tabs.create({
            url: url + encodeURIComponent(selected_text)
        });
    }
  });
}

var getting = browser.storage.local.get(["from", "to"]);
getting.then(onGot, onError);