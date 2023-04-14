/*******************************************************/
// Unamed platformer game
// Written by: Martin jin
// Started on: 28/3/23
// V.1.0

// Description: world module of the game, manages the enviorment
/*******************************************************/
MODULENAME = "platformer_PFWorld.js";
console.log('%c' + MODULENAME + ': ', 'color: blue;');

/*******************************************************/
// Constants and variables
/*******************************************************/

//Gravity related variables
const PFWorld_GRAVITYACCELERATION = 0.75;
const PFWorld_GRAVITYMAX = 14;

//Array of gravity effected sprites
const PFWorld_GRAVITYEFFECTEDSPRITES = [];

//Ground variables
const PFWorld_GRASSCOLOR = "#4eff70";
const PFWorld_DIRTCOLOR = "#8f4300";
const PFWorld_GROUNDTHICKNESS = 30;
const PFWorld_HOLESIZE = 200;

//Platform variables
const PFWorld_PLATFORMNUM = 3;
const PFWorld_PLATFORMARRAY = [];
const PFWorld_PLATFORMSIZE = 400;
const PFWorld_PLATFORMTHICKNESS = 15;
const PFWorld_PLATFORMBOUNCE = 0;
const PFWorld_JUMPCOLDDOWN = 15;
const PFWorld_PLATFORMFRICTION = 0;
const PFWorld_platFORMCOLOR = "#ff7a00";

//platform check function varaibles
const PFWorld_PLATFORMMAXDISTANCE = 600;
const PFWorld_PLATFORMMINDISTANCE = PFWorld_PLATFORMSIZE;

//Max jumpable height, not y limit
const PFWorld_PLATFORMMAXY = 650;

const PFWorld_PLATFORMMINY = 750;
const PFWorld_PLATFORMMAXHEIGHT = 250;
const PFWorld_PLATFORMMINHEIGHT = 150;
var PFWorld_platFormCheckTries = 0;
var PFWorld_platFormReachAble;

//Terrain generation variables
const PFWorld_TRIGGERDISTANCE = 2000;
var PFWorld_terrainTriggerPoint = PFWorld_TRIGGERDISTANCE / 2;

//
/**************************************************************************************************************/
// V GRAVITY SECTION OF THE CODE V
/**************************************************************************************************************/
//

/*************************************************************/
//PFWorld_setGravity()
//sets gravity for the sprites
//called by: draw()
/*************************************************************/
function PFWorld_setGravity() {
  for (i = 0; i < PFWorld_GRAVITYEFFECTEDSPRITES.length; i++) {
    let sprite = PFWorld_GRAVITYEFFECTEDSPRITES[i];

    //Accelerating the sprite into the floor
    if (sprite.vel.y < PFWorld_GRAVITYMAX) {
      sprite.vel.y += PFWorld_GRAVITYACCELERATION;
      sprite.onSurface = false;
    }
  }
}

/*************************************************************/
//PFWorld_checkFloorTime()
//checks how many frames sprite was colliding with a platform
//called by: draw()
/*************************************************************/
function PFWorld_checkFloorTime() {
  for (i = 0; i < PFWorld_GRAVITYEFFECTEDSPRITES.length; i++) {
    let sprite = PFWorld_GRAVITYEFFECTEDSPRITES[i];

    sprite.collidingFrames = platformGroup.colliding(sprite);

    if (sprite.collidingFrames > PFWorld_JUMPCOLDDOWN) {
      sprite.onSurface = true;
    }
  }
}

//
/**************************************************************************************************************/
// END OF GRAVITY SECTION OF THE CODE
/**************************************************************************************************************/
//

//
/**************************************************************************************************************/
// V PLATFORM SECTION OF THE CODE V
/**************************************************************************************************************/
//

