/*******************************************************/
// Unamed platformer game
// Written by: Martin jin
// Started on: 28/3/23
// V.1.0

// Description: module containing enemy code
/*******************************************************/
MODULENAME = "platformer_PFEnemies.js";
console.log('%c' + MODULENAME + ': ', 'color: blue;');

/*******************************************************/
// Constants and variables
/*******************************************************/

//Enemy variables
const PFEnemies_FRICTION = 0;
const PFEnemies_PROXIMITY = 10;

//Weak enemy variables
const PFEnemies_WEAKENEMYMAX = 50;
const PFEnemies_WEAKENEMYLAYER = 2;
const PFEnemies_WEAKHITCOLDDOWN = 300;
const PFEnemies_WEAKENEMYSIZE = 50;
const PFEnemies_WEAKENEMIESSPAWNTIME = 5000;
const PFEnemies_WEAKENEMYHEALTH = 2;
const PFEnemies_WEAKSPAWNAMOUNT = 5;
const PFEnemies_WEAKENEMYSPEED = 5;
const PFEnemies_WEAKIDLESPEED = 2;
const PFEnemies_WEAKIDLETIME = 1200;
const PFEnemies_WEAKENEMYJUMPSTRENGTH = -20;
const PFEnemies_WEAKENEMYXKNOCKBACK = 5;
const PFEnemies_WEAKENEMYYKNOCKBACK = -10;
const PFEnemies_WEAKENEMYBOUNCE = 0;
const PFEnemies_WEAKENEMYSTUNDUR = 500;
const PFEnemies_WEAKENEMYCOLOR = "#ff2675";
const PFEnemies_WEAKENEMYHITCOLOR = "#ffb8d2";
const PFEnemies_WEAKENEMYMINSPAWNHEIGHT = (PFSetUp_GROUNDTHICKNESS * (1 + PFSetUp_DIRTRATIO)) + PFEnemies_WEAKENEMYSIZE;
var PFEnemies_weakEnemies = [];

//
/**************************************************************************************************************/
// V ENEMY SETUP SECTION OF THE CODE V
/**************************************************************************************************************/
//

/*************************************************************/
//PFEnemies_spawnEnemies()
//Spawns enemies
//called by: mutiple functions
//input: 2 x coordinates, which the enemy will spawn between
/*************************************************************/
function PFEnemies_spawnEnemies(x1, x2) {
  //Don't Spawn enemies over limit or if game has ended
  if (PFEnemies_weakEnemies.length + PFEnemies_WEAKSPAWNAMOUNT > PFEnemies_WEAKENEMYMAX || PFSetUp_gameStarted !== true) {
    return;
  }
  console.log("PFEnemies_spawnEnemies();");
  //Have to create a new group for the current wave of enemies, 
  //overlaps call back function dosent recongnise new sprites added to the group
  //after the call back has been initialised.
  let enemyWave = new Group;

  //Spawning weak enemies
  for (i = 0; i < PFEnemies_WEAKSPAWNAMOUNT; i++) {
    let enemy;
    enemy = new Sprite(random(x1, x2), random(PFSetUp_GROUNDTHICKNESS * (1 + PFSetUp_DIRTRATIO), height),
      PFEnemies_WEAKENEMYSIZE, PFEnemies_WEAKENEMYSIZE, "d");
    //setting properties of enemies
    enemy.friction = PFEnemies_FRICTION;
    enemy.health = PFEnemies_WEAKENEMYHEALTH;
    enemy.rotationLock = true;
    enemy.onSurface = false;
    enemy.onColdDown = false;
    enemy.bounciness = PFEnemies_WEAKENEMYBOUNCE
    enemy.stunned = false;
    enemy.color = PFEnemies_WEAKENEMYCOLOR;
    enemy.idling = false;
    enemy.layer = PFEnemies_WEAKENEMYLAYER;

    //Adding to array of enemies
    PFEnemies_weakEnemies.push(enemy);

    //Adding to groups
    enemyWave.add(enemy);
    gameSprites.add(enemy);
    PFWorld_GRAVITYEFFECTEDSPRITES.push(enemy)
  }
  //Resetting the collider for the new enemies
  PFSetUp_sword.overlapping(enemyWave, PFEnemies_hit);
  PFSetUp_player.colliding(enemyWave, PFEnemies_WEHit);
}

