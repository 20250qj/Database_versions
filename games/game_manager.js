/**************************************************************/
// game_manager.js
/**************************************************************/
MODULENAME = "game_manager.js";
console.log('%c' + MODULENAME + ': ', 'color: blue;');

var leaderBoardContents = []

/*************************************************************/
//manager_checkLeaderBoard(_data)
//Checks the user high scores, gets data from firebase
//called when page loads
//input: n/a
//return: n/a
/*************************************************************/
function manager_checkLeaderBoard(_data) {
  console.log("manager_checkLeaderBoard();");
  let row = '';

  //Sorts high score from high to low
  _data.sort((a, b) => (a.highScore < b.highScore) ? 1 : -1);
  
  for (i = 0; i < _data.length; i++) {
    //Creating a string that will display the score
    row = _data[i].name + ": " + _data[i].highScore;
    console.log(_data[i].name + ": " + _data[i].highScore);

    leaderBoardContents.push({display: row, photoURL: _data[i].photoURL, highScore: _data[i].highScore});
  }
  manager_displayLeaderBoard(leaderBoardContents);
}


/*************************************************************/
//manager_displayLeaderBoard(_data)
//Displays the leader board
//called when page loads
//input: n/a
//return: n/a
/*************************************************************/
function manager_displayLeaderBoard(_data) {
  console.log("manager_displayLeaderBoard();");

  //Setting the title now that leader board is loaded
  document.getElementById("leaderBoard_title").innerHTML = "Flappy bird high scores:";
  
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
//manager_login()
//Creates elements after login.
//Called when login finishes
//input: n/a
//return: n/a
/*************************************************************/
function manager_login() {
  console.log("manager_login();")
  alert("You are logged in.");

  manager_clearButtons();
  manager_saveValues();
}

/*************************************************************/
//manager_clearButtons()
//clears login button and displays play and log out button on the landing page
/*************************************************************/
function manager_clearButtons() {
  console.log("manager_clearButtons();");
  //Array of ids that needs to be hidden after logging in
  const PRELOGINELEMENTS = ['loginButton'];

  //Array of ids that needs to be shown after logging in.
  const AFTERLOGINELEMENTS = ['playButton', 'logOutButton'];

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
//checks if user has logged in, disable links if not
//Called when user clicks on play button
//input: array of ids to be disabled
//return: n/a
/*************************************************************/
function manager_checkLogin(ids) {
  console.log("manager_checkLogin();");
  
  //Get login status from session storage if is not null
  if (sessionStorage.getItem("loginStatus") !== null) { fbV_loginStatus = sessionStorage.getItem("loginStatus")};
  console.log(fbV_loginStatus);
  
  //If not logged in then disable buttons
  if (fbV_loginStatus !== 'logged in' && ids !== null) {
    for (i = 0; i < ids.length; i++) {
      let x = document.getElementById(ids[i]);
      x.setAttribute("href", "");
      x.addEventListener("click", manager_disableLogin);
    }
  }
  
  //If at home page and logged in, remove login button
  if (fbV_loginStatus === 'logged in' && window.location.href === 
      "https://12comp-programming-and-db-assessment-martinjin2.12comp-gl-2023.repl.co/index.html"
     ) {
    manager_clearButtons();
  }
}

/*************************************************************/
//manager_disableLogin()
//dummy function that alerts user when clicking on a disabled button
//Called by manager_checkLogin()
/*************************************************************/
function manager_disableLogin() {
  console.log("manager_disableLogin();");
  alert("You must be logged in to acess this feature.");
}

/*************************************************************/
//manager_saveValues()
//Saves values to session storage after login
//Called by manager_login()
/*************************************************************/
function manager_saveValues() {
  console.log("manager_saveValues();");

  //Setting the login status
  sessionStorage.setItem("loginStatus", fbV_loginStatus);
  
  //Creating an array of key value pairs to save to session storage
  let userDetailsKeys = Object.keys(fbV_userDetails);
  let userDetailsValues = Object.values(fbV_userDetails);

  let userFlappyHighScoreKeys = Object.keys(fbV_flappyHighScore);
  let userFlappyHighScoreValues = Object.values(fbV_flappyHighScore);
  
  //Saving user details data to session storage
  for (i = 0; i < userDetailsKeys.length; i++) {
    sessionStorage.setItem(userDetailsKeys[i], userDetailsValues[i]);
  }

  //Saving score data to session storage
  for (i = 0; i < userFlappyHighScoreKeys.length; i++) {
    sessionStorage.setItem(userFlappyHighScoreKeys[i], userFlappyHighScoreValues[i]);
  }
}

/*************************************************************/
//manager_getValues()
//get values from session storage
/*************************************************************/
function manager_getValues() {
  console.log("manager_getValues();");

  //Getting the keys of the objects to iterate through and get the values from session storage
  let userDetailsKeys = Object.keys(fbV_userDetails);
  let userFlappyHighScoreKeys = Object.keys(fbV_flappyHighScore)

  for (i = 0; i < userDetailsKeys.length; i++) {
    fbV_userDetails[userDetailsKeys[i]] = sessionStorage.getItem(userDetailsKeys[i]);
  }

  for (i = 0; i < userFlappyHighScoreKeys.length; i++) {
    fbV_flappyHighScore[userFlappyHighScoreKeys[i]] = sessionStorage.getItem(userFlappyHighScoreKeys[i]);
  }

  //Converting to a number
  fbV_flappyHighScore.highScore = Number(fbV_flappyHighScore.highScore);
  //Converting to a number before writing
  fbV_flappyHighScore.score = Number(fbV_flappyHighScore.score);
}

/*******************************************************/
//  END OF APP
/*******************************************************/