/*************************************************************/
//PFWorld_createPlatForms()
//Randomly generates platforms
//called by: setup()
//input: x region where it can be generated - x1, x2
//       y region where it can be generated - y1, y2
/*************************************************************/
function PFWorld_createPlatForms(x1, x2, y1, y2) {
  //Creating a bool to see if platform was checked, and an array to store 
  //this wave of generated platforms
  let platFormChecked;
  let platFormsGenerated = [];

  //Clearing tries to 0 to see how many attemps it took to guess a valid coordinate.
  PFWorld_platFormCheckTries = 0;

  for (i = 0; i < PFWorld_PLATFORMNUM; i++) {
    platFormChecked = false;

    while (platFormChecked === false) {
      //Guess a random point and checking if its valid
      platformX = Math.round(random(x1, x2));
      platformY = Math.round(random(y1, y2));
      platFormChecked = PFWorld_checkPlatForms(platformX, platformY, platFormsGenerated);
      if (PFWorld_platFormCheckTries > 1000) { console.log("an error occured with the spawning of platforms"); return; };
    }

    platform = new Sprite(platformX, platformY, PFWorld_PLATFORMSIZE, PFWorld_PLATFORMTHICKNESS, "k");

    //Properties of platform
    platform.bounciness = PFWorld_PLATFORMBOUNCE;
    platform.friction = PFWorld_PLATFORMFRICTION;
    platform.color = PFWorld_platFORMCOLOR;
    platform.addImage(platformImg);
    platformImg.resize(PFWorld_PLATFORMSIZE, PFWorld_PLATFORMTHICKNESS);

    //Adding to groups
    platformGroup.add(platform);
    gameSprites.add(platform);
    platFormsGenerated.push(platform);
  }
}

/*************************************************************/
//PFWorld_checkPlatForms()
//Checks whether the platform generated is valid, and whether it
//be reached or not, as well as if is going to overlap another platform.
//called by: PFWorld_createPlatForms()
//input: the x and y positions being checked, and an array of the platforms
//that has been generated already.
/*************************************************************/
function PFWorld_checkPlatForms(x, y, platforms) {
  PFWorld_platFormCheckTries += 1;

  //For the first platform generated, it must be within jumpable height,
  //but also higher than the minimal height.
  if (platforms.length == 0) {
    if (y < PFWorld_PLATFORMMAXY ||
      y > PFWorld_PLATFORMMINY) {
      return false;
    } else { return true };
  }

  PFWorld_platFormReachAble = false;

  //The y value generated must be within jumpable height from one of the
  //platforms already generated, for loop is calculating if is reachable from
  //some other platform.
  for (i = 0; i < platforms.length; i++) {
    //Comparing to platforms already generated
    let platform = platforms[i];

    //The difference in height from current y value that is generated
    let dy = Math.abs(y - platform.y);
    let dx = Math.abs(x - platform.x);

    //If difference in y is below max and above min height, then the platform can be reached from another platform
    if (PFWorld_platFormReachAble === false) {
      if (dy <= PFWorld_PLATFORMMAXHEIGHT
        && dy >= PFWorld_PLATFORMMINHEIGHT
        && dx <= PFWorld_PLATFORMMAXDISTANCE
        && dx >= PFWorld_PLATFORMMINDISTANCE) { PFWorld_platFormReachAble = true; }
    }
    //If too close to the floor or platforms too close together return false
    if (y > PFWorld_PLATFORMMINY || dx < PFWorld_PLATFORMMINDISTANCE) {
      return false;
    }
  }

  //If not reachable from any of the platforms then invalid
  if (PFWorld_platFormReachAble === false) {
    return false;
  }
  return true;
}

//
/**************************************************************************************************************/
// END OF PLATFORM SECTION OF THE CODE
/**************************************************************************************************************/
//

//
/**************************************************************************************************************/
// V TERRAIN GENERATION SECTION OF THE CODE V
/**************************************************************************************************************/
//

/*************************************************************/
//PFWorld_terrainCheck()
//checks if a new area of the map needs to be genereated
//called by: draw()
/*************************************************************/
function PFWorld_terrainCheck() {
  if (PFSetUp_player.x > PFWorld_terrainTriggerPoint) {

    //Creating floor
    PFWorld_generateGround(PFWorld_terrainTriggerPoint + PFWorld_TRIGGERDISTANCE / 2, PFWorld_terrainTriggerPoint + 1.5 * PFWorld_TRIGGERDISTANCE, true);
    PFWorld_terrainTriggerPoint += PFWorld_TRIGGERDISTANCE;

    //Creating the platforms at the next trigger point/ahead the player
    PFWorld_createPlatForms(PFWorld_terrainTriggerPoint - (PFWorld_TRIGGERDISTANCE / 2) + (PFWorld_PLATFORMSIZE / 2)
      , PFWorld_terrainTriggerPoint + (PFWorld_TRIGGERDISTANCE / 2) - (PFWorld_PLATFORMSIZE / 2)
      , PFWorld_PLATFORMMINY
      , 0);

    //Spawning enemies infront of the player everytime they go a certain distance
    PFEnemies_spawnEnemies(PFWorld_terrainTriggerPoint, PFWorld_terrainTriggerPoint + PFWorld_TRIGGERDISTANCE);
  }
}

