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
const PFWorld_SPIKESIZE = 210;
const PFWorld_SPIKESTUNDUR = 300;
const PFWorld_SPIKEXKNOCKBACK = 20;
const PFWorld_SPIKEYKNOCKBACK = -20;

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
    PFEnemies_spawnEnemies(PFWorld_terrainTriggerPoint, PFWorld_terrainTriggerPoint + PFWorld_TRIGGERDISTANCE,
                          PFEnemies_weakEnemies, PFEnemies_WEAKENEMYMAX, 
                           PFEnemies_WEAKSPAWNAMOUNT, PFEnemies_WEAKENEMYSIZE, 
                           PFEnemies_WEAKENEMYHEALTH, PFEnemies_WEAKENEMYLAYER, 
                           "weak");
    PFEnemies_spawnEnemies(PFWorld_terrainTriggerPoint, PFWorld_terrainTriggerPoint + PFWorld_TRIGGERDISTANCE,
                          PFEnemies_rangedEnemies, PFEnemies_RANGEDENEMYMAX, 
                           PFEnemies_RANGEDSPAWNAMOUNT, PFEnemies_RANGEDENEMYSIZE, 
                           PFEnemies_RANGEDENEMYHEALTH, PFEnemies_RANGEDENEMYLAYER, 
                           "ranged");
  }
}

/*************************************************************/
//PFWorld_generateGround()
//Generates the ground from a given area
//called by: PFWorld_terrainCheck()
//input: 2 x points that the floor is generated between, and a boolean
//to generate a spike or not
/*************************************************************/
function PFWorld_generateGround(x1, x2, spike) {
  //determining whether to generate a ground with no spike or a spike
  let x = Math.round(random(1, 2));

  if (spike === false) {
    let xPos = (x1 + x2) / 2

    ground = new Sprite(xPos, height - PFWorld_GROUNDTHICKNESS / 2, PFWorld_TRIGGERDISTANCE, PFWorld_GROUNDTHICKNESS, "s");
    ground.bounciness = PFWorld_PLATFORMBOUNCE;
    ground.addImage(groundImg);
    groundImg.resize(PFWorld_TRIGGERDISTANCE, PFWorld_GROUNDTHICKNESS);

    //Adding platforms
    platformGroup.add(ground);
  } else if (spike === true) { PFWorld_generateSpike(x1, x2) };
}