/*************************************************************/
//PFEnemies_hit()
//knocks back enemy when is hit
//called as call back by collides function
//input: sword, the specific enemy that was hit
/*************************************************************/
function PFEnemies_hit(sword, enemy) {
  //Only deals damage if player is actually swinging the sword
  if (PFSetUp_swordSwinging === false) { return; };

  if (enemy.stunned === false) {
    //Timeout function that enables the enemy to move again after a cold down
    enemy.stunned = true;
    enemy.color = PFEnemies_WEAKENEMYHITCOLOR;

    //hit audio, is cloned to allow mutiple of the same audio to be played at the same time
    let hitClone = hit.cloneNode(true);
    hitClone.volume = 0.3;
    hitClone.play();

    setTimeout(function() {
      enemy.stunned = false;
      enemy.color = PFEnemies_WEAKENEMYCOLOR;
    }, PFSetUp_SWORDSTUNDUR);

    //Determining which side the enemy was hit from, then sending the enemy in that direction
    let dx = enemy.x - PFSetUp_player.x;
    if (dx > 0) { enemy.vel.x = PFEnemies_WEAKENEMYXKNOCKBACK; }
    else { enemy.vel.x = -PFEnemies_WEAKENEMYXKNOCKBACK; };
    enemy.vel.y = PFSetUp_SWORDYKNOCKBACK;
  }

  if (enemy.onColdDown === false) {
    enemy.onSurface = false;
    enemy.health -= 1;

    console.log("PFEnemies_hit();");

    //Putting enemy on hit cold down
    enemy.onColdDown = true;
  } else { return; };
  //Timeout function that enables the enemy to be hit again after a cold down
  setTimeout(function() {
    enemy.onColdDown = false;
  }, PFEnemies_WEAKHITCOLDDOWN);

  //Remove enemy if is dead or too far away
  if (enemy.health === 0 || (abs(enemy.x - PFSetUp_player.x) > 2 * PFWorld_terrainTriggerPoint)) {
    //Removing from the array
    PFEnemies_weakEnemies.splice(PFEnemies_weakEnemies.indexOf(enemy), 1);
    enemy.remove();
  }
}


//
/**************************************************************************************************************/
// END OF ENEMY SETUP SECTION OF THE CODE
/**************************************************************************************************************/
//

//
/**************************************************************************************************************/
// V ENEMY BEHAVIOUR SECTION OF THE CODE V
/**************************************************************************************************************/
//

/*************************************************************/
//PFEnemies_WEMove()
//WE stands for weak enemies
//Determines the behvaiour/movement of weak enemies
//called in draw()
/*************************************************************/
function PFEnemies_WEMove() {
  for (i = 0; i < PFEnemies_weakEnemies.length; i++) {
    let weakEnemy = PFEnemies_weakEnemies[i];
    let dx = weakEnemy.x - PFSetUp_player.x;
    let dy = weakEnemy.y - PFSetUp_player.y;

    //Move around or idle if player is too far away.
    if (abs(dx) > width / 3 && weakEnemy.idling === false) {
      //Determining random behaviour based off a random number
      let ranNum = Math.round(random(1, 5));
      if (ranNum === 2) {
        weakEnemy.vel.x = PFEnemies_WEAKIDLESPEED;
      }
      else if (ranNum === 3) {
        weakEnemy.vel.x = -PFEnemies_WEAKIDLESPEED;
      }

      //The enemy moves in a specific direction or stop for a while before switching behaviour
      weakEnemy.idling = true;
      setTimeout(function() { weakEnemy.idling = false }, PFEnemies_WEAKIDLETIME);
      continue;
    };

    //If within detection range and idling, stop idling
    if (abs(dx) < width / 3) {
      weakEnemy.idling = false
    };

    //dont move towards player if idle
    if (weakEnemy.idling === true) { continue };

    //If difference is positive (below the player), jump when it can.
    //Using one because of very small decimal differences causing the enemy to jump
    if (dy > 1 && weakEnemy.onSurface === true && weakEnemy.stunned === false) {
      weakEnemy.vel.y = PFEnemies_WEAKENEMYJUMPSTRENGTH;
      weakEnemy.onSurface = false;
    };

    //If the enemy is within proximity stop moving towards player
    if (abs(dx) <= PFEnemies_PROXIMITY && weakEnemy.stunned === false) { weakEnemy.vel.x = 0; continue; };
    //If difference is negative, player must be to the right. Else is to the left
    if (dx < 0 && weakEnemy.stunned === false) { weakEnemy.vel.x = PFEnemies_WEAKENEMYSPEED }
    else if (weakEnemy.stunned === false) { weakEnemy.vel.x = -PFEnemies_WEAKENEMYSPEED };
  }
}

