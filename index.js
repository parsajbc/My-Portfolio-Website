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