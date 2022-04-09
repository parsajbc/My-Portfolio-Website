var contacts = document.getElementById("Mycontacts");

var navbar = document.getElementById("MyNav");

var btn = document.getElementById("myBtn");

var span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
    contacts.style.display = "block";
    navbar.style.display = "none";
}

span.onclick = function () {
    contacts.style.display = "none";
    navbar.style.display = "flex";
}

window.onclick = function (event) {
    if (event.target == contacts) {
        contacts.style.display = "none";
        navbar.style.display = "flex";
    }
}

resume = document.getElementById("resume_tab2");

var resScroll = function () {
    var y = window.scrollY;
    if (y >= 250) {
        resume.style.display = "block";
        resume.setAtribute("onmouseover", "castShadow()");
    } else {
        resume.style.display = "none";
        resume.setAtribute("onmouseover", "");
    }
};

window.addEventListener("scroll", resScroll);

function castShadow() {
    var shadow = document.getElementById("shadow");
    shadow.style.display = "block";
}

function uncastShadow() {
    var shadow = document.getElementById("shadow");
    shadow.style.display = "none";
}