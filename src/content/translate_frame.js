if (window.top !== window.self) {
    window.addEventListener('message', function (event) {
        let url = new URL(location.href);

        if (event.data.action === "changeLang" && location.hostname === "translate.google.com" && url.searchParams.has("tl")) {
            url.searchParams.set('sl', event.data.from);
            url.searchParams.set('tl', event.data.to);
            window.location.replace(url.toString());
        } else if (event.data.action === "hideHeader" && document.querySelector("#contentframe > iframe") && location.hostname === "translate.google.com") {
            let items = document.querySelectorAll("body > div:not(#contentframe)");
            for (let elm of items) {
                elm.style.display = "none";
            }
            document.querySelector("#contentframe").style.top = "0";
        }
    }, false);
}