/*************************************************************/
//PFEnemies_WEHit()
//WE stands for weak enemies
//Determines what happens when a weak enemy hits the player
//called as a callback when enemy collide with player;
//input: player, and the player that collides
/*************************************************************/
function PFEnemies_WEHit(player, enemy) {
  if (PFSetUp_player.stunned === false) {
    //Timeout function that enables the player to move again after a cold down
    PFSetUp_player.stunned = true;
    PFSetUp_player.color = PFSetUp_PLAYERHITCOLOR;
    setTimeout(function() {
      PFSetUp_player.stunned = false;
      //Stopping the player from being knocked back
      PFSetUp_player.vel.x = 0;
      PFSetUp_player.color = PFSetUp_PLAYERCOLOR;
    }, PFEnemies_WEAKENEMYSTUNDUR);
  }

  if (PFSetUp_player.onColdDown === false) {
    PFSetUp_player.onSurface = false;
    PFSetUp_player.health -= 1;
    console.log("Player has " + PFSetUp_player.health + " hp left.")

    //player hit audio
    oof.pause();
    oof.currentTime = 0
    oof.play();

    //Determining which side the player was hit from, then sending the player in that direction
    let dx = enemy.x - PFSetUp_player.x;
    if (dx > 0) { PFSetUp_player.vel.x = -PFEnemies_WEAKENEMYXKNOCKBACK; }
    else { PFSetUp_player.vel.x = PFEnemies_WEAKENEMYXKNOCKBACK; };
    PFSetUp_player.vel.y = PFEnemies_WEAKENEMYYKNOCKBACK;
    console.log("PFEnemies_WEhit();");

    //Putting player on hit cold down
    PFSetUp_player.onColdDown = true;

    //Timeout function that enables the player to be hit again after a cold down
    setTimeout(function() {
      PFSetUp_player.onColdDown = false;
    }, PFEnemies_WEAKHITCOLDDOWN);
  }
}

/*************************************************************/
//PFEnemies_checkDespawn()
//WE stands for weak enemies
//Despawns the enemy when is too far away from the player
//called by: draw()
/*************************************************************/
/*function PFEnemies_checkDespawn() {
  for (i = 0; i < PFEnemies_weakEnemies.length; i++) {
    let weakEnemy = PFEnemies_weakEnemies[i];
    //Finding the differences in x, and if the enemy is too far despawn them.
    let dx = abs(weakEnemy.x - camera.x);
    if (dx > 1.5 * width) {
      //Removing from the array
      weakEnemy.remove();
      PFEnemies_weakEnemies.splice(PFEnemies_weakEnemies.indexOf(weakEnemy), 1);
    }
  }
}*/

//
/**************************************************************************************************************/
// END OF ENEMY BEHAVIOUR SECTION OF THE CODE
/**************************************************************************************************************/
//