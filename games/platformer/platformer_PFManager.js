/*******************************************************/
// Unamed platformer game
// Written by: Martin jin
// Started on: 28/3/23
// V.1.0

// Description: module used to manage the game and the html elements
/*******************************************************/
MODULENAME = "platformer_PFManager.js";
console.log('%c' + MODULENAME + ': ', 'color: blue;');

/*******************************************************/
// Constants and variables
/*******************************************************/
const PFManager_STARTSCREENELEMENTS = ["start_button", "header"]
const PFManager_RESTARTELEMENTS = ["deathScreen", "restartButton"];

//Click audio when user clicks on buttons
var click = new Audio('/game_assets/game_sounds/click.mp3');
click.volume = 0.2;

//
/**************************************************************************************************************/
// V HTML MANAGER SECTION OF THE CODE V
/**************************************************************************************************************/
//

/*************************************************************/
//PFManager_checkDeath()
//Checks whether player is dead and to bring up a death screen
//or not.
//called by: multiple functions in the enemies module
/*************************************************************/
function PFManager_checkDeath() {
  if (PFSetUp_player.health === 0) {
    console.log("Player died");
    
    clearInterval(PFSetUp_enemyInterval);

    //Stopping draw and removing all the sprites
    PFSetUp_gameStarted = false;
    gameSprites.remove();

    //Stopping the music
    backGroundMusic.pause();

    //Displaying restart screen
    PFManager_display(PFManager_RESTARTELEMENTS);
  };
}

/*************************************************************/
//PFManager_clear()
//Clears elements
//called by: mutiple functions
//input: An array of elements that need to be cleared
/*************************************************************/
function PFManager_clear(elements) {
  console.log("PFManager_clear();")
  for (i = 0; i < elements.length; i++) {
    var x = document.getElementById(elements[i]);
    x.style.display = "none";
  }
}

/*************************************************************/
//PFManager_display()
//function for displaying HTML elements
//called by: mutiple functions
//input: An array of elements that need to be displayed
/*************************************************************/
function PFManager_display(elements) {
  console.log("PFManager_display();")
  for (i = 0; i < elements.length; i++) {
    let x = document.getElementById(elements[i]);
    x.style.display = "block";
  }
}

/*************************************************************/
//PFManager_restart()
//Restarts the game
//called by: restart button on restart screen
/*************************************************************/
function PFManager_restart() {
  console.log("PFManager_restart();");

  //Restarting the game
  PFManager_clear(PFManager_RESTARTELEMENTS);

  //Restarting the game
  PFSetUp_player.health = PFSetUp_PLAYERHEALTH;
  PFSetUp_gameStarted = true;
  setup();
}


/*************************************************************/
//PFManager_click()
//Adds sound when user clicks on a button
//called by: onload
/*************************************************************/
function PFManager_click() {
  //Restarting the audio and playing it
  click.pause();
  click.currentTime = 0
  click.play();
}


//
/**************************************************************************************************************/
// END OF MANAGER SECTION OF THE CODE
/**************************************************************************************************************/
//