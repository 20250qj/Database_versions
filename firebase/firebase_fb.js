/**************************************************************/
// firebase_fb.js
/**************************************************************/
MODULENAME = "firebase_fb.js";
console.log('%c' + MODULENAME + ': ', 'color: blue;');

/**************************************************************/
// fb_login()
// Called by login button;
// Login to Firebase
// Input:  object for login data to save to, procfunc and optional 
// callBack function
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

  //Resetting user statuses
  fbV_loginStatus = 'logged out';
  fbV_registrationStatus = 'not registered';
  fbV_adminStatus = false;
  sessionStorage.clear();
  window.location.reload();
}

/**************************************************************/
// fb_writeRec()
// Write a specific record & key to the DB
// Input:  path to write to, the key and the data to write
//         procErr to process the errors, and optional callBack
/**************************************************************/
function fb_writeRec(_path, _key, _data, _procErr, _callBack) {
  fbV_writeStatus = "waiting...";

  console.log('%cfb_WriteRec: path= ' + _path + '  key= ' + _key,
    'color: brown;');

  firebase.database().ref(_path + '/' + _key).set(_data,
    gotError);

  //Recieves the error from write rec, then call procErr to process it
  function gotError(error) {
    _procErr(error, _callBack);
  }
}

/**************************************************************/
// fb_readAll()
// Read all DB records for the path
// Input:  path to read from and where to save the data, 
//         proc func to process data
//         optional _callBack and path
/**************************************************************/
function fb_readAll(_path, _data, _procFunc, _callBack) {
  console.log('%cfb_readAll: path= ' + _path, 'color: brown;');
  fbV_readStatus = "waiting...";

  firebase.database().ref(_path).once("value", gotRecord, fb_readErr);

  function gotRecord(snapshot) {
    _procFunc(snapshot, _data, fbV_readStatus, _callBack, _path);
  }

  function fb_readErr(error) {
    fbV_readStatus = "Failed";
    console.log(error);
  }
}

/**************************************************************/
// fb_readRec()
// Read a specific DB record
// Input:  path & key of record to read and where to save the data
//         proc func to process data and 
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