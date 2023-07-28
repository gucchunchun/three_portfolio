// header size over
const headerLogoTitleBox = document.getElementById("header-logoTitle");
const headerLogo = document.getElementById("header-logo");
const headerTitle = document.getElementById("header-title");
const naviBox = document.getElementById("navi");
var isheaderLogo = true;
const headerLogoWidth = 142; //header=160px, padding=8px
var criteria = 80

function pritty_header() {
    var naviX = naviBox.getBoundingClientRect().x 
    var logoRight = headerLogoTitleBox.getBoundingClientRect().right 
    if (isheaderLogo&&naviX-logoRight< criteria) {
        headerLogo.style.display = "none";
        isheaderLogo = false;
    }else if (isheaderLogo==false&&naviX -logoRight> criteria + headerLogoWidth){
        headerLogo.style.display = "inline-block";
        isheaderLogo = true;
    }
} 
addEventListener("load", pritty_header);
addEventListener("resize", pritty_header);


// accesibility cutomise
const html = document.querySelector("html");
const body = document.body;
const customiseDiv = document.getElementById("customise");
const defaultCOption = document.getElementById("defaultC");
const whiteBOption = document.getElementById("whiteBC");
const blackBOption = document.getElementById("blackBC");
const largeFOption = document.getElementById("largeF");
const mediumFOption = document.getElementById("mediumF");
const defaultFOption = document.getElementById("defaultF");
const defaultButton = document.getElementById("defaultButton");
const saveButton = document.getElementById("saveButton");
const COButtonContainer = document.getElementById("customiseButton-container");
const COButton = document.getElementById("customiseButton");

const black = "#152223";
const white = "#ffffff";
const colour1 = "#1b3d3d";
const colour2 = "#ea9c3c";
const colour3 = "#e52820";

let wasOpen = false;


class Colour_setting{
    constructor(checkedElem){
        this.checked = checkedElem;
        this.setting = undefined;
    }
    set() {
        let isChanged = true;
        switch (this.checked) {
            case this.setting:
                isChanged = false;
                break;
            case defaultCOption:
                headerLogo.src = "img/logo.svg";
                headerTitle.src = "img/titile.svg";
                body.className = "";
                this.setting = defaultCOption;
                break;
            case whiteBOption:
                headerLogo.src = "img/black_logo.svg";
                headerTitle.src = "img/black_titile.svg";
                body.className = "whiteB";
                this.setting = whiteBOption;
                break;
            case blackBOption:
                headerLogo.src = "img/white_logo.svg";
                headerTitle.src = "img/white_titile.svg";
                body.className = "blackB";
                this.setting = blackBOption;
                break;
        }
        if(isChanged){
            this.setting = this.checked;
            this.checked.checked = true;
        }
    }
    update_setting(newElem) {
        this.checked.checked = false;
        newElem.checked = true;
        this.checked = newElem;
        this.set();
    }
}
class Fontsize_setting {
    constructor(checkedElem){
        this.checked = checkedElem;
        this.setting = undefined;
    }
    set() {
        let isChanged = true;
        switch (this.checked) {
            case this.setting:
                isChanged = false;
                break;
            case largeFOption:
                html.style.fontSize = "160%";
                break
            case mediumFOption:
                html.style.fontSize = "130%";
                break
            case defaultFOption:
                html.style.fontSize = "100%";
                break
        };
        if(isChanged){
            this.setting = this.checked;
            this.checked.checked = true;
        }
    }
    update_setting(newElem) {
        this.checked.checked = false;
        newElem.checked = true;
        this.checked = newElem;
        this.set();
    }
}
customiseDiv

var fontsize = new Fontsize_setting(defaultFOption);
fontsize.set();
var colour = new Colour_setting(defaultCOption);
colour.set();

function set_fontsize(event) {
    var option = event.querySelector("input");
    fontsize.update_setting(option);
}
function set_colour(event) {
    var option = event.querySelector("input");
    colour.update_setting(option);
}

function process_setting(event){
    var target = event.target
    if (target == defaultButton) {
        if (fontsize.setting != defaultFOption) {
            fontsize.update_setting(defaultFOption);
        }
        if (colour.setting != defaultCOption) {
            colour.update_setting(defaultCOption);
        }
    }
    customiseDiv.classList.add("hidden");
    window.scrollTo(0,0);
}


//fix
// if (wasOpen==false){
//     open_customise();
//     isOpen=true;
// }

