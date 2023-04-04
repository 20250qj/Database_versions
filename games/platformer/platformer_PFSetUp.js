/*******************************************************/
// Unamed platformer game
// Written by: Martin jin
// Started on: 28/3/23
// Set up module of the game
// V.1.0

// Description: Fight enemies in a playformer game
/*******************************************************/
MODULENAME = "game_platformer.js";
console.log('%c' + MODULENAME + ': ', 'color: blue;');

/*******************************************************/
// Constants and variables
/*******************************************************/

//Sprite variables
const PFSetUp_WALLTHICKNESS = 8;
const PFSetUp_swordXOffSet = 25;
var PFSetUp_swordSwinging = false;

//Player variables
const PFSetUp_spawnXDisplacement = 0.2;
const PFSetUp_spawnYDisplacement = 0.5;
const PFSetUp_playerWidth = 50;
const PFSetUp_playerHeight = 50;
const PFSetUp_playerXSpeed = 5;

var PFSetUp_playerDied = false;

//Player movement
const PFSetUp_jumpKey = "KeyW";
const PFSetUp_leftKey = "KeyA";
const PFSetUp_rightKey = "KeyD";
var PFSetUp_rKeyDown = false;
var PFSetUp_lKeyDown = false;

const PFSetUp_jumpStrength = -16;

//Game variables
var PFSetUp_gameStarted = false;
const PFSetUp_gravityEffectedEntities = [];
const PFSetUp_spritesBeforePlayer = 4;

//array that stores the sprites thats on the floor
var PFSetUp_onFloorEntities = [];

//World properties
const PFSetUp_GRAVITYMAX = 10;
const PFSetUp_GRAVITYACCELERATION = 0.6;
const PFSetUp_friction = 0;
/*************************************************************/
//preload()
//preloads images
//called by: when page is loaded
/*************************************************************/
function preload() {
  console.log("preload();");

  //Transparent image
  hidden = loadImage('/game_assets/transparent.png');
}

/*************************************************************/
//setup()
//sets up loucation of sprites and starts the game
//called by: PFSetUp_startGame()
/*************************************************************/
function setup() {
  cnv = new Canvas(windowWidth, windowHeight);
  //Groups
  allEntities = new Group();
  gravityEffectedEntities = new Group();

  //Only call setup when user clicks on start button;
  if (PFSetUp_gameStarted === true) {
    console.log("setup();");

    //Creating sprites
    PFSetUp_createSprites();
    //Setting up call backs
    PFSetUp_setColliders();
    //setting up movement for the sprites
    PFSetUp_movement();
  }
}

/*************************************************************/
//draw()
//draws background 60/s
/*************************************************************/
function draw() {
  //Only call draw when user clicks on start button;
  if (PFSetUp_gameStarted === true) {
    background("#62daff");
    //setting gravity for the sprites
    PFSetUp_setGravity();

    //Sword gose to player as long as user is swinging it
    if (PFSetUp_swordSwinging === true) {PFSetUp_sword.pos = {x: PFSetUp_player.x + PFSetUp_swordXOffSet, y: PFSetUp_player.y}};
  }
}

