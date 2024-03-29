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
//Sprites
var PFSetUp_player, PFSetUp_wallTop, PFSetUp_wallLeft, PFSetUp_sword;
const PFSetUp_SETUPSPRITES = [PFSetUp_player, PFSetUp_sword, PFSetUp_wallTop, PFSetUp_wallLeft, PFManager_healthBar];

//Groups
var platformGroup, gameSprites, spikeGroup, projectileGroup;

//Wall variables
const PFSetUp_WALLBOUNCE = 0;
const PFSetUp_WALLTHICKNESS = 8;
const PFSetUp_PLATFORMFRICTION = 0;

//Sword variables
var PFSetUp_swordSwinging = false;
var PFSetUp_swordDir = "right";
const PFSetUp_SWORDSIZE = 85;
const PFSetUp_SWORDSWINGDISTANCE = 65;
const PFSetUp_SWORDXKNOCKBACK = -20;
const PFSetUp_SWORDYKNOCKBACK = -10;
const PFSetUp_SWORDSTUNDUR = 300;
const PFSetUp_SWORDROTATIONSPEED = 12;
const PFSetUp_SWORDLAYER = 3;
const PFSetUp_SWORDANNIMATIONDUR = 300;
const PFSetUp_SWORDDAMAGE = 1;

//Player variables
const PFSetUp_SPAWNXDISPLACEMENT = 0.2;
const PFSetUp_SPAWNYDISPLACEMENT = 0.5;
const PFSetUp_PLAYERWIDTH = 50;
const PFSetUp_PLAYERHEIGHT = 50;
const PFSetUp_PLAYERXSPEED = 8;
const PFSetUp_PLAYERSWINGSPEED = 100;
const PFSetUp_PLAYERFRICTION = 0;
const PFSetUp_PLAYERHEALTH = 5;
const PFSetUp_PLAYERBOUNCE = 0;
const PFSetUp_PLAYERCOLOR = "#008aff";
const PFSetUp_PLAYERHITCOLOR = "#8ccaff";
const PFSetUp_PLAYERLAYER = 4;
const PFSetUp_PLAYERIMMUNEDUR = 500;
var PFSetUp_playerScore = 0;

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
var PFSetUp_enemyInterval;

//array that stores the sprites thats on the floor
var PFSetUp_onFloorEntities = [];

//Audio
var backGroundMusic = new Audio('/game_assets/game_sounds/platformerMusic.mp3');
backGroundMusic.volume = 0.1;
backGroundMusic.loop = true;

var swordSwoosh = new Audio('/game_assets/game_sounds/swordSwoosh.mp3');
swordSwoosh.volume = 0.05;
swordSwoosh.playbackRate = 1.5;

var hit = new Audio('/game_assets/game_sounds/hit.mp3');

var oof = new Audio('/game_assets/game_sounds/oof.mp3');
oof.volume = 0.1;

//Images
var hidden, sword, platformImg, groundImg, spikes;

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

  //Platform images
  platformImg = loadImage('/game_assets/game_platforms/platform.png');
  groundImg = loadImage('/game_assets/game_platforms/ground.png');
  spikes = loadImage('/game_assets/game_platforms/spikes.png');
}

/*************************************************************/
//setup()
//sets up loucation of sprites and starts the game
//called by: PFSetUp_startGame()
/*************************************************************/
function setup() {
  cnv = new Canvas(windowWidth, windowHeight);
  PFEnemies_rangedEnemyRange = width / 2;
  PFEnemies_weakEnemyRange = width / 2;

  PFWorld_PLATFORMMINY = 0.84 * height;
  PFWorld_PLATFORMMAXY = PFWorld_PLATFORMMINY - PFWorld_PLATFORMMINHEIGHT;

  //Resetting camera to be at the start
  camera.x = width / 2;
  PFWorld_terrainTriggerPoint = PFWorld_TRIGGERDISTANCE / 2;

  //Groups
  platformGroup = new Group();
  gameSprites = new Group();
  spikeGroup = new Group();
  projectileGroup = new Group();

  //Creating the starting screen floor
  PFWorld_generateGround(0, width, false);

  //Only call functions when user clicks on start button;
  if (PFSetUp_gameStarted !== true) { return; }
  console.log("setup();");

  //Displaying score
  PFManager_updateScore();

  //Overlapping starting screen floor because the width for the actual floor sections are larger
  PFWorld_generateGround(0, PFWorld_TRIGGERDISTANCE, false);

  //Playing music
  backGroundMusic.pause();
  backGroundMusic.currentTime = 0
  backGroundMusic.play();

  //Creating sprites
  PFSetUp_createSprites();
  //Spawning enemies
  PFEnemies_spawnEnemies(PFWorld_terrainTriggerPoint, width,
    PFEnemies_weakEnemies, PFEnemies_WEAKENEMYMAX,
    PFEnemies_WEAKSPAWNAMOUNT, PFEnemies_WEAKENEMYSIZE,
    PFEnemies_WEAKENEMYHEALTH, PFEnemies_WEAKENEMYLAYER,
    "weak");
  PFEnemies_spawnEnemies(PFWorld_terrainTriggerPoint, width,
    PFEnemies_rangedEnemies, PFEnemies_RANGEDENEMYMAX,
    PFEnemies_RANGEDSPAWNAMOUNT, PFEnemies_RANGEDENEMYSIZE,
    PFEnemies_RANGEDENEMYHEALTH, PFEnemies_RANGEDENEMYLAYER,
    "ranged");
  //setting up movement for the sprites
  PFSetUp_movement();
  //Creating platforms
  PFWorld_createPlatForms((PFWorld_PLATFORMSIZE / 2), PFWorld_TRIGGERDISTANCE - PFWorld_PLATFORMSIZE / 2, PFWorld_PLATFORMMINY, 0);
}

