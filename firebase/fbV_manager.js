/**************************************************************/
// fbV_manager.js
/**************************************************************/
MODULENAME = "fbV_manager.js";
console.log('%c' + MODULENAME + ': ', 'color: blue;');

/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
// database variables
const fbV_DETAILS = "userDetails";      //<=============== Firebase paths
const fbV_ROLES = "userRoles";      //<=============== Firebase paths
const fbV_HIGHSCORE = "userHighScores";      //<=============== Firebase paths

var fbV_loginStatus = ' ';
var fbV_readStatus = ' ';
var fbV_writeStatus = ' ';

var fbV_userDetails = {  //<=============== Object to store the details of the current user
  uid: '',
  email: '',
  name: '',
  photoURL: '',
  score: ''
};

var fbV_userHighScore = {  //<=============== Object to store the name of the current user
  highScore: '',
  uid: '',
  name: '',
  photoURL: ''
}

var fbV_userRoles = {  //<=============== Object to store the role of the current user
  role: '',
  name: ''
}

var fbV_highScoreArray = [];   //<=============== Object to store the leaderBoard

const fbV_apiKey = "AIzaSyBcsj4cU4YG7H4v7p_-OzsbYrfZFaIbOqY";
const fbV_authDomain = "comp-2022---martin.firebaseapp.com";
const fbV_databaseURL = "https://comp-2022---martin-default-rtdb.firebaseio.com";
const fbV_projectId = "comp-2022---martin";
const fbV_storageBucket = "comp-2022---martin.appspot.com";
const fbV_messagingSenderId = "656504325496";
const fbV_appId = "1:656504325496:web:0ce16cc7dee211a4ec348d";
const fbV_measurementId = "G-PS1J41H32Q";
/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/