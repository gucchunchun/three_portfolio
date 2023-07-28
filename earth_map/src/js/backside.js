//node
const loginForm = document.getElementById('login-form');
const signinForm = document.getElementById('signin-form');
const loginID = document.getElementById("login-id");
const loginPass = document.getElementById("login-pass");
const signinID = document.getElementById("signin-id");
const signinPass = document.getElementById("signin-pass");
const loginButton = document.getElementById("login-button");
const signinButton = document.getElementById("signin-button");
const navi = document.getElementById("navi");

//json
const JSON_PATH ="data/user.json";
let jsonData=undefined;

//userdata
let userData;
let template = {
    "password":undefined,
    "pin":[],
    "frined":[],
    "cutomise":{
      "color":"default",
      "fontsize":"default"
    }
};

//error message creater
const Emessage = {
    INVARID:"type valid ID & password",
    WRONG:"password you typed was wrong",
    IDLESS:"ID must be at least 4 characters long",
    PASSLESS:"password must be at least 4 characters long",
    USED:"this ID is already in use"
}

class Error {
    constructor(container) {
        this.container = container;
        this.errorPoints = [];
        this.errors = [];
    }
    insertError() {
        for (let errorPoint of this.errorPoints) {
            const errorElem  = document.createElement("p");
            errorElem.innerHTML = errorPoint[1];
            this.container.insertBefore(errorElem, errorPoint[0])
            this.errors.push(errorElem);
        }
    }
    clearError() {
        for (let error of this.errors) {
        error.remove();
        }
        this.errorPoints = [];
        this.errors = [];
    }
}

//loading json
async function load_json() {
    return new Promise((resolve,reject) => {
        if (!jsonData) {
            fetch(JSON_PATH)
            .then(response => response.json())
            .then(data => {
                jsonData = data;
                resolve(jsonData);
                reject("error");
            })
        }else {
            resolve(jsonData);
            reject("error");
        }
        
    });
}
//rerite if threre is any change
//can not do only with JS(does not work now)
async function write_json(new_data) {
    const jsonString = JSON.stringify(new_data);
    fetch(JSON_PATH, {
        method: 'PUT', // Or 'POST' if you want to create a new file
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonString
    }).then(()=>{
        console.log("json updated");
    }).catch(() => {
        console.log("error has occured");
    });
}
// Function to retrieve URL parameters
function getParameterByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
const loginError = new Error(loginForm);
function login_user() {
    loginError.clearError();
    const id = loginID.value;
    const pass = loginPass.value;
    if(!id||!pass){
        loginError.errorPoints.push([loginID,Emessage.INVARID]);
    }else {
        load_json().then(data => {
            if (id in data.users) {
                if (pass == data.users[id].password) {
                    alert("Hello!" + id)
                    userData = data.users[id];
                    let info = "?=data"+id;
                    navi.querySelectorAll("A")[0].href += info;
                    toggle_hidden('login-box');
                }else {
                    loginError.errorPoints.push([loginPass, Emessage.WRONG]);
                }
            }else {
                loginError.errorPoints.push([loginID, Emessage.INVARID]);
            }
            loginError.insertError();
        });
    }
    loginError.insertError();
}
const signinError = new Error(signinForm);
function signin_user() {
    signinError.clearError();
    const id = signinID.value;
    const pass = signinPass.value;
    let idLong = true;
    let insertError = false;
    if (!id||id<5){
        idLong = false;
        signinError.errorPoints.push([signinID, Emessage.IDLESS]);
    }
    if (!pass||pass<5){
        signinError.errorPoints.push([signinPass, Emessage.PASSLESS]);
    }
    if(idLong) {
        load_json().then((data)=>{
            if (id in data.users) {
                signinError.errorPoints.push([signinID, Emessage.USED]);
            }else {
                template["password"] = pass;
                userData = template;
                data.users.id = template;
                jsonData = data;
                write_json(jsonData);
            }
            signinError.insertError();
            insertError = true;
        });
    }
    if (insertError = false){
        signinError.insertError();
    }
    
}

loginButton.addEventListener("click", login_user);
signinButton.addEventListener("click", signin_user);
addEventListener("load", () => {
    // Get the value of the "data" parameter from the URL
    const dataValue = getParameterByName('data');
    if (dataValue) {
        load_json().then((data=>{
            userData = data[dataValue]
            const userid = dataValue;
            const info = "?data=" + userid;
            navi.querySelectorAll("A")[0].href += info;
        }))
    }
})