/*************************************************************/
//draw()
//draws background 60/s
/*************************************************************/
function draw() {
  //Only call draw when user clicks on start button;
  if (PFSetUp_gameStarted !== true) { return; }
  background("#62daff");

  //Calculating gravity on sprites first
  PFWorld_setGravity();
  //Seeing if sprite is on a surface. 
  PFWorld_checkFloorTime();

  //Enemy movement for ranged enemies
  PFEnemies_move(PFEnemies_rangedEnemies, PFEnemies_rangedEnemyRange,
    PFEnemies_RANGEDENEMYIDLESPEED, PFEnemies_RANGEDIDLETIME,
    PFEnemies_RANGEDSPEED, PFEnemies_RANGEDJUMPSTRENGTH,
    PFEnemies_RANGEDPROXIMITY);
  //Enemy movement for weak enemies
  PFEnemies_move(PFEnemies_weakEnemies, PFEnemies_weakEnemyRange,
    PFEnemies_WEAKIDLESPEED, PFEnemies_WEAKIDLETIME,
    PFEnemies_WEAKENEMYSPEED, PFEnemies_WEAKENEMYJUMPSTRENGTH,
    PFEnemies_WEAKPROXIMITY);

  //Checking if terrain should be generated
  PFWorld_terrainCheck();

  //Making camera follow player
  PFCamera_checkLock();

  //Check if sword is swinging
  PFSetUp_swordEquipped();

  //Setting the health bar
  PFManager_setHealthBar();
}

/*************************************************************/
//PFSetUp_createSprites()
//creates sprites
//called by: setup()
/*************************************************************/
function PFSetUp_createSprites() {
  console.log("PFSetUp_createSprites();");

  //Creating bounderies
  PFSetUp_wallTop = new Sprite(width / 2, 0, width, PFSetUp_WALLTHICKNESS, "k");
  PFSetUp_wallTop.addImage(hidden);
  hidden.resize(width, PFSetUp_WALLTHICKNESS);
  PFSetUp_wallTop.bounciness = PFSetUp_WALLBOUNCE;

  PFSetUp_wallLeft = new Sprite(0, height / 2, PFSetUp_WALLTHICKNESS, height, "k");
  PFSetUp_wallLeft.addImage(hidden);
  hidden.resize(PFSetUp_WALLTHICKNESS, height);
  PFSetUp_wallLeft.bounciness = PFSetUp_WALLBOUNCE;

  //Creating the sword
  PFSetUp_sword = new Sprite(width / 2, height / 2,
    PFSetUp_SWORDSIZE / 2, PFSetUp_SWORDSIZE, "n");
  PFSetUp_sword.layer = PFSetUp_SWORDLAYER;
  PFSetUp_sword.type = "sword";
  PFSetUp_sword.addImage(sword);
  sword.resize(PFSetUp_SWORDSIZE / 2, PFSetUp_SWORDSIZE);

  //Creating the invisble sprite that the sword moves towards when you swing it
  PFSetUp_swordSwingPoint = new Sprite(width / 2, height / 2, 1, 1, "n");
  PFSetUp_swordSwingPoint.addImage(hidden);
  hidden.resize(1, 1);

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
  PFSetUp_player.color = PFSetUp_PLAYERCOLOR;
  PFSetUp_player.type = "player";
  //Hit colddown
  PFSetUp_player.immune = false;
  PFSetUp_player.stunned = false;
  PFSetUp_player.layer = PFSetUp_PLAYERLAYER;
  PFSetUp_player.healthBar = false;

  //Storing the sprites for the front and back of the health bar
  PFSetUp_player.bar;
  PFSetUp_player.barBack;

  PFSetUp_player.maxHealth = PFSetUp_PLAYERHEALTH;

  //Adding to gravity effected sprites
  PFWorld_gravityEffectedSprites.push(PFSetUp_player);

  //Adding to group of sprites that needs to be cleared when player dies
  gameSprites.add(PFSetUp_wallLeft);
  gameSprites.add(PFSetUp_sword);
  gameSprites.add(PFSetUp_player);
  gameSprites.add(PFSetUp_wallTop);
}

