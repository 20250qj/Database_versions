/**************************************************************/
// html_manager.js
/**************************************************************/
MODULENAME = "html_manager.js";
console.log('%c' + MODULENAME + ': ', 'color: blue;');

//array to store the contents of the leader board
var leaderBoardContents = [];

//Array of ids that needs to be hidden after logging in
const PRELOGINELEMENTS = ['loginButton'];

//Array of ids that needs to be shown after logging in.
const AFTERLOGINELEMENTS = ['playButton', 'logOutButton'];

//array to store the names of all the objects that would be saved
const manager_SAVEOBJECTS = [fbV_userDetails, fbV_flappyHighScore, fbV_registerDetails, fbV_PFHighScore];

/*************************************************************/
//manager_leaderBoard(_data, _path)
//sorts the user high scores, then display leaderboard
//called as a call back by proc userHighScoresAll
//input: scores data read from firebase, and the path that was
//read (flappy bird or platformer) to display the html accordingly
/*************************************************************/
function manager_leaderBoard(_data, _path) {
  console.log("manager_leaderBoard();");
  //Creating variable to store one row of data.
  let row = '';
  //Clearing the leaderboard contents from previous leaderboard
  leaderBoardContents = [];

  //Sorts high score from high to low
  _data.sort((a, b) => (a.highScore < b.highScore) ? 1 : -1);

  for (i = 0; i < _data.length; i++) {
    //Creating a string that will display the score
    row = _data[i].userName + ": " + _data[i].highScore;
    console.log(_data[i].userName + ": " + _data[i].highScore);

    leaderBoardContents.push({ display: row, photoURL: _data[i].photoURL, highScore: _data[i].highScore });
  }
  manager_displayLeaderBoard(leaderBoardContents, _path);
}


/*************************************************************/
//manager_displayLeaderBoard(_data, _path)
//Displays the leader board
//called when page loads
//input: what to put on the leaderboard, and the path that was read
//to determine what to display on the html
/*************************************************************/
function manager_displayLeaderBoard(_data, _path) {
  console.log("manager_displayLeaderBoard();");

  //Setting the title now that leader board is loaded
  if (_path === fbV_FLAPPYSCOREPATH) {
    document.getElementById("leaderBoard_title").innerHTML = "Flappy bird high scores:";
    //Removing the underline style from the platformer button and setting it to the flappy button
    document.getElementById("pf_btn").classList.remove("button_active");
    document.getElementById("flappy_btn").classList.add("button_active");
  } else {
    document.getElementById("leaderBoard_title").innerHTML = "Platformer high scores:";
    //Removing the underline style from the flappy button and setting it to the platformer button
    document.getElementById("flappy_btn").classList.remove("button_active");
    document.getElementById("pf_btn").classList.add("button_active");
  };

  let leaderBoard = document.getElementById("leaderBoard");

  for (i = 0; i < _data.length; i++) {
    let display = _data[i].display

    //Appending data to the leaderboard
    let div1 = document.createElement("div");
    leaderBoard.appendChild(div1);

    //Giving each row an id, such that it gose row1, row2, row3...
    //Also adding in styling for the row
    div1.setAttribute('id', 'row' + Number(i + 1))
    document.getElementById('row' + Number(i + 1)).classList.add('leaderBoard_row');

    let node = document.createTextNode("#" + Number(i + 1) + " ");
    div1.appendChild(node);

    //Adding user photo on leader board
    let img = document.createElement("img");
    img.src = _data[i].photoURL;

    let div2 = document.getElementById('row' + Number(i + 1));
    div2.appendChild(img);

    //Giving each img an id, such that it gose img1, img2, img3...
    //Also adding in styling for the img
    img.setAttribute('id', 'img' + Number(i + 1));
    document.getElementById('img' + Number(i + 1)).classList.add('leaderBoard_img');

    //Appending names and score to the leaderboard
    let node2 = document.createTextNode(" " + display);
    div1.appendChild(node2);
  }
}

/*************************************************************/
//manager_clearLeaderBoard()
//Clears the leaderboard
//called when user clicks on flappy bird or platformer button
//for the leaderboard
/*************************************************************/
function manager_clearLeaderBoard() {
  console.log("manager_clearLeaderBoard();");
  let leaderBoard = document.getElementById("leaderBoard");
  while (leaderBoard.firstChild) {
    leaderBoard.removeChild(leaderBoard.firstChild);
  }
  //Set title to loading as data is currently being read from the database
  document.getElementById("leaderBoard_title").innerHTML = "Loading leaderboard...";
}

