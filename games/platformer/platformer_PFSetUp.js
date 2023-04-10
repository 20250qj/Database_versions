/*******************************************************/
// Unamed platformer game
// Written by: Martin jin
// Started on: 28/3/23
// V.1.0

// Description: Set up module of the game
/*******************************************************/
MODULENAME = "platformer_PFSetUp.js";
console.log('%c' + MODULENAME + ': ', 'color: blue;');

/*******************************************************/
// Constants and variables
/*******************************************************/

//Wall variables
const PFSetUp_WALLBOUNCE = 0;
const PFSetUp_WALLTHICKNESS = 8;
const PFSetUp_PLATFORMFRICTION = 0;

//Sword variables
var PFSetUp_swordSwinging = false;
var PFSetUp_swordDir = "right";
const PFSetUp_SWORDSIZE = 70;
const PFSetUp_SWORDXOFFSET = 70;
const PFSetUp_SWORDXKNOCKBACK = 20;
const PFSetUp_SWORDYKNOCKBACK = -10;
const PFSetUp_SWORDSTUNDUR = 300;
const PFSetUp_SWORDROTATIONSPEED = 10;

//Player variables
const PFSetUp_SPAWNXDISPLACEMENT = 0.2;
const PFSetUp_SPAWNYDISPLACEMENT = 0.5;
const PFSetUp_PLAYERWIDTH = 50;
const PFSetUp_PLAYERHEIGHT = 50;
const PFSetUp_PLAYERXSPEED = 5;
const PFSetUp_PLAYERSWINGSPEED = 220;
const PFSetUp_PLAYERFRICTION = 0;
const PFSetUp_PLAYERHEALTH = 5;
const PFSetUp_PLAYERBOUNCE = 0;

var PFSetUp_playerOnFloorTime = 0;
var PFSetUp_playerDied = false;

//Player movement
const PFSetUp_JUMPKEY = "KeyW";
const PFSetUp_LEFTKEY = "KeyA";
const PFSetUp_RIGHTKEY = "KeyD";
var PFSetUp_rKeyDown = false;
var PFSetUp_lKeyDown = false;

const PFSetUp_JUMPSTRENGTH = -20;

//Game variables
var PFSetUp_gameStarted = false;

//array that stores the sprites thats on the floor
var PFSetUp_onFloorEntities = [];

//
/**************************************************************************************************************/
// V GAME SETUP SECTION OF THE CODE V
/**************************************************************************************************************/
//

/*************************************************************/
//preload()
//preloads images
//called by: when page is loaded
/*************************************************************/
function preload() {
  console.log("preload();");

  //Transparent image
  hidden = loadImage('/game_assets/transparent.png');
  sword = loadImage('/game_assets/sword.png');
}

/*************************************************************/
//setup()
//sets up loucation of sprites and starts the game
//called by: PFSetUp_startGame()
/*************************************************************/
function setup() {
  cnv = new Canvas(windowWidth, windowHeight);
  //Setting the min max heights and y values for platform spawns after canvas is created
  PFWorld_platFormMinY = 0.9 * height;
  PFWorld_platFormMaxY = 0.79 * height;
  PFWorld_platFormMaxHeight = 0.21 * height;
  PFWorld_platFormMinHeight = 0.1 * height;
  
  //Groups
  weakEnemies = new Group();
  platformGroup = new Group();

  //Only call functions when user clicks on start button;
  if (PFSetUp_gameStarted !== true) {return;}
  console.log("setup();");

  //Creating sprites
  PFSetUp_createSprites();
  //Setting up call backs
  PFSetUp_setColliders();
  //setting up movement for the sprites
  PFSetUp_movement();
  //Spawning enemies
  PFEnemies_spawnEnemies();
  //Creating platforms
  PFWorld_createPlatForms(PFSetUp_WALLTHICKNESS, width, 0, (height + PFSetUp_WALLTHICKNESS));
}

/*************************************************************/
//draw()
//draws background 60/s
/*************************************************************/
function draw() {
  //Only call draw when user clicks on start button;
  if (PFSetUp_gameStarted !== true) {return;}
  background("#62daff");

  //Sword gose to player as long as user is swinging it
  if (PFSetUp_swordSwinging === true) {
    if (PFSetUp_swordDir == "right") { PFSetUp_sword.pos = { x: PFSetUp_player.x + PFSetUp_SWORDXOFFSET, y: PFSetUp_player.y }; }
    if (PFSetUp_swordDir == "left") { PFSetUp_sword.pos = { x: PFSetUp_player.x - PFSetUp_SWORDXOFFSET * 1.05, y: PFSetUp_player.y }; }
  }
  
  //Calculating gravity on sprites first
  PFWorld_setGravity();
  //Seeing if sprite is on a surface second, if its on a surface, because is called after gravity it will
  //overwrite the onSurface = false in gravity.
  PFWorld_checkFloorTime();
  PFEnemies_WEMove();

  //Making camera follow player
  PFCamera_checkLock();
}

