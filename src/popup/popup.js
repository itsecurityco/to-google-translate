
document.addEventListener("DOMContentLoaded", function () {
    Config.getOption('translateURL').then(value => {
        if (value) {
            document.getElementById("google_translate").src = value;
        }
    });
});