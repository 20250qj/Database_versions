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
const PFWorld_GRAVITYMAX = 10;

//Array of gravity effected sprites
const PFWorld_GRAVITYEFFECTEDSPRITES = [];

//Platform variables
const PFWorld_PLATFORMNUM = 1;
const PFWorld_PLATFORMARRAY = [];
const PFWorld_PLATFORMSIZE = 200;
const PFWorld_PLATFORMTHICKNESS = 8;
const PFWorld_PLATFORMBOUNCE = 0;
const PFWorld_JUMPCOLDDOWN = 20;
const PFWorld_PLATFORMFRICTION = 0;

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
/*************************************************************/
function PFWorld_createPlatForms() {
  console.log("PFWorld_createPlatForms();");
  for (i = 0; i < PFWorld_PLATFORMNUM; i++) {

    platformX = 400;
    platformY = 800;

    platform = new Sprite(platformX, platformY, PFWorld_PLATFORMSIZE * 2, PFWorld_PLATFORMTHICKNESS, "k");
    platform.bounciness = PFWorld_PLATFORMBOUNCE;
    platform.friction = PFWorld_PLATFORMFRICTION;
    platformGroup.add(platform);
  }
}

//
/**************************************************************************************************************/
// END OF PLATFORM SECTION OF THE CODE
/**************************************************************************************************************/
//