/*************************************************************/
//PFSetUp_createSprites()
//creates sprites
//called by: setup()
/*************************************************************/
function PFSetUp_createSprites() {
  console.log("PFSetUp_createSprites();");

  //Creating bounderies
  PFSetUp_wallBottom = new Sprite(width / 2, height, width * 1000, PFSetUp_WALLTHICKNESS, "k");
  PFSetUp_wallBottom.color = "black";
  PFSetUp_wallBottom.bounciness = PFSetUp_WALLBOUNCE;
  PFSetUp_wallBottom.friction = 100;

  PFSetUp_wallTop = new Sprite(width / 2, 0, width, PFSetUp_WALLTHICKNESS, "k");
  PFSetUp_wallTop.addImage(hidden);
  hidden.resize(width, PFSetUp_WALLTHICKNESS);
  PFSetUp_wallTop.bounciness = PFSetUp_WALLBOUNCE;

  PFSetUp_wallLeft = new Sprite(0, height / 2, PFSetUp_WALLTHICKNESS, height, "k");
  PFSetUp_wallLeft.addImage(hidden);
  hidden.resize(PFSetUp_WALLTHICKNESS, height);
  PFSetUp_wallLeft.bounciness = PFSetUp_WALLBOUNCE;

  //Creating the sword
  PFSetUp_sword = new Sprite(PFSetUp_SPAWNXDISPLACEMENT * width, PFSetUp_SPAWNYDISPLACEMENT * height,
    PFSetUp_SWORDSIZE / 2, PFSetUp_SWORDSIZE, "k");
  PFSetUp_sword.addImage(sword);
  sword.resize(PFSetUp_SWORDSIZE / 2, PFSetUp_SWORDSIZE);

  //Creating the character
  PFSetUp_player = new Sprite(PFSetUp_SPAWNXDISPLACEMENT * width, PFSetUp_SPAWNYDISPLACEMENT * height,
    PFSetUp_PLAYERWIDTH, PFSetUp_PLAYERHEIGHT, "d");
  //Properties of the player sprite
  PFSetUp_player.rotationLock = true
  PFSetUp_player.onSurface = false;
  PFSetUp_player.friction = PFSetUp_PLAYERFRICTION;
  PFSetUp_player.health = PFSetUp_PLAYERHEALTH;
  PFSetUp_player.bounciness = PFSetUp_PLAYERBOUNCE;
  PFSetUp_player.collidingFrames = 0;
  //Hit colddown
  PFSetUp_player.onColdDown = false;
  PFSetUp_player.stunned = false;

  //Adding platforms
  platformGroup.add(PFSetUp_wallBottom);

  //Adding to gravity effected sprites
  PFWorld_GRAVITYEFFECTEDSPRITES.push(PFSetUp_player);
}

/*************************************************************/
//PFSetUp_startGame()
//function that is called when user clicks on start button
//called by: start button on html
/*************************************************************/
function PFSetUp_startGame() {
  console.log("PFSetUp_startGame();");

  //Clearing HTML
  var x = document.getElementById("start_button");
  x.style.display = "none";

  x = document.getElementById("header");
  x.style.display = "none";

  //Starting the game
  PFSetUp_gameStarted = true;
  setup();
}

