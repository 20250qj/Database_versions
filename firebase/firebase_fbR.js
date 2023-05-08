/**************************************************************/
// firebase_fbR
/**************************************************************/
MODULENAME = "firebase_fbR.js";
console.log('%c' + MODULENAME + ': ', 'color: blue;');

/**************************************************************/
// fbR_procUserLogin(user, _save, loginStatus, _callBack)
// Process user login data
// Input:  the user's data and loucation to save data to, _callBack function.
/**************************************************************/
function fbR_procUserLogin(user, _save, loginStatus, _callBack) {
  console.log("fbR_procUserLogin();")

  //Saving the login data
  loginStatus = 'logged in';
  _save.uid = user.uid;
  _save.email = user.email;
  _save.name = user.displayName;
  _save.photoURL = user.photoURL;

  //Reading the user high scores path and saving it when it is done.
  fb_readRec(fbV_FLAPPYSCOREPATH, _save.uid, fbV_flappyHighScore, fbR_procUserHighScore, manager_saveValues);
  fb_readRec(fbV_PFSCOREPATH, _save.uid, fbV_PFHighScore, fbR_procUserHighScore, manager_saveValues);
  
  fb_writeRec(fbV_LOGINDETAILSPATH, _save.uid, _save, fbR_procWriteError, _callBack);

  console.log('fbR_login: status = ' + loginStatus);
}

/**************************************************************/
// fbR_initialise()
// Called by setup()
// Initialize firebase
/**************************************************************/
function fbR_initialise() {
  console.log('%cfb_initialise: ', 'color: brown;');

  var FIREBASECONFIG = {
    apiKey: fbV_apiKey,
    authDomain: fbV_authDomain,
    databaseURL: fbV_databaseURL,
    projectId: fbV_projectId,
    storageBucket: fbV_storageBucket,
    messagingSenderId: fbV_messagingSenderId,
    appId: fbV_appId,
    measurementId: fbV_measurementId
  };

  // Check if firebase already initialised
  if (!firebase.apps.length) {
    firebase.initializeApp(FIREBASECONFIG);
    database = firebase.database();
  }
}

/**************************************************************/
// fbR_procUserDetails(snapshot, _save, readStatus)
// Processes userDetails path
// Input:  the data and loucation to save to
/**************************************************************/
function fbR_procUserDetails(snapshot, _save, readStatus) {
  console.log("fbR_procUserDetails();");
  if (snapshot.val() == null) {
    readStatus = "Not found";
  }
  else {
    readStatus = "OK";
    console.log(snapshot.val());
    let dbData = snapshot.val();

    _save.email = dbData.email;
    _save.uid = dbData.uid;
    _save.name = dbData.name;
    _save.photoURL = dbData.photoURL;
  }
  console.log('fbR_procUserDetails: status = ' + readStatus);
}

/**************************************************************/
// fbR_procUserRoles(snapshot, _save, readStatus)
// Processes userRoles path
// Input: the data and loucation to save to
/**************************************************************/
function fbR_procUserRoles(snapshot, _save, readStatus) {
  console.log("fbR_procUserRoles();");
  if (snapshot.val() == null) {
    readStatus = "Not found";
  }
  else {
    readStatus = "OK";
    console.log(snapshot.val());
    let dbData = snapshot.val();

    _save.role = dbData.role;
    _save.name = dbData.name;
  }
  console.log('fbR_procUserRoles: status = ' + readStatus);
}

/**************************************************************/
// fbR_procUserDetailsAll(snapshot, _save, readStatus)
// Process for readAll for the userDetails path
// Input:  the data and loucation to save to
/**************************************************************/
function fbR_procUserDetailsAll(snapshot, _save, readStatus) {
  console.log("fbR_procUserDetailsAll();")
  if (snapshot.val() == null) {
    readStatus = "Not found";
  }
  else {
    readStatus = "OK";
    console.log(snapshot.val());
    let dbData = snapshot.val();
    console.log(dbData);
    let dbKeys = Object.keys(dbData);
    console.log(dbKeys);

    for (i = 0; i < dbKeys.length; i++) {
      let key = dbKeys[i];
      _save.push({
        name: dbData[key].name,
        score: dbData[key].score
      })
    }
  }
  console.log('fbR_procUserDetailsAll: status = ' + readStatus);
}

