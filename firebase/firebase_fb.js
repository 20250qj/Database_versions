/**************************************************************/
// firebase_fb.js
/**************************************************************/
MODULENAME = "firebase_fb.js";
console.log('%c' + MODULENAME + ': ', 'color: blue;');

/**************************************************************/
// fb_login(_save, _procFunc, _callBack)
// Called by login button;
// Login to Firebase
// Input:  object for login data to save to, _callBack function,
/**************************************************************/
function fb_login(_save, _procFunc, _callBack, _procError) {
  console.log('%cfb_login: ', 'color: brown;');

  //Disabling login button
  document.getElementById("loginButton").disabled = true;

  firebase.auth().onAuthStateChanged((user) => {
    if (user && fbV_loginStatus !== 'logged in via popup') {
      fbV_loginStatus = 'logged in';
      console.log(fbV_loginStatus);
      _procFunc(user, _save, fbV_loginStatus, _callBack);
    }

    else {
      // user NOT logged in, so redirect to Google login
      fbV_loginStatus = 'logged in via popup';
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
        console.log(fbV_loginStatus);
        _procFunc(result.user, _save, fbV_loginStatus, _callBack);
      })
        // Catch errors
        .catch(function(error) {
          if (error) {
            loginStatus = 'failed';
            console.log('%cfb_login: ' + error.code + ', ' +
              error.message, 'color: red;');
          }
        });
    }
  });
}

/**************************************************************/
// fb_logout()
// Called by log out button
// Logout of Firebase
/**************************************************************/
function fb_logout() {
  console.log('%cfb_logout: ', 'color: brown;');
  firebase.auth().signOut();

  //Setting login and registration status to logged out in session storage
  fbV_loginStatus = 'logged out';
  fbV_registrationStatus = 'not registered';

  sessionStorage.setItem("loginStatus", fbV_loginStatus);
  sessionStorage.setItem("registerStatus", fbV_registrationStatus);
  window.location.reload();
}

/**************************************************************/
// fb_writeRec(_path, _key, _data, _procFunc, _callBack)
// Write a specific record & key to the DB
// Input:  path to write to, the key and the data to write
//         procFunc to process the errors, and optional callBack
/**************************************************************/
function fb_writeRec(_path, _key, _data, _procFunc, _callBack) {
  fbV_writeStatus = "waiting...";

  console.log('%cfb_WriteRec: path= ' + _path + '  key= ' + _key,
    'color: brown;');

  firebase.database().ref(_path + '/' + _key).set(_data,
    gotError);

  //Recieves the error from write rec, then call procFunc to process it
  function gotError(error) {
    _procFunc(error, _callBack);
  }
}

/**************************************************************/
// fb_readAll(_path, _data, _procFunc, _callBack)
// Read all DB records for the path
// Input:  path to read from and where to save the data, optional _callBack
/**************************************************************/
function fb_readAll(_path, _data, _procFunc, _callBack) {
  console.log('%cfb_readAll: path= ' + _path, 'color: brown;');
  fbV_readStatus = "waiting...";

  firebase.database().ref(_path).once("value", gotRecord, readErr);

  function gotRecord(snapshot) {
    _procFunc(snapshot, _data, fbV_readStatus, _callBack);
  }

  function readErr(error) {
    fbV_readStatus = "Failed";
    console.log(error);
  }
}

/**************************************************************/
// fb_readRec(_path, _key, _data, _procFunc, _callBack)
// Read a specific DB record
// Input:  path & key of record to read and where to save the data
//         optional call back function
/**************************************************************/
function fb_readRec(_path, _key, _save, _procFunc, _callBack) {
  fbV_readStatus = "waiting...";
  console.log('%cfb_readRec: path= ' + _path +
    '  key= ' + _key, 'color: brown;');
  firebase.database().ref(_path + '/' + _key).once("value", gotRecord, fb_readErr);

  function gotRecord(snapshot) {
    _procFunc(snapshot, _save, fbV_readStatus, _callBack);
  }

  function fb_readErr(error) {
    fbV_readStatus = "Failed";
    console.log(error);
  }
}

/**************************************************************/
//    END OF MODULE
/**************************************************************/