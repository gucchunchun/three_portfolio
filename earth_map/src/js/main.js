//node
const loginForm = document.getElementById('login-form');
const signinForm = document.getElementById('signin-form');
const loginID = document.getElementById("login-id");
const loginPass = document.getElementById("login-pass");
const signinID = document.getElementById("signin-id");
const signinPass = document.getElementById("signin-pass");
const canvas = document.getElementById("canvas");

function toggle_hidden(id) {
    const elem = document.getElementById(id);
    if (elem.classList.contains('hidden')) {
        elem.classList.remove("hidden");
    }else {
        elem.classList.add("hidden");
    }
}

//select2
const countryNames = [
"Albania", "Algeria", "American Samoa", "Andorra", "Angola", 
"Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", 
"Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", 
"Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", 
"Benin", "Bermuda", "Bhutan", "Bolivia, Plurinational State of", "Bosnia and Herzegovina", 
"Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", 
"Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", 
"Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", 
"China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", 
"Congo, the Democratic Republic of the", "Cook Islands", "Costa Rica", "Côte d'Ivoire", 
"Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", 
"Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", 
"Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", 
"French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", 
"Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", 
"Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", 
"Heard Island and McDonald Islands", "Holy See (Vatican City State)", "Honduras", 
"Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran, Islamic Republic of", 
"Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", 
"Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", 
"Kuwait", "Kyrgyzstan", "Lao People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", 
"Libyan Arab Jamahiriya", "Liechtenstein", "Lithuania", "Luxembourg", "Macao", 
"Macedonia, the former Yugoslav Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", 
"Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", 
"Micronesia, Federated States of", "Moldova, Republic of", "Monaco", "Mongolia", "Montenegro", "Montserrat", 
"Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", 
"Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", 
"Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", 
"Palestinian Territory, Occupied", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", 
"Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Réunion", "Romania", "Russian Federation", 
"Rwanda", "Saint Helena, Ascension and Tristan da Cunha", "Saint Kitts and Nevis", "Saint Lucia", 
"Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino", 
"Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", 
"Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", 
"South Georgia and the South Sandwich Islands", "Spain", "Sri Lanka", "Sudan", "Suriname", 
"Svalbard and Jan Mayen", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", 
"Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Timor-Leste", 
"Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", 
"Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", 
"United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", 
"Venezuela, Bolivarian Republic of", "Viet Nam", "Virgin Islands, British", "Virgin Islands, U.S.", 
"Wallis and Futuna", "Western Sahara", "Yemen", "Zambia", "Zimbabwe", "Afghanistan"
];

$(document).ready(function () {
  // Get a reference to the select element using its ID
  const countrySelect = $('#countrySelect');

  // Populate the select element with options
  countryNames.forEach((country) => {
    const option = new Option(country, country);
    countrySelect.append(option);
  });

  // Initialize select2 on the select element
  countrySelect.select2();
  countrySelect.on("change", function () {
    const selectedValue = countrySelect.val();
    console.log(selectedValue);
    // Call your custom function here with the selectedValue if needed
    // yourCustomFunction(selectedValue);
  });
});