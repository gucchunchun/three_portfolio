//node
const loginForm = document.getElementById('login-form');
const signinForm = document.getElementById('signin-form');
const loginID = document.getElementById("login-id");
const loginPass = document.getElementById("login-pass");
const signinID = document.getElementById("signin-id");
const signinPass = document.getElementById("signin-pass");


function toggle_hidden(id) {
    const elem = document.getElementById(id);
    if (elem.classList.contains('hidden')) {
        elem.classList.remove("hidden");
    }else {
        elem.classList.add("hidden");
    }

}