/*************************************************************/
//manager_login()
//Creates elements after login.
//Called when login finishes - callback function
/*************************************************************/
function manager_login() {
  console.log("manager_login();")
  alert("You have logged in!");

  fbV_loginStatus = "logged in";

  //Check registraiton if user has logged in, and saving the read values if they have
  fb_readRec(fbV_REGISTRATIONPATH, fbV_userDetails.uid, fbV_registerDetails, fbR_procRegistration,
    _ => {
      //EVERYTHING IN HERE IS THE CALLBACK FUNCTION FOR WHEN THE READ IS DONE
      //Checking if there is registration data
      if (fbV_registerDetails.userName === "" || fbV_registerDetails.userName === null) {
        fbV_registerStatus = "not registered";
      } else {
        fbV_registerStatus = "registered";
      }

      //Making sure that there is no timing issues and saving it again when it is done
      manager_saveValues();
      manager_checkReg();

      //Since user is logged in display nav bar.
      manager_displayNav();

      //Checking if user is an admin.
      manager_checkAdmin();
    });

  //Clearing buttons and saving values
  manager_clearButtons();
  manager_saveValues();
}

/*************************************************************/
//manager_clearButtons()
//clears login button and displays play and log out button on the landing page
/*************************************************************/
function manager_clearButtons() {
  console.log("manager_clearButtons();");

  //Hiding prelogin elements 
  for (i = 0; i < PRELOGINELEMENTS.length; i++) {
    let x = document.getElementById(PRELOGINELEMENTS[i]);
    x.style.display = "none";
  }

  //Loading afterlogin elements
  for (i = 0; i < AFTERLOGINELEMENTS.length; i++) {
    let x = document.getElementById(AFTERLOGINELEMENTS[i]);
    x.style.display = "block";
  }
}

/*************************************************************/
//manager_checkLogin()
//Clears required elements when user is logged in.
//Called: onload in the login page
/*************************************************************/
function manager_checkLogin() {
  console.log("manager_checkLogin();");

  //Get login status from session storage if is not null
  if (sessionStorage.getItem("loginStatus") !== null) { fbV_loginStatus = sessionStorage.getItem("loginStatus") };
  console.log("User is " + fbV_loginStatus);

  if (fbV_loginStatus === 'logged in') {
    //Display nav bar elements if user is logged in:
    manager_displayNav();
    //If at home page and logged in, remove login button
    if (window.location ==
      "https://12comp-programming-and-db-assessment-martinjin2.12comp-gl-2023.repl.co/index.html"
      || window.location == "https://12comp-programming-and-db-assessment-martinjin2.12comp-gl-2023.repl.co/"
    ) {
      manager_clearButtons();
    }
  }
}

/*************************************************************/
//manager_displayNav()
//Displays nav bar.
//Called by: manager_checkLogin(), and manager_login().
/*************************************************************/
function manager_displayNav() {
  console.log("manager_displayNav();");

  let navBar = document.getElementById("myTopnav");
  navBar.style.display = 'block';
}

/*************************************************************/
//manager_saveValues()
//Saves values to session storage after login
//Called by manager_login()
/*************************************************************/
function manager_saveValues() {
  console.log("manager_saveValues();");

  //Saving the user statuses.
  sessionStorage.setItem("loginStatus", fbV_loginStatus);
  sessionStorage.setItem("adminStatus", fbV_adminStatus);
  sessionStorage.setItem("registerStatus", fbV_registerStatus);

  //Score is saved seperately and not automated because the key
  //name of the score and highscore is the same, and so one games
  //score will overwrite the other depending on which one is saved last.
  sessionStorage.setItem("flappyScore", fbV_flappyHighScore.score);
  sessionStorage.setItem("PFScore", fbV_PFHighScore.score);
  sessionStorage.setItem("flappyHighScore", fbV_flappyHighScore.highScore);
  sessionStorage.setItem("PFHighScore", fbV_PFHighScore.highScore);

  for (i = 0; i < manager_SAVEOBJECTS.length; i++) {
    let object = manager_SAVEOBJECTS[i];

    //Creating arrays of key value pairs to save to session storage
    let objecKeys = Object.keys(object);
    let objectValues = Object.values(object);

    //Saving values to session storage
    for (x = 0; x < objecKeys.length; x++) {
      if (objectValues[x] != '' && objectValues[x] != undefined && objectValues[x] != null
        && objecKeys[x] != 'highScore' && objecKeys[x] != 'score') {
        sessionStorage.setItem(objecKeys[x], objectValues[x]);
        // console.log('%c'
        //   + "key: "
        //   + objecKeys[x]
        //   + " \nvalue saved: "
        //   + sessionStorage.getItem(objecKeys[x]), 'color: blue;');
      }
    }
  }
}

