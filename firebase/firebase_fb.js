/**************************************************************/
// fb_io.js
/**************************************************************/
MODULENAME = "fb_io.js";
console.log('%c' + MODULENAME + ': ', 'color: blue;');

/**************************************************************/
// fb_login(_save, _procfunc, _callBack)
// Called by setup();
// Login to Firebase
// Input:  object for login data to save to, _callBack function
// Return: n/a
/**************************************************************/
function fb_login(_save, _procfunc, _callBack) {
  console.log('%cfb_login: ', 'color: brown;');

  firebase.auth().onAuthStateChanged(newLogin);

  /*-----------------------------------------*/
  // newLogin(user, _procfunc)
  /*-----------------------------------------*/
  function newLogin(user) {
    if (user) {
      fbV_loginStatus = 'logged in';
      _procfunc(user, _save, fbV_loginStatus, _callBack);
    }

    else {
      // user NOT logged in, so redirect to Google login
      fbV_loginStatus = 'logged out';
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
        fbV_loginStatus = 'logged in via popup';
        _procfunc(user, _save, fbV_loginStatus, _callBack);
      })
        .catch(function(error) {
          if (error) {
            if (user == null) {
              console.log('fb_login: user not currently logged in');
            }
            else {
              fbV_loginStatus = 'failed';
              console.log('%cfb_login: ' + error.code + ', ' +
                error.message, 'color: red;');
            }
          }
        });
    }
  }
}

/**************************************************************/
// fb_logout()
// Logout of Firebase
// Input:  n/a
// Return: n/a
/**************************************************************/
function fb_logout() {
  console.log('%cfb_logout: ', 'color: brown;');
  firebase.auth().signOut();
  
  //Setting login status to logged out in session storage
  fbV_loginStatus = 'logged out';
  sessionStorage.setItem("loginStatus", fbV_loginStatus);
  window.location.reload();
}

/**************************************************************/
// fb_writeRec(_path, _key, _data)
// Write a specific record & key to the DB
// Input:  path to write to, the key and the data to write
// Return: 
/**************************************************************/
function fb_writeRec(_path, _key, _data) {
  fbV_writeStatus = "waiting...";
  console.log('%cfb_WriteRec: path= ' + _path + '  key= ' + _key,
    'color: brown;');

  firebase.database().ref(_path + '/' + _key).set(_data,
    function(error) {
      if (error) {
        console.log(error);
        fbV_writeStatus = "Failed";
      } else {
        fbV_writeStatus = "OK";
        serverSideDetails = _data;
      }
    });
}

/**************************************************************/
// fb_readAll(_path, _data, _procfunc, _callBack)
// Read all DB records for the path
// Input:  path to read from and where to save the data, optional _callBack
// Return:
/**************************************************************/
function fb_readAll(_path, _data, _procfunc, _callBack) {
  console.log('%cfb_readAll: path= ' + _path, 'color: brown;');
  fbV_readStatus = "waiting...";

  firebase.database().ref(_path).once("value", gotRecord, readErr);

  function gotRecord(snapshot) {
    _procfunc(snapshot, _data, fbV_readStatus, _callBack);
  }

  function readErr(error) {
    fbV_readStatus = "Failed";
    console.log(error);
  }
}

/**************************************************************/
// fb_readRec(_path, _key, _data, _procfunc, _callBack)
// Read a specific DB record
// Input:  path & key of record to read and where to save the data
//         optional call back function
// Return:  
/**************************************************************/
function fb_readRec(_path, _key, _save, _procfunc, _callBack) {
  console.log('%cfb_readRec: path= ' + _path +
    '  key= ' + _key, 'color: brown;');
  fbV_readStatus = "waiting...";
  firebase.database().ref(_path + '/' + _key).once("value", gotRecord, fb_readErr);

  function gotRecord(snapshot) {
    _procfunc(snapshot, _save, fbV_readStatus, _callBack);
  }

  function fb_readErr(error) {
    fbV_readStatus = "Failed";
    console.log(error);
  }
}
/**************************************************************/
//    END OF MODULE
/**************************************************************/