/*************************************************************/
//PFSetUp_createSprites()
//creates sprites
//called by: setup()
/*************************************************************/
function PFSetUp_createSprites() {
  console.log("PFSetUp_createSprites();");

  //Creating bounderies
  PFSetUp_wallBottom = new Sprite(width / 2, height, width, PFSetUp_WALLTHICKNESS, "k");
  PFSetUp_wallBottom.color = "black";
  PFSetUp_wallBottom.friction = PFSetUp_friction;

  PFSetUp_wallTop = new Sprite(width / 2, 0, width, PFSetUp_WALLTHICKNESS, "k");
  PFSetUp_wallTop.addImage(hidden);
  hidden.resize(width, PFSetUp_WALLTHICKNESS);

  PFSetUp_wallLeft = new Sprite(0, height / 2, PFSetUp_WALLTHICKNESS, height, "k");
  PFSetUp_wallLeft.addImage(hidden);
  hidden.resize(PFSetUp_WALLTHICKNESS, height);

  PFSetUp_wallRight = new Sprite(width, height / 2, PFSetUp_WALLTHICKNESS, height, "k");
  PFSetUp_wallRight.addImage(hidden);
  hidden.resize(PFSetUp_WALLTHICKNESS, height);

  //Creating the character
  PFSetUp_player = new Sprite(PFSetUp_spawnXDisplacement * width, PFSetUp_spawnYDisplacement * height,
    PFSetUp_playerWidth, PFSetUp_playerHeight, "d");

  //Creating the sword
  PFSetUp_sword = new Sprite(PFSetUp_spawnXDisplacement * width, PFSetUp_spawnYDisplacement * height, 
                             PFSetUp_playerWidth/2, PFSetUp_playerHeight, "n");
  
  //Adding to group of all sprites
  allEntities.add(PFSetUp_player);
  allEntities.add(PFSetUp_wallBottom);
  allEntities.add(PFSetUp_wallTop);
  allEntities.add(PFSetUp_wallLeft);
  allEntities.add(PFSetUp_wallRight);

  //Adding to array of gravity effected sprites
  PFSetUp_gravityEffectedEntities.push(PFSetUp_player);
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
    if (event.code === PFSetUp_jumpKey
      && PFSetUp_playerDied === false
      //Can Jump when on floor
      && PFSetUp_onFloorEntities.includes(PFSetUp_player.idNum) === true) {
      PFSetUp_player.vel.y += PFSetUp_jumpStrength;

      //Removing sprite from on floor array, so they can no longer jump.
      let i = PFSetUp_onFloorEntities.indexOf(PFSetUp_player.idNum);
      PFSetUp_onFloorEntities.splice(i, 1);
    }
    //Left code
    //can only go left when right key is not down
    if (event.code === PFSetUp_leftKey
      && PFSetUp_playerDied === false) {
      PFSetUp_player.vel.x = -PFSetUp_playerXSpeed;
      PFSetUp_lKeyDown = true;
    }
    //Right code
    //can only go right if left key is not down
    if (event.code === PFSetUp_rightKey
      && PFSetUp_playerDied === false) {
      PFSetUp_player.vel.x = PFSetUp_playerXSpeed;
      PFSetUp_rKeyDown = true;
    }
  });

  //Key up events
  document.addEventListener("keyup", function(event) {
    //Left code
    //Velocity set to 0 when left key is let go of
    if (event.code === PFSetUp_leftKey && PFSetUp_playerDied === false) {
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
    if (event.code === PFSetUp_rightKey && PFSetUp_playerDied === false) {
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
  //Adding gravity effected entities to a group to detect collision with the floor
  for (i = 0; i < PFSetUp_gravityEffectedEntities.length; i++) { gravityEffectedEntities.add(PFSetUp_gravityEffectedEntities[i]); }

  //All floors and platforms
  gravityEffectedEntities.collides(PFSetUp_wallBottom, PFSetUp_onFloor);
}

/*************************************************************/
//PFSetUp_setGravity()
//sets gravity for the sprites
//no console log as its called 60 times a second
//called by: draw()
/*************************************************************/
function PFSetUp_setGravity() {
  for (i = 0; i < PFSetUp_gravityEffectedEntities.length; i++) {
    let sprite = PFSetUp_gravityEffectedEntities[i];

    sprite.vel.y += PFSetUp_GRAVITYACCELERATION;
    //Limiting the effect of gravity
    if (sprite.vel.y > PFSetUp_GRAVITYMAX) { sprite.vel.y = PFSetUp_GRAVITYMAX };
    //Stopping gravity when on floor
    if (PFSetUp_onFloorEntities.includes(sprite.idNum) === true) { sprite.vel.y = 0; };
  }
}

/*************************************************************/
//mouseClicked()
//p5 play function that is called when mouse is clicked
//will call swing sword function that swings a sword
//called by: when mouse clicked
/*************************************************************/
function mouseClicked() {
  console.log("mouseClicked();");
  PFSetUp_swingSword();
}

/*************************************************************/
//PFSetUp_onFloor()
//call back function that is called when touching the floor or a platform
//input: param1, sprite in group that collided
//called by: collides method as a callback
//no console log as its called hundreads of times.
/*************************************************************/
function PFSetUp_onFloor(param1, sprite) {
  let spriteId = sprite.idNum + PFSetUp_spritesBeforePlayer;
  //Adding sprite to array that stores the sprites that can jump/on floor
  //But only if they are not already in the array.
  if (PFSetUp_onFloorEntities.includes(spriteId) === false) {
    console.log("Id of entitiy on floor: " + spriteId);
    PFSetUp_onFloorEntities.push(spriteId);
    console.log(PFSetUp_onFloorEntities);
  }
}

/*************************************************************/
//PFSetUp_swingSword()
//Will spawn a sword swing sprite at the player sprite
//called by: mouseClicked()
/*************************************************************/
function PFSetUp_swingSword() {
  console.log("PFSetUp_swingSword();");

  //If the sword is swinging then player can't swing the sword
  if (PFSetUp_swordSwinging === true) {
    return;}
  
  //teleporting the sprite to the player
  PFSetUp_sword.rotation = 0;
  PFSetUp_sword.rotationSpeed = 10;
  PFSetUp_swordSwinging = true;

  //Clearing sword "annimation"
  setTimeout(PFSetUp_swordClear, 140);
}

/*************************************************************/
//PFSetUp_swordClear()
//clears the sword after swinging it
//called by: PFSetUp_swordClear()
/*************************************************************/
function PFSetUp_swordClear() {
  console.log("PFSetUp_swordClear();");
  PFSetUp_sword.pos = {x: 1000, y: 1000};

  //sword is finished swinging so set to false
  PFSetUp_swordSwinging = false;
}