/*************************************************************/
//PFWorld_generateSpike()
//Generates a randomly placed spike between the x coodinates given
//called by: PFWorld_generateGround()
//input: 2 x points that the spike can be generated between
/*************************************************************/
function PFWorld_generateSpike(x1, x2) {
  console.log("PFWorld_generateSpike();")

  //The height of the pipe below is calculated so that there is always enough height for
  //pipe gap, and so the ground will never get negative height.
  var groundLeftWidth = PFWorld_TRIGGERDISTANCE - random(PFWorld_SPIKESIZE, PFWorld_TRIGGERDISTANCE - PFWorld_SPIKESIZE); 
  //Taking out a random amount out of the left side ^^^^
  //such that at the longest and shortest possible width it will still leave a gap.
  var groundRightWidth = PFWorld_TRIGGERDISTANCE - groundLeftWidth; //The right side will be the remaining width

  groundLeftWidth -= PFWorld_SPIKESIZE; //Making a gap in the floor on both sides
  groundRightWidth -= PFWorld_SPIKESIZE;

  //Coordinates of the ground being calculated.
  var groundLeftXPos = x1 + groundLeftWidth / 2;
  var groundRightXPos = x2 - groundRightWidth / 2;

  //Creating the ground on either side with the previous values.
  groundLeft = new Sprite(groundLeftXPos, height - PFWorld_GROUNDTHICKNESS / 2, groundLeftWidth, PFWorld_GROUNDTHICKNESS, "s");
  groundLeft.bounciness = PFWorld_PLATFORMBOUNCE;
  //Creating a copy of the image to apply
  let groundLeftImage = createImage(groundLeftWidth, PFWorld_GROUNDTHICKNESS);
  groundLeftImage.copy(groundImg, 0, 0, groundLeftWidth, PFWorld_GROUNDTHICKNESS, 0, 0, groundLeftWidth, PFWorld_GROUNDTHICKNESS);
  groundLeft.addImage(groundLeftImage);

  groundRight = new Sprite(groundRightXPos, height - PFWorld_GROUNDTHICKNESS / 2, groundRightWidth, PFWorld_GROUNDTHICKNESS, "s");
  groundRight.bounciness = PFWorld_PLATFORMBOUNCE;
  //Creating a copy of the image to apply
  let groundRightImage = createImage(groundRightWidth, PFWorld_GROUNDTHICKNESS);
  groundRightImage.copy(groundImg, 0, 0, groundRightWidth, PFWorld_GROUNDTHICKNESS, 0, 0, groundRightWidth, PFWorld_GROUNDTHICKNESS);
  groundRight.addImage(groundRightImage);

  //Calculating the x position of the spike
  var spikeXPos = ((groundLeftXPos + groundLeftWidth / 2) + (groundRightXPos - groundRightWidth / 2)) / 2;

  //Creating the spike with the previous values.
  spike = new Sprite(spikeXPos, height - PFWorld_GROUNDTHICKNESS / 4, PFWorld_SPIKESIZE * 2, PFWorld_GROUNDTHICKNESS / 2, "s");
  spike.bounciness = PFWorld_PLATFORMBOUNCE;
  spike.addImage(spikes);
  spikes.resize(PFWorld_SPIKESIZE * 2,  PFWorld_GROUNDTHICKNESS / 2);

  //Adding to group
  platformGroup.add(groundRight);
  platformGroup.add(groundLeft);
  platformGroup.add(spike);
  spikeGroup.add(spike);

  //collision
  PFSetUp_player.colliding(spikeGroup, PFWorld_spikeHit);
  PFSetUp_player.collides(spikeGroup, PFWorld_spikeHit);
}


/*************************************************************/
//PFWorld_spikeHit()
//Determines what happens when a spike hits the player
//called as a callback when player collides with spike
//input: player, and the spike that collides
/*************************************************************/
function PFWorld_spikeHit(player, spike) {
  if (PFSetUp_player.stunned === false && PFSetUp_player.immune === false) {
    //Timeout function that enables the player to move again after a cold down
    PFSetUp_player.stunned = true;
    setTimeout(function() {
      PFSetUp_player.stunned = false;
      //Stopping the player from being knocked back
      PFSetUp_player.vel.x = 0;
    }, PFWorld_SPIKESTUNDUR);
  }
  //Player on hit cold down, cant be hit again in this duration.
  if (PFSetUp_player.immune === false) {
    PFSetUp_player.onSurface = false;
    PFSetUp_player.color = PFSetUp_PLAYERHITCOLOR;
    PFSetUp_player.health -= 1;
    console.log("Player has " + PFSetUp_player.health + " hp left.");

    //player hit audio
    oof.currentTime = 0;
    oof.play();

    //Determining which side the player was hit from, then sending the player in that direction
    let dx = spike.x - PFSetUp_player.x;
    if (dx > 0) { PFSetUp_player.vel.x = -PFWorld_SPIKEXKNOCKBACK; }
    else { PFSetUp_player.vel.x = PFWorld_SPIKEXKNOCKBACK; };
    PFSetUp_player.vel.y = PFWorld_SPIKEYKNOCKBACK;
    console.log("PFWorld_spikeHit();");

    //Putting player on hit cold down
    PFSetUp_player.immune = true;

    //Timeout function that enables the player to be hit again after a cold down
    setTimeout(function() {
      PFSetUp_player.immune = false;
      PFSetUp_player.color = PFSetUp_PLAYERCOLOR;
    }, PFSetUp_PLAYERIMMUNEDUR);
  }
}
//
/**************************************************************************************************************/
// END OF TERRAIN GENERATION SECTION OF THE CODE
/**************************************************************************************************************/
//
