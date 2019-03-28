if (window.top !== window.self) {
    if (document.querySelector("#contentframe > iframe")) {
        let items = document.querySelectorAll("body > div:not(#contentframe)");
        for (let elm of items) {
            elm.style.display = "none";
        }
        document.querySelector("#contentframe").style.top = "0";
    }

    window.addEventListener('message', function (event) {
        if (event.data.action === "changeLang") {
            if (location.hostname !== "translate.googleusercontent.com" && location.hostname !== "translate.googleusercontent.cn" && document.querySelector("iframe")) {
                document.querySelector("iframe").contentWindow.postMessage({
                    action: "changeLang",
                    from: event.data.from,
                    to: event.data.to
                }, "*");
            } else {
                let url = new URL(location.href);
                url.searchParams.set('sl', event.data.from);
                url.searchParams.set('tl', event.data.to);
                window.location.replace(url.toString());
            }
        }
    }, false);
}