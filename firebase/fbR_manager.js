/**************************************************************/
// fbR_manager.js
/**************************************************************/
MODULENAME = "fbR_manager.js";
console.log('%c' + MODULENAME + ': ', 'color: blue;');

/**************************************************************/
// fbR_procUserLogin(user, _save, loginStatus)
// Process user login data
// Input:  the user's data and loucation to save data to
// Return:  
/**************************************************************/
function fbR_procUserLogin(user, _save, loginStatus) {
  //Saving the login data
  loginStatus = 'logged in';
  _save.uid = user.uid;
  _save.email = user.email;
  _save.name = user.displayName;
  _save.photoURL = user.photoURL;

  //Creating the user highscore data for the first login, or saving them
  //if the user has already logged in.
  fbV_flappyHighScore.uid = _save.uid;
  fbV_flappyHighScore.name = _save.name;
  fbV_flappyHighScore.photoURL = _save.photoURL;

  //Checking if the user has an existing highscore.
  console.log("Calling readRec.")
  fb_readRec(fbV_FLAPPYSCOREPATH, fbV_flappyHighScore.uid, fbV_flappyHighScore, fbR_procUserHighScore);

  console.log('fbR_login: status = ' + loginStatus);
}

/**************************************************************/
// fbR_initialise()
// Called by setup()
// Initialize firebase
// Input:  n/a
// Return: n/a
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
// Return:  
/**************************************************************/
function fbR_procUserDetails(snapshot, _save, readStatus) {
  console.log("fbR_procUserRoles();");
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
    _save.score = dbData.score;
  }
}

/**************************************************************/
// fbR_procUserRoles(snapshot, _save, readStatus)
// Processes userRoles path
// Input: the data and loucation to save to
// Return:  
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
}

/**************************************************************/
// fbR_procUserDetailsAll(snapshot, _save, readStatus)
// Process for readAll for the userDetails path
// Input:  the data and loucation to save to
// Return:  
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
}

/**************************************************************/
// fbR_procUserRolesAll(snapshot, _save, readStatus)
// Process read all data in user roles path
// Input:  the data and loucation to save to
// Return:  
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
    console.log(dbData);
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
}

/**************************************************************/
// fbR_procUserHighScore(snapshot, _save, readStatus)
// Processes userHighScores path
// Input: the data and loucation to save to
// Return:  
/**************************************************************/
function fbR_procUserHighScore(snapshot, _save, readStatus) {
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
  //checking if the user has a high score entry, if not then create one for the user.
  if (_save.highScore === null || _save.highScore === '' || _save.score === null || _save.score === '') {
    _save.highScore = 0;
    _save.score = 0;
    console.log("No existing highScore and score data.")
    fb_writeRec(fbV_FLAPPYSCOREPATH, _save.uid, fbV_flappyHighScore);
  }
}

/**************************************************************/
// fbR_procFlappyUserHighScoreAll(snapshot, _save, readStatus)
// Process read all data in user high scores path
// Input:  the data and loucation to save to
// Return:  
/**************************************************************/
function fbR_procFlappyUserHighScoreAll(snapshot, _save, readStatus) {
  console.log("fbR_procFlappyUserHighScoreAll();")
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
        highScore: dbData[key].highScore,
        photoURL: dbData[key].photoURL
      })
    }
  }
  manager_checkLeaderBoard(_save);
}

/**************************************************************/
//    END OF MODULE
/**************************************************************/