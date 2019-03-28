if (window.top !== window.self) {
    if (document.querySelector("#contentframe > iframe")) {
        let items = document.querySelectorAll("body > div:not(#contentframe)");
        for (let elm of items) {
            elm.style.display = "none";
        }
        document.querySelector("#contentframe").style.top = "0";
    }
}