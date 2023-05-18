/**************************************************************/
// firebase_fbV.js
/**************************************************************/
MODULENAME = "firebase_fbV.js";
console.log('%c' + MODULENAME + ': ', 'color: blue;');

/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
// database variables
const fbV_ROLESPATH = "userRoles";      //<=============== Firebase paths
const fbV_FLAPPYSCOREPATH = "userScores/flappyBird";      //<=============== Firebase paths   
const fbV_PFSCOREPATH = "userScores/platformer";      //<=============== Firebase paths
const fbV_REGISTRATIONPATH = "userDetails/registrationDetails";      //<=============== Firebase paths
const fbV_LOGINDETAILSPATH = "userDetails/loginDetails";      //<=============== Firebase paths

var fbV_loginStatus = 'logged out';
var fbV_registerStatus = "not registered";
var fbV_adminStatus = "false";
var fbV_readStatus = '';
var fbV_writeStatus = '';

var fbV_userDetails = {  //<=============== Object to store the details of the current user
  uid: '',
  email: '',
  name: '',
  photoURL: ''
};

var fbV_flappyHighScore = {  //<=============== Object to store the scores of the current user
  highScore: '',
  score: '',
  uid: '',
  userName: '',
  photoURL: ''
}

var fbV_PFHighScore = {  //<=============== Object to store the scores of the current user
  highScore: '',
  score: '',
  uid: '',
  userName: '',
  photoURL: ''
}

let fbV_registerDetails = {  //<=============== Object to store the scores of the current user
  userName: '',
  userAge: '',
  userPN: '',
  userAddress: '',
  userCountry: '',
  userGender: '',
}

const fbV_USERHIGHSCORES = [fbV_PFHighScore, fbV_flappyHighScore];

var fbV_flappyHighScoreArray = [];   //<=============== Object to store the leaderBoard

const fbV_apiKey = "AIzaSyBcsj4cU4YG7H4v7p_-OzsbYrfZFaIbOqY";
const fbV_authDomain = "comp-2022---martin.firebaseapp.com";
const fbV_databaseURL = "https://comp-2022---martin-default-rtdb.firebaseio.com";
const fbV_projectId = "comp-2022---martin";
const fbV_storageBucket = "comp-2022---martin.appspot.com";
const fbV_messagingSenderId = "656504325496";
const fbV_appId = "1:656504325496:web:0ce16cc7dee211a4ec348d";
const fbV_measurementId = "G-PS1J41H32Q";
/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/