/*************************************************************/
//PFSetUp_movement()
//function that sets up movement for the player
//called by: setup()
/*************************************************************/
function PFSetUp_movement() {
  console.log("PFSetUp_movement()");

  //Key down events
  document.addEventListener("keydown", function(event) {
    //Jump code
    if (event.code === PFSetUp_JUMPKEY
      && PFSetUp_playerDied === false
      //Can Jump when on floor
      && PFSetUp_player.onSurface === true && PFSetUp_player.stunned === false) {
      PFSetUp_player.vel.y = PFSetUp_JUMPSTRENGTH;
      PFSetUp_player.onSurface = false;
    }
    //Left code
    //can only go left when right key is not down
    if (event.code === PFSetUp_LEFTKEY
      && PFSetUp_playerDied === false && PFSetUp_player.stunned === false) {
      PFSetUp_player.vel.x = -PFSetUp_PLAYERXSPEED;
      PFSetUp_lKeyDown = true;

      //Sword swing direction to left
      PFSetUp_swordDir = "left";
    }
    //Right code
    //can only go right if left key is not down
    if (event.code === PFSetUp_RIGHTKEY
      && PFSetUp_playerDied === false && PFSetUp_player.stunned === false) {
      PFSetUp_player.vel.x = PFSetUp_PLAYERXSPEED;
      PFSetUp_rKeyDown = true;

      //Sword swing direction to right
      PFSetUp_swordDir = "right";
    }
  });

  //Key up events
  document.addEventListener("keyup", function(event) {
    //Left code
    //Velocity set to 0 when left key is let go of
    if (event.code === PFSetUp_LEFTKEY && PFSetUp_playerDied === false && PFSetUp_player.stunned === false) {
      //Left key is up so set to false
      PFSetUp_lKeyDown = false;
      //If the left key was let go and the right key isnt pressed down set speed to 0.
      if (PFSetUp_lKeyDown === false
        && PFSetUp_rKeyDown === false) {
        //left key is no longer down so set to false
        PFSetUp_player.vel.x = 0;
      }
    }
    //Right code
    //Velocity set to 0 when left key is let go of
    if (event.code === PFSetUp_RIGHTKEY && PFSetUp_playerDied === false && PFSetUp_player.stunned === false) {
      //Right key is up so set to false
      PFSetUp_rKeyDown = false;
      //If the right key was let go and the left key isnt pressed down set speed to 0.
      if (PFSetUp_lKeyDown === false
        && PFSetUp_rKeyDown === false) {
        //Right key is no longer down so set to false
        PFSetUp_player.vel.x = 0;
      }
    }
  });
}

/*************************************************************/
//PFSetUp_setColliders()
//sets callback for the collision of the sprites
//called by: setup()
/*************************************************************/
function PFSetUp_setColliders() {
  console.log("PFSetUp_setColliders()");
  
  //When sword hits an enemy
  PFSetUp_sword.collides(weakEnemies, PFEnemies_hit);
  //When enemy hits player
  PFSetUp_player.collides(weakEnemies, PFEnemies_WEHit);
}

//
/**************************************************************************************************************/
// END OF GAME SETUP SECTION OF THE CODE
/**************************************************************************************************************/
//

//
/**************************************************************************************************************/
// V SWORD SETUP SECTION OF THE CODE V
/**************************************************************************************************************/
//

/*************************************************************/
//mouseClicked()
//p5 play function that is called when mouse is clicked
//will call swing sword function that swings a sword
//called by: when mouse clicked
/*************************************************************/
function mouseClicked() {
  //cant click before game starts
  if (PFSetUp_gameStarted === false) {return;}
  //console.log("mouseClicked();");
  PFSetUp_swingSword();
}

/*************************************************************/
//PFSetUp_swingSword()
//Will spawn a sword swing sprite at the player sprite
//called by: mouseClicked()
/*************************************************************/
function PFSetUp_swingSword() {
  //console.log("PFSetUp_swingSword();");

  //If the sword is swinging then player can't swing the sword
  if (PFSetUp_swordSwinging === true) {
    return;
  }

  //setting the "annimation"
  PFSetUp_sword.rotation = 0;
  //if player is swinging to the right set rotation to clock wise, other wise is left and set to anticlock wise
  if (PFSetUp_swordDir == "right") {PFSetUp_sword.rotationSpeed = PFSetUp_SWORDROTATIONSPEED;}
  else {PFSetUp_sword.rotationSpeed = -PFSetUp_SWORDROTATIONSPEED;}
  
  PFSetUp_swordSwinging = true;

  //Clearing sword "annimation"
  setTimeout(PFSetUp_swordClear, PFSetUp_PLAYERSWINGSPEED);
}

/*************************************************************/
//PFSetUp_swordClear()
//clears the sword after swinging it
//called by: PFSetUp_swordClear()
/*************************************************************/
function PFSetUp_swordClear() {
  //console.log("PFSetUp_swordClear();");
  PFSetUp_sword.pos = { x: 1000, y: 1000 };

  //sword is finished swinging so set to false
  PFSetUp_swordSwinging = false;
}

//
/**************************************************************************************************************/
// END OF SWORD SETUP SECTION OF THE CODE
/**************************************************************************************************************/
//