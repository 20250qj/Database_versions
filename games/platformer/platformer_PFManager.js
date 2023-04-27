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
const PFManager_STARTSCREENELEMENTS = ["startButton", "header"]
const PFManager_RESTARTELEMENTS = ["deathScreen", "restartButton"];
const PFManager_BUTTONARRAY = ["startButton", "restartButton", "exitButton", "backButton"];

//Click audio when user clicks or hovers on buttons
var click = new Audio('/game_assets/game_sounds/click.mp3');
click.volume = 0.2;

//Health bar vars
var PFManager_healthBar;
const PFManager_HEALTHBARWIDTH = 90;
const PFManager_HEALTHBARHEIGHT = 15;
const PFManager_HEALTHBAROFFSET = 45;
const PFManager_HEALTHBARCOLOR = "#1cfe6a";

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
  if (PFSetUp_player.health <= 0) {
    console.log("Player died");
    PFSetUp_playerDied = true;

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
  platformGroup.remove();

  //Restarting the game and resetting varibales
  PFSetUp_player.health = PFSetUp_PLAYERHEALTH;
  PFSetUp_gameStarted = true;
  PFSetUp_playerDied = false;
  PFEnemies_weakEnemyAlive = 0;
  PFEnemies_weakEnemies = [];
  PFEnemies_rangedEnemies = [];
  PFWorld_gravityEffectedSprites = [];
  setup();
}


/*************************************************************/
//PFManager_addClickSound()
//Adds sound when user clicks on a button
//called by: onload
/*************************************************************/
function PFManager_addClickSound() {
  console.log("PFManager_addClickSound();");
  for (i = 0; i < PFManager_BUTTONARRAY.length; i++) {
    //Creating a clone of the audio for each button
    let clickClone = click.cloneNode(true);
    clickClone.volume = 0.2;
    let x = document.getElementById(PFManager_BUTTONARRAY[i]);
    x.addEventListener("click", (event) => {
      clickClone.currentTime = 0;
      clickClone.play();
    });
  }
}


/*************************************************************/
//PFManager_addHoverSound()
//Adds sound when user hovers on a button
//called by: onload
/*************************************************************/
function PFManager_addHoverSound() {
  console.log("PFManager_addHoverSound();");
  for (i = 0; i < PFManager_BUTTONARRAY.length; i++) {
    //Creating a clone of the audio for each button
    let clickClone = click.cloneNode(true);
    clickClone.volume = 0.2;
    let x = document.getElementById(PFManager_BUTTONARRAY[i]);
    x.addEventListener("mouseover", (event) => {
      clickClone.currentTime = 0;
      clickClone.play();
    });
  }
}

/*************************************************************/
//PFManager_setHealthBar()
//Draws the health bar for all the sprites
//called by: draw();
/*************************************************************/
function PFManager_setHealthBar() {
  for (i = 0; i < PFWorld_gravityEffectedSprites.length; i++) {
    let sprite = PFWorld_gravityEffectedSprites[i];
    //Creating a heatlh bar if the sprite dosen't have one
    if (sprite.healthBar === false) {
      let healthBar;
      healthBar = new Sprite(sprite.x, sprite.y - PFManager_HEALTHBAROFFSET,
        PFManager_HEALTHBARWIDTH, PFManager_HEALTHBARHEIGHT, "n");
      
      healthBar.color = PFManager_HEALTHBARCOLOR;
      sprite.bar = healthBar;

      //Adding to group
      gameSprites.add(healthBar);

      //Health bar created so set to true
      sprite.healthBar = true;
      
      //If the sprite already has a health bar then just move it to the sprite
    } else if (sprite.healthBar === true) {
      let barWidth = (sprite.health / sprite.maxHealth) * PFManager_HEALTHBARWIDTH;
      let healthBar = sprite.bar;
      healthBar.width = barWidth;

      let barX = sprite.x - PFManager_HEALTHBARWIDTH / 2 + barWidth / 2;
      //Moving the bar to above the sprite
      healthBar.pos = { x: barX, y: sprite.y - PFManager_HEALTHBAROFFSET };
    }
  }
}



//
/**************************************************************************************************************/
// END OF MANAGER SECTION OF THE CODE
/**************************************************************************************************************/
//