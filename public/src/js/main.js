function hasClass(element, className) {
    className = " " + className + " ";

    if ((" " + element.className + " ").replace(/[\n\t]/g, " ").indexOf(className) > -1) {
        return true;
    } else {
        return false;
    }
}
document.addEventListener('DOMContentLoaded', () => {
    var carousels = bulmaCarousel.attach();

    var acc = document.getElementsByClassName("accordion");
    var panel = document.getElementsByClassName("panel");

    // make first item active
    var firstPanel = acc[0].nextElementSibling;
    acc[0].classList.toggle("active");
    firstPanel.style.maxHeight = firstPanel.scrollHeight + "px";

    var i;
    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            var j;
            for (j = 0; j < acc.length; j++) {
                var panel = acc[j].nextElementSibling;
                if (acc[j] === this) {
                    this.classList.toggle("active");

                    if (panel.style.maxHeight) {
                        panel.style.maxHeight = null;
                    } else {
                        panel.style.maxHeight = panel.scrollHeight + "px";
                    }
                } else {
                    acc[j].classList.remove("active")
                    panel.style.maxHeight = null;
                }
            }
        });
    }
});


