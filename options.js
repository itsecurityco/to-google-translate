function saveOptions(e) {
  e.preventDefault();
  browser.storage.local.set({
    from: document.querySelector("#from").value,
    to: document.querySelector("#to").value
  });

  document.querySelector("#note").style.display = 'block';
  setTimeout(function() {
    document.querySelector("#note").style.display = 'none';
  }, 3000);
}

function restoreOptions() {
  function setCurrentChoice(result) {
    document.querySelector("#from").value = result.from || "en";
    document.querySelector("#to").value = result.to || "es";
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.local.get(["from", "to"]);
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);