/*************************************************************/
//PFSetUp_startGame()
//function that is called when user clicks on start button
//called by: start button on html
/*************************************************************/
function PFSetUp_startGame() {
  console.log("PFSetUp_startGame();");

  //Clearing HTML
  PFManager_clear(PFManager_STARTSCREENELEMENTS);

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
    }
    //Right code
    //can only go right if left key is not down
    if (event.code === PFSetUp_RIGHTKEY
      && PFSetUp_playerDied === false && PFSetUp_player.stunned === false) {
      PFSetUp_player.vel.x = PFSetUp_PLAYERXSPEED;
      PFSetUp_rKeyDown = true;
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
  if (PFSetUp_gameStarted === false) { return; }
  PFSetUp_swingSword();
}

/*************************************************************/
//PFSetUp_swordEquipped()
//moves sword to the player if they are swinging it
//called by: draw()
/*************************************************************/
function PFSetUp_swordEquipped() {
  //Mouse position is relative to the top left corner of the screen, 
  //mouses real position realtive to the current canvas needs to be calculated.
  let mouseRealX = mouseX + camera.x - width / 2

  //If mouse is to the right of player then swinging to the right
  if (PFSetUp_player.x < mouseRealX) { PFSetUp_swordDir = "right"; }
  else { PFSetUp_swordDir = "left"; }


  //Sword remains on players back if not swinging
  if (PFSetUp_swordSwinging === false) {
    PFSetUp_sword.moveTowards(PFSetUp_player, 0.4);
    if (PFSetUp_sword.rotation >= -225) {
      PFSetUp_sword.rotation = 225;
      PFSetUp_sword.rotationSpeed = 0;
    }
    else {
      PFSetUp_sword.rotationSpeed = -PFSetUp_SWORDROTATIONSPEED;
    };
    return;
  }

  //If playing swinging sword move sword infront or behind the player
  if (PFSetUp_swordSwinging === true) {
    PFSetUp_calculateSwingPoint();

    PFSetUp_sword.moveTowards(PFSetUp_swordSwingPoint, 0.3);
    return;
  }
}


/*************************************************************/
//PFSetUp_swingSword()
//Will spawn a sword swing sprite at the player sprite
//called by: mouseClicked()
/*************************************************************/
function PFSetUp_swingSword() {
  //If the sword is swinging then player can't swing the sword
  if (PFSetUp_swordSwinging === true) {
    return;
  }

  PFSetUp_swordSwinging = true;

  //Sword audio
  swordSwoosh.pause();
  swordSwoosh.currentTime = 0
  swordSwoosh.play();

  //setting the "annimation"
  PFSetUp_sword.rotation = -20;

  if (PFSetUp_swordDir === "right") { PFSetUp_sword.rotationSpeed = PFSetUp_SWORDROTATIONSPEED; }
  else { PFSetUp_sword.rotationSpeed = -PFSetUp_SWORDROTATIONSPEED; }

  //Clearing sword "annimation"
  setTimeout(PFSetUp_swordClear, PFSetUp_SWORDANNIMATIONDUR);
}

/*************************************************************/
//PFSetUp_swordClear()
//clears the sword after swinging it
//called by: PFSetUp_swordClear()
/*************************************************************/
function PFSetUp_swordClear() {
  //sword is finished swinging so start counting colddown
  PFSetUp_sword.rotationSpeed = 0;
  PFSetUp_sword.rotation = 0;
  setTimeout(PFSetUp_swordClearColdDown, PFSetUp_PLAYERSWINGSPEED);
}

/*************************************************************/
//PFSetUp_swordClearColdDown()
//clears the sword swing colddown
//called by: PFSetUp_swordClearColdDown()
/*************************************************************/
function PFSetUp_swordClearColdDown() {
  PFSetUp_swordSwinging = false;
}



/*************************************************************/
//PFSetUp_calculateSwingPoint()
//Calculates the position of the point the sword goes to spin
//called by: PFSetUp_swordEquipped()
/*************************************************************/
function PFSetUp_calculateSwingPoint() {
  //Mouse position is relative to the top left corner of the screen (0,0), 
  //mouses real position realtive to the current canvas needs to be calculated.
  let mouseRealX = mouseX + camera.x - width / 2
  //Finding of angle from sprite to mouse
  let a = abs(mouseRealX - PFSetUp_player.x);
  let b = abs(mouseY - PFSetUp_player.y);
  let theta = Math.atan(b / a);

  let xValue = PFSetUp_SWORDSWINGDISTANCE * Math.cos(theta);
  let yValue;

  let dy = mouseY - PFSetUp_player.y;
  //If mouse is above the player swing up, other wise swing below.
  if (dy < 1) {
    yValue = PFSetUp_player.y - (PFSetUp_SWORDSWINGDISTANCE * Math.sin(theta));
  } else { yValue = PFSetUp_player.y + (PFSetUp_SWORDSWINGDISTANCE * Math.sin(theta)); }


  //Depending on whether player is swinging to the left or right, shift the loucation of
  //the swing point
  if (PFSetUp_swordDir === "right") { xValue += PFSetUp_player.x }
  else { xValue = PFSetUp_player.x - xValue };

  //Moving swing point to calculated loucation
  PFSetUp_swordSwingPoint.pos = { x: xValue, y: yValue };
}

//
/**************************************************************************************************************/
// END OF SWORD SETUP SECTION OF THE CODE
/**************************************************************************************************************/
//