/*************************************************************/
//manager_getValues()
//get values from session storage
/*************************************************************/
function manager_getValues() {
  console.log("manager_getValues();");

  //Getting the user statuses.
  fbV_loginStatus = sessionStorage.getItem("loginStatus");
  fbV_adminStatus = sessionStorage.getItem("adminStatus");
  fbV_registerStatus = sessionStorage.getItem("registerStatus");

  //Score is gotten seperately and not automated because the key
  //name of the score and highscore is the same, and so one games
  //score will overwrite the other depending on which one is saved last.
  fbV_flappyHighScore.score = sessionStorage.getItem("flappyScore");
  fbV_PFHighScore.score = sessionStorage.getItem("PFScore");
  fbV_flappyHighScore.highScore = sessionStorage.getItem("flappyHighScore");
  fbV_PFHighScore.highScore = sessionStorage.getItem("PFHighScore");

  //Getting the keys of the objects to iterate through and get the values from session storage
  for (i = 0; i < manager_SAVEOBJECTS.length; i++) {
    let object = manager_SAVEOBJECTS[i];

    //Creating arrays of keys to get from session storage
    let objecKeys = Object.keys(object);

    //Getting values from session storage
    for (x = 0; x < objecKeys.length; x++) {
      if (sessionStorage.getItem(objecKeys[x]) != ''
        && sessionStorage.getItem(objecKeys[x]) != undefined
        && sessionStorage.getItem(objecKeys[x]) != null) {
        object[objecKeys[x]] = sessionStorage.getItem(objecKeys[x]);
        // console.log('%c'
        //   + "key: "
        //   + objecKeys[x]
        //   + " \nvalue gotten: "
        //   + sessionStorage.getItem(objecKeys[x]), 'color: blue;');
      }
    }
    //Converting numeric values back to a number if it exists
    if (object.highScore == undefined) { continue; };

    object.highScore = Number(object.highScore);
    object.score = Number(object.score);
  }
}

/*************************************************************/
//manager_checkReg()
//Sends user to registration page if they are not registered.
//Called by: manager_login(), and onload on mutiple pages.
/*************************************************************/
function manager_checkReg() {
  console.log("manager_checkReg();");
  console.log("User is " + fbV_registerStatus);

  //Getting registration status
  fbV_registerStatus = sessionStorage.getItem("registerStatus");

  //Checking if user is registered
  if (fbV_registerStatus === "not registered") {

    //Going to register page if user is not registered
    alert("Please register to play my games.");
    window.location = "https://12comp-programming-and-db-assessment-martinjin2.12comp-gl-2023.repl.co/html/html_register.html";
  }

  //Saving registerStatus to session storage
  sessionStorage.setItem("registerStatus", fbV_registerStatus);
}

/*************************************************************/
//manager_checkAdmin()
//checks if user is an admin or not
//called when logging in by manager_login
/*************************************************************/
function manager_checkAdmin() {
  console.log("manager_checkAdmin();");
  fb_readRec(fbV_ROLESPATH, '', '',
    _ => {
      //if the read succeeds and procfunc is called then the user must have admin previleges
      //other wise the user must not be an admin.
      fbV_adminStatus = "true";
      manager_saveValues();
      manger_adminPanel();
    });
}

/*************************************************************/
//manager_adminPanel()
//displays the admin panel if the user is an admin
//called on load on each page.
/*************************************************************/
function manger_adminPanel() {
  console.log("manger_adminPanel();");

  //Get admin status from session storage if is not null
  if (sessionStorage.getItem("adminStatus") !== null) { fbV_adminStatus = sessionStorage.getItem("adminStatus") };
  console.log("User is an admin: " + fbV_adminStatus);

  //If admin status is true then show admin button
  if (fbV_adminStatus === "true") {
    document.getElementById("adminPanel").style.display = 'block';
  } else { document.getElementById("adminPanel").style.display = 'none' }
}
/*******************************************************/
//  END OF APP
/*******************************************************/