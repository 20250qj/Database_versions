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

//Platform variables
const PFWorld_PLATFORMNUM = 3;
const PFWorld_PLATFORMARRAY = [];
const PFWorld_PLATFORMSIZE = 200;
const PFWorld_PLATFORMTHICKNESS = 8;
const PFWorld_PLATFORMBOUNCE = 0;
const PFWorld_JUMPCOLDDOWN = 20;
const PFWorld_PLATFORMFRICTION = 0;

//platform check function varaibles
const PFWorld_platFormMaxDistance = 600;
const PFWorld_platFormMinDistance = 75;
var PFWorld_platFormMaxY;
var PFWorld_platFormMinY;
var PFWorld_platFormMaxHeight;
var PFWorld_platFormMinHeight;
var PFWorld_platFormCheckTries = 0;
var PFWorld_platFormReachAble;

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
  console.log("PFWorld_createPlatForms();");
  //Creating a bool to see if platform was checked, and an array to store 
  //this wave of generated platforms
  let platFormChecked;
  let platFormsGenerated = [];

  for (i = 0; i < PFWorld_PLATFORMNUM; i++) {
    platFormChecked = false;

    while (platFormChecked === false) {
      platformX = random(x1, x2);
      platformY = random(y1, y2);
      platFormChecked = PFWorld_checkPlatForms(platformX, platformY, platFormsGenerated);
    }

    platform = new Sprite(platformX, platformY, PFWorld_PLATFORMSIZE * 2, PFWorld_PLATFORMTHICKNESS, "k");
    platform.bounciness = PFWorld_PLATFORMBOUNCE;
    platform.friction = PFWorld_PLATFORMFRICTION;
    platformGroup.add(platform);
    platFormsGenerated.push(platform);
  }
  console.log("Match found after " + PFWorld_platFormCheckTries + " tries.")
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
    if (y <= PFWorld_platFormMaxY ||
      y >= PFWorld_platFormMinY) {
      return false;
    }
  }

  //The y value generated must be within jumpable height from one of the
  //platforms already generated.
  for (i = 0; i < platforms.length; i++) {
    //By deafult assume that it cant be reached
    PFWorld_platFormReachAble = false;
    //Comparing to platforms already generated
    let platform = platforms[i];

    //The difference in height from current y value that is generated
    let dy = (y - platform.y);
    let dx = (x - platform.x);

    //If difference in y or x is between max and min, then the platform can be reached from another platform
    if (PFWorld_platFormReachAble === false) {
      if (abs(dy) < PFWorld_platFormMaxHeight
        && abs(dy) > PFWorld_platFormMinHeight
        && abs(dx) < PFWorld_platFormMaxDistance
        && abs(dx) > PFWorld_platFormMinDistance) { PFWorld_platFormReachAble = true; }
    }
    //If too close to any single platform or to the floor, is invalid
    if (abs(dy) < PFWorld_platFormMinHeight
      || y > PFWorld_platFormMinY
      || abs(dx) < PFWorld_platFormMinDistance) { return false; }
  }

  //If not reachable from any of the platforms then invalid
  if (PFWorld_platFormReachAble === false) { return false; }

  return true;
}

//
/**************************************************************************************************************/
// END OF PLATFORM SECTION OF THE CODE
/**************************************************************************************************************/
//