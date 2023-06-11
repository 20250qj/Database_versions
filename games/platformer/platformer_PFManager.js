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
const PFManager_STARTSCREENELEMENTS = ["startButton", "header", "instructionsButton"]
const PFManager_RESTARTELEMENTS = ["deathScreen", "restartButton", "score"];
const PFManager_BUTTONARRAY = ["startButton", "restartButton", "exitButton", "backButton", "instructionsButton", "instructionBackBtn"];

//Click audio when user clicks or hovers on buttons
var click = new Audio('/game_assets/game_sounds/click.mp3');
click.volume = 0.2;

//Health bar vars
var PFManager_healthBar;
const PFManager_HEALTHBARWIDTH = 60;
const PFManager_HEALTHBARHEIGHT = 10;
const PFManager_HEALTHBARBACKWIDTH = PFManager_HEALTHBARWIDTH + 2;
const PFManager_HEALTHBARBACKHEIGHT = PFManager_HEALTHBARHEIGHT + 2;
const PFManager_HEALTHBAROFFSET = 40;
const PFManager_HEALTHBARCOLOR = "#1cfe6a";
const PFManager_LOWHEALTHCOLOR = "red";
const PFManager_MIDHEALTHCOLOR = "orange";
const PFManager_BARBACKCOLOR = "black";
const PFManager_HEALTHBARLAYER = 1;

//
/**************************************************************************************************************/
// V HTML MANAGER SECTION OF THE CODE V
/**************************************************************************************************************/
//

/*************************************************************/
//PFManager_playerDied()
//function that is called when player is dead
//called by: PFEnemies_setImmune();
/*************************************************************/
function PFManager_playerDied() {
  if (PFSetUp_player.health <= 0) {
    console.log("Player died");
    console.log("Total points: " + PFSetUp_playerScore);
    PFSetUp_playerDied = true;

    //Stopping draw and removing all the sprites
    gameSprites.remove();
    PFSetUp_gameStarted = false;
    background("#62daff");

    //Stopping the music
    backGroundMusic.pause();

    //Displaying restart screen
    PFManager_display(PFManager_RESTARTELEMENTS);

    //Display the users score before clearing it:
    document.getElementById("score").innerHTML = "Your score was: " + PFSetUp_playerScore;

    //Checking highscore
    PFManager_checkHighScore();
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
      let healthBarBack;
      //heatlhBar
      healthBar = new Sprite(sprite.x, sprite.y - PFManager_HEALTHBAROFFSET,
        PFManager_HEALTHBARWIDTH, PFManager_HEALTHBARHEIGHT, "n");

      //the background for the healthbar
      healthBarBack = new Sprite(sprite.x, sprite.y - PFManager_HEALTHBAROFFSET,
        PFManager_HEALTHBARBACKWIDTH, PFManager_HEALTHBARBACKHEIGHT, "n");

      healthBar.color = PFManager_HEALTHBARCOLOR;
      healthBarBack.color = PFManager_BARBACKCOLOR;

      //Setting the healthBar a layer ahead.
      healthBar.layer = PFManager_HEALTHBARLAYER;
      healthBarBack.layer = PFManager_HEALTHBARLAYER - 1;

      sprite.bar = healthBar;
      sprite.barBack = healthBarBack;

      //Adding to group
      gameSprites.add(healthBar);
      gameSprites.add(healthBarBack);

      //Health bar created so set to true
      sprite.healthBar = true;

      //If the sprite already has a health bar then just move it to the sprite
    } else if (sprite.healthBar === true) {
      let barWidth = (sprite.health / sprite.maxHealth) * PFManager_HEALTHBARWIDTH;
      let healthBarBack = sprite.barBack;
      let healthBar = sprite.bar;

      healthBar.width = barWidth;
      if (sprite.health / sprite.maxHealth <= 0.3) { healthBar.color = PFManager_LOWHEALTHCOLOR }
      else if ((sprite.health / sprite.maxHealth) <= 0.6) { healthBar.color = PFManager_MIDHEALTHCOLOR };

      let barX = sprite.x - PFManager_HEALTHBARWIDTH / 2 + barWidth / 2;

      //Moving the bar to above the sprite
      healthBar.pos = { x: barX, y: sprite.y - PFManager_HEALTHBAROFFSET };
      healthBarBack.pos = { x: sprite.x, y: sprite.y - PFManager_HEALTHBAROFFSET };
    }
  }
}

/*************************************************************/
//PFManager_checkHighScore()
//check if the user score is a highscore after the game ends
//if the score is a highScore then write to database
//called by: PFManager_playerDied();
/*************************************************************/
function PFManager_checkHighScore() {
  console.log("PFManager_checkHighScore();");
  //If current score bigger than the highscore then set it to new highScore.
  if (PFSetUp_playerScore > fbV_PFHighScore.highScore) {
    fbV_PFHighScore.highScore = PFSetUp_playerScore;
    fb_writeRec(fbV_PFSCOREPATH, fbV_PFHighScore.uid, fbV_PFHighScore, fbR_procWriteError, manager_saveValues);
  }
  
  //Clearing the users score
  PFSetUp_playerScore = 0;
  fbV_PFHighScore.score = PFSetUp_playerScore;
  fb_writeRec(fbV_PFSCOREPATH, fbV_PFHighScore.uid, fbV_PFHighScore, fbR_procWriteError, manager_saveValues);
}

/*************************************************************/
//PFManager_displayInstructions()
//displays the instructions and clears the starting screen elements
//called by: when user clicks on instructions button;
/*************************************************************/
function PFManager_displayInstructions() {
  console.log("PFManager_displayInstructions();");
  //Clearing HTML
  PFManager_clear(PFManager_STARTSCREENELEMENTS);
  //Displaying Instructions
  document.getElementById("instructions_container").style.display = "block";
}

//
/**************************************************************************************************************/
// END OF MANAGER SECTION OF THE CODE
/**************************************************************************************************************/
//