/**************************************************************/
// html_form.js
/**************************************************************/
MODULENAME = "html_form.js";
console.log('%c' + MODULENAME + ': ', 'color: blue;');

/*******************************************************/
// Constants and variables
/*******************************************************/
//Regex
const form_NONNUMBER = /[^0-9]/g;
const form_SPACE = /\s/g;
const form_NONSTRING = /[^a-zA-Z]/g;

//Limits
const form_AGELIMIT = 16;
const form_AGEMAX = 99;

const form_PHONENUMLIMIT = 10;
const form_PHONENUMMAX = 20;

const form_USERNAMELIMIT = 1;
const form_USERNAMEMAX = 20;

const form_STRINGLIMIT = 1;
const form_STRINGMAX = 20;

//Validation
let form_dataValid = true;

//Form varaibles
const form_GENDERS = ["male", "female", "other"];
let form_userName;
let form_userAge;
let form_userPN;
let form_userCountry;
let form_userAddress;
let form_userGender;
/*************************************************************/
//form_validate()
//validates user input
//called by: form_validateData();
//input: value, type, msgId, id, limit, max, comparison
//return: validated value.
/*************************************************************/
function form_validate(value, type, msgId, id, limit, max, comparison) {
  console.log("form_validate();");

  document.getElementById(id).innerHTML = "";
  document.getElementById(msgId).innerHTML = "";

  //Checking if value was null
  if (value == null || value == "") {
    form_dataValid = false;
    document.getElementById(msgId).innerHTML = "Invalid value.";
    return;
  }
  //Number validation
  if (type == "Number") {
    value = value.replace(form_NONNUMBER, "");
    value = value.replace(form_SPACE, "");

    if (value == "") {
      form_dataValid = false;
      document.getElementById(msgId).innerHTML = "Invalid value.";
      return;
    }

    if (comparison == "Size") {
      if (value < limit || value > max || value <= 0) {
        form_dataValid = false;
        document.getElementById(msgId).innerHTML = "Value too large or too small.";
        return;
      }
    }

    if (comparison == "Length") {
      if (value.length < limit || value.length > max || value <= 0) {
        form_dataValid = false;
        document.getElementById(msgId).innerHTML = "Length too long or short.";
        return;
      }
    }
  }
  //String validation
  if (type == "String") {
    value = value.replace(form_SPACE, "");
    value = value.replace(form_NONSTRING, "");

    if (value == "") {
      form_dataValid = false;
      document.getElementById(msgId).innerHTML = "Invalid value.";
      return;
    }

    //Checking string length
    if (value.length < limit || value.length > max) {
      form_dataValid = false;
      document.getElementById(msgId).innerHTML = "Length too long or short.";
      return;
    }
  }
  return value;
}


/*************************************************************/
//form_submit()
//submits user input
//called by: submit button
/*************************************************************/
function form_submit() {
  console.log("form_submit();");

  //Getting the values from the form
  form_userName = document.getElementById("userName").value;
  form_userAge = document.getElementById("userAge").value;
  form_userPN = document.getElementById("userPN").value;
  form_userAddress = document.getElementById("userAddress").value;
  form_userCountry = document.getElementById("userCountry").value;

  //Checking which radio button was selected
  form_checkBox();

  //Validating data
  form_dataValid = true;
  form_validateData();

  //Writing to database
  form_write();
}

/*************************************************************/
//form_checkBox()
//checks which box was selected
//called by: form_submit();
/*************************************************************/
function form_checkBox() {
  console.log("form_checkBox();");

  //Looping through an array of ids, checking which gender the user
  //selected
  for (i = 0; i < form_GENDERS.length; i++) {
    form_userGender = form_GENDERS[i];
    if (document.getElementById(form_userGender).checked) {
      form_userGender = document.getElementById(form_userGender).value;
      console.log(form_userGender);
      break;
    }
  }
}

/*************************************************************/
//form_write()
//Writes to database
//called by: form_submit();
/*************************************************************/
function form_write() {
  console.log("form_write();");

  //Checking if validation was sucessful
  if (form_dataValid === false) {
    console.log("Validation failed.")
    return;
  }

  //Disabling submit button
  x = document.getElementById("submitButton");
  x.disabled = true;
  alert("Submitted");

  //Updating registration status
  fbV_registerStatus = "registered";
  sessionStorage.setItem("registerStatus", fbV_registerStatus);

  //Writing registration detials to database, and creating the highscores for the user for the first time.
  for (i = 0; i < fbV_USERHIGHSCORES.length; i++) {
    let highScores = fbV_USERHIGHSCORES[i];
    highScores.userName = fbV_registerDetails.userName;
    highScores.score = 0;
    highScores.highScore = 0;
    highScores.uid = fbV_userDetails.uid;
    highScores.photoURL = fbV_userDetails.photoURL;
  }
  //Save after writing newly registered data (in callback);
  fb_writeRec(fbV_FLAPPYSCOREPATH, fbV_flappyHighScore.uid, fbV_flappyHighScore, fbR_procWriteError, manager_saveValues);
  fb_writeRec(fbV_PFSCOREPATH, fbV_PFHighScore.uid, fbV_PFHighScore, fbR_procWriteError, manager_saveValues);

  console.log(fbV_registerDetails);
  fb_writeRec(fbV_REGISTRATIONPATH, fbV_userDetails.uid, fbV_registerDetails, fbR_procWriteError, form_registerSuccess, manager_saveValues);
}

/*************************************************************/
//form_validateData()
//calls validate for all form values
//called by: form_submit();
/*************************************************************/
function form_validateData() {
  console.log("form_validateData();");
  //Validating data
  fbV_registerDetails.userName = form_validate(form_userName, "String", "nameMsg", "userName", form_USERNAMELIMIT, form_USERNAMEMAX);
  fbV_registerDetails.userAge = form_validate(form_userAge, "Number", "ageMsg", "userAge", form_AGELIMIT, form_AGEMAX, "Size");
  fbV_registerDetails.userPN = form_validate(form_userPN, "Number", "phoneMsg", "userPN", form_PHONENUMLIMIT, form_PHONENUMMAX, "Length");
  fbV_registerDetails.userAddress = form_validate(form_userAddress, "String", "addressMsg", "userAddress", form_STRINGLIMIT, form_STRINGMAX);
  fbV_registerDetails.userCountry = form_validate(form_userCountry, "String", "countryMsg", "userCountry", form_STRINGLIMIT, form_STRINGMAX);
  fbV_registerDetails.userGender = form_userGender;
}

/*************************************************************/
//form_registerSuccess()
//A callback function that is passed in write rec,
//called when write is finished to inform user.
/*************************************************************/
function form_registerSuccess() {
  console.log("form_registerSuccess();")
  alert("Sucessful registration.");
  window.location = "https://12comp-programming-and-db-assessment-martinjin2.12comp-gl-2023.repl.co/html/html_games.html";
}
/*******************************************************/
//  END OF APP
/*******************************************************/