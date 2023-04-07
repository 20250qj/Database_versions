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
const PFWorld_GRAVITYACCELERATION = 0.75;
const PFWorld_GRAVITYMAX = 10;
const PFWorld_JUMPCOLDDOWN = 200;

//Array of gravity effected sprites
const PFWorld_gravityEffectedSprites = [];

//
/**************************************************************************************************************/
// V GRAVITY SECTION OF THE CODE V
/**************************************************************************************************************/
//

/*************************************************************/
//PFWorld_onSurface()
//sets onFloor property of sprites, and if they can jump
//called as a callback function when sprites collide with a standable surface
//Input: some parameter I dont know, the sprite that collides with the surface
/*************************************************************/
function PFWorld_onSurface(param1, sprite) {
  sprite.onFloor = true;

  //Jump colddown
  setTimeout(function(){sprite.canJump = true;}, PFWorld_JUMPCOLDDOWN);
}


/*************************************************************/
//PFWorld_setGravity()
//sets gravity for the sprites
//called by: draw()
/*************************************************************/
function PFWorld_setGravity() {
  for (i = 0; i < PFWorld_gravityEffectedSprites.length; i++) {
    let sprite = PFWorld_gravityEffectedSprites[i];

    //Not letting sprites accelerate past terminal velocity
    //Or if they are on the floor
    if (sprite.onFloor === true) {sprite.vel.y = 0; continue;}
    if (sprite.vel.y < PFWorld_GRAVITYMAX) {sprite.vel.y += PFWorld_GRAVITYACCELERATION;}
  }
}

//
/**************************************************************************************************************/
// END OF GRAVITY SECTION OF THE CODE
/**************************************************************************************************************/
//