/*************************************************************/
//PFWorld_generateGround()
//Generates the ground from a given area
//called by: PFWorld_terrainCheck()
//input: 2 x points that the floor is generated between, and a boolean
//to generate a hole or not
/*************************************************************/
function PFWorld_generateGround(x1, x2, hole) {
  //determining whether to generate a ground with no holes or a hole
  let x = Math.round(random(1, 2));

  if (x === 1 || hole === false) {
    let xPos = (x1 + x2) / 2

    ground = new Sprite(xPos, height - PFWorld_GROUNDTHICKNESS / 2, PFWorld_TRIGGERDISTANCE, PFWorld_GROUNDTHICKNESS, "s");
    ground.bounciness = PFWorld_PLATFORMBOUNCE;
    ground.addImage(groundImage);
    groundImage.resize(PFWorld_TRIGGERDISTANCE, PFWorld_GROUNDTHICKNESS);

    //Adding platforms
    platformGroup.add(ground);
  } else if (hole === true) { PFWorld_generateHole(x1, x2) };
}


/*************************************************************/
//PFWorld_generateHole()
//Generates a randomly place hole between the x coodinates given
//called by: PFWorld_generateGround()
//input: 2 x points that the hole can be generated between
/*************************************************************/
function PFWorld_generateHole(x1, x2) {
  console.log("flappy_createPipes();")

  //The height of the pipe below is calculated so that there is always enough height for
  //pipe gap, and so the ground will never get negative height.
  var groundLeftWidth = PFWorld_TRIGGERDISTANCE - random(PFWorld_HOLESIZE, PFWorld_TRIGGERDISTANCE - PFWorld_HOLESIZE); 
  //Taking out a random amount out of the left side ^^^^
  //such that at the longest and shortest possible width it will still leave a gap.
  var groundRightWidth = PFWorld_TRIGGERDISTANCE - groundLeftWidth; //The right side will be the remaining width

  groundLeftWidth -= PFWorld_HOLESIZE; //Making a gap in the floor on both sides
  groundRightWidth -= PFWorld_HOLESIZE;

  //Coordinates of the ground being calculated.
  var groundLeftXPos = x1 + groundLeftWidth / 2;
  var groundRightXPos = x2 - groundRightWidth / 2;

  //Creating the ground on either side with the previous values.
  groundLeft = new Sprite(groundLeftXPos, height - PFWorld_GROUNDTHICKNESS / 2, groundLeftWidth, PFWorld_GROUNDTHICKNESS, "s");
  groundLeft.bounciness = PFWorld_PLATFORMBOUNCE;

  groundRight = new Sprite(groundRightXPos, height - PFWorld_GROUNDTHICKNESS / 2, groundRightWidth, PFWorld_GROUNDTHICKNESS, "s");
  groundRight.bounciness = PFWorld_PLATFORMBOUNCE;

  //Calculating the x position of the hole
  var holeXPos = ((groundLeftXPos + groundLeftWidth / 2) + (groundRightXPos - groundRightWidth / 2)) / 2;

  //Creating the hole with the previous values.
  hole = new Sprite(holeXPos, height, PFWorld_HOLESIZE * 2, PFWorld_GROUNDTHICKNESS, "s");
  hole.bounciness = PFWorld_PLATFORMBOUNCE;

  platformGroup.add(groundRight);
  platformGroup.add(groundLeft);
}

//
/**************************************************************************************************************/
// END OF TERRAIN GENERATION SECTION OF THE CODE
/**************************************************************************************************************/
//