/**************************************************************/
// fbR_procUserRolesAll(snapshot, _save, readStatus)
// Process read all data in user roles path
// Input:  the data and loucation to save to
/**************************************************************/
function fbR_procUserRolesAll(snapshot, _save, readStatus) {
  console.log("fbR_procUserRolesAll();")
  if (snapshot.val() == null) {
    readStatus = "Not found";
  }
  else {
    readStatus = "OK";
    console.log(snapshot.val());
    let dbData = snapshot.val();
    let dbKeys = Object.keys(dbData);
    console.log(dbKeys);

    for (i = 0; i < dbKeys.length; i++) {
      let key = dbKeys[i];
      _save.push({
        role: dbData[key].role,
        name: dbData[key].name
      })
    }
  }
  console.log('fbR_procUserRolesAll: status = ' + readStatus);
}

/**************************************************************/
// fbR_procUserHighScore(snapshot, _save, readStatus, _callBack)
// Processes userHighScores path
// Input: the data and loucation to save to, optional _callBack
/**************************************************************/
function fbR_procUserHighScore(snapshot, _save, readStatus, _callBack) {
  console.log("fbR_procUserHighScore();");
  if (snapshot.val() == null) {
    readStatus = "Not found";
  }
  else {
    readStatus = "OK";
    console.log(snapshot.val());
    let dbData = snapshot.val();

    _save.highScore = dbData.highScore;
    _save.score = dbData.score;
    _save.uid = dbData.uid;
    _save.photoURL = dbData.photoURL;
    _save.name = dbData.name;
  }

  console.log('fbR_procUserHighScore: status = ' + readStatus);

  //Calling the call back function if given one
  if (_callBack != null) {
    _callBack();
  }
}

/**************************************************************/
// fbR_procFlappyUserHighScoreAll(snapshot, _save, readStatus, _callBack)
// Process read all data in user high scores path
// Input:  the data and loucation to save to, optional _callBack function. 
/**************************************************************/
function fbR_procFlappyUserHighScoreAll(snapshot, _save, readStatus, _callBack) {
  console.log("fbR_procFlappyUserHighScoreAll();")
  if (snapshot.val() == null) {
    readStatus = "Not found";
  }
  else {
    readStatus = "OK";
    console.log(snapshot.val());
    let dbData = snapshot.val();
    let dbKeys = Object.keys(dbData);
    console.log(dbKeys);

    for (i = 0; i < dbKeys.length; i++) {
      let key = dbKeys[i];
      _save.push({
        name: dbData[key].name,
        highScore: dbData[key].highScore,
        photoURL: dbData[key].photoURL
      })
    }
    console.log('fbR_procFlappyUserHighScoreAll: status = ' + readStatus);
  }
  //Passing the call back function the data read, if is the check leaderboard func.
  if (_callBack == manager_checkLeaderBoard) {
    _callBack(_save);
  }
}

/**************************************************************/
// fbR_procWriteError(error, _callBack)
// Process errors for the fb_writeRec function
// Input:  error, optional _callBack
/**************************************************************/
function fbR_procWriteError(error, _callBack) {
  console.log("fbR_procWriteError();");
  if (error) {
    console.log(error);
    fbV_writeStatus = "Failed";
  }
  else {
    fbV_writeStatus = "OK";
  }
  //calling call bcak if given one
  if (_callBack != null) { _callBack(); }
}

/**************************************************************/
// fbR_procRegistration()
// Process registration details
// Input:  the data and loucation to save to, optional _callBack function.
/**************************************************************/
function fbR_procRegistration(snapshot, _save, readStatus, _callBack) {
  console.log("fbR_procRegistration();");
  if (snapshot.val() == null) {
    readStatus = "Not found";
  }
  else {
    readStatus = "OK";
    console.log(snapshot.val());
    let dbData = snapshot.val();

    _save.userName = dbData.userName
    _save.userAddress = dbData.userAddress
    _save.userCountry = dbData.userCountry
    _save.userPN = dbData.userPN
    _save.userAge = dbData.userAge
    _save.userGender = dbData.userGender
  }
  console.log('fbR_procRegistration: status = ' + readStatus);

  //Calling call back function if given one
  if (_callBack != null) {
    _callBack();
  }
}

/**************************************************************/
//    END OF MODULE
/**************************************************************/