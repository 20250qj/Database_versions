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
const PFEnemies_MAXENEMYAMOUNT = 30;
const PFEnemies_BOUNCINESS = 0;
const PFEnemies_ENEMYIMMUNETIME = 400;
var PFEnemies_weakEnemies = [];
var PFEnemies_rangedEnemies = [];

//Weak enemy variables
const PFEnemies_WEAKENEMYMAX = 50;
const PFEnemies_WEAKENEMYLAYER = 2;
const PFEnemies_WEAKENEMYSIZE = 50;
const PFEnemies_WEAKENEMIESSPAWNTIME = 5000;
const PFEnemies_WEAKENEMYHEALTH = 2;
const PFEnemies_ENEMYHITCOLOR = "#ffb8d2";
const PFEnemies_ENEMYIDLECOLOR = "#ff7900";
const PFEnemies_ENEMYCOLOR = "#ff2675";
var PFEnemies_weakEnemyRange;

const PFEnemies_WEAKSPAWNAMOUNT = 0;
const PFEnemies_WEAKENEMYSPEED = 8;
const PFEnemies_WEAKIDLESPEED = 1;
const PFEnemies_WEAKIDLETIME = 1500;
const PFEnemies_WEAKENEMYJUMPSTRENGTH = -20;
const PFEnemies_WEAKENEMYXKNOCKBACK = 5;
const PFEnemies_WEAKENEMYYKNOCKBACK = -10;
const PFEnemies_WEAKENEMYSTUNDUR = 400;
const PFEnemies_WEAKPROXIMITY = 10;
const PFEnemies_WEAKDAMAGE = 1;

//Ranged enemy variables
const PFEnemies_RANGEDSPAWNAMOUNT = 2;
const PFEnemies_RANGEDENEMYMAX = 10;
const PFEnemies_RANGEDENEMYSIZE = 50;
const PFEnemies_RANGEDENEMYHEALTH = 2;
const PFEnemies_RANGEDENEMYLAYER = 2;
const PFEnemies_RANGEDENEMYIDLESPEED = 2;
const PFEnemies_RANGEDIDLETIME = 2000;
const PFEnemies_RANGEDSPEED = 4;
const PFEnemies_RANGEDJUMPSTRENGTH = -15;
const PFEnemies_RANGEDPROXIMITY = 400;
const PFEnemies_RANGEDATTACKINTERVAL = 700;
var PFEnemies_rangedEnemyRange;

//Ranged enemy projectile variables
const PFEnemies_PROJECTILESIZE = 12;
const PFEnemies_PROJECTILECOLOR = "#ff2675";
const PFEnemies_PROJECTILEOFFSET = 25;
const PFEnemies_PROJECTILESPEED = 40;
const PFEnemies_PROJECTILEDESPAWNTIME = 1000;
const PFEnemies_PROJECTTILEKNOCKBACKX = 5;
const PFEnemies_PROJECTTILEKNOCKBACKY = -5;
const PFEnemies_PROJECTILEDAMAGE = 1;
const PFEnemies_PROJECTTILESTUNDUR = 300;
const PFEnemies_PROJECTILEROTATIONSPEED = 200;
const PFEnemies_PROJECTILEMINIMALSPEED = 7;


//
/**************************************************************************************************************/
// V ENEMY SETUP SECTION OF THE CODE V
/**************************************************************************************************************/
//

/*************************************************************/
//PFEnemies_spawnEnemies()
//Spawns enemies
//called by: PFWorld_terrainCheck(), when player crosses a trigger point
//input: 2 x coordinates, which the enemies will spawn between, and the varibles to determine the type of enemy spawned
/*************************************************************/
function PFEnemies_spawnEnemies(x, y, enemies, max, spawnAmount, size, hp, layer, type) {
  //Don't Spawn enemies if over limit or if game has ended
  if (enemies.length + spawnAmount > max || PFSetUp_gameStarted !== true) {
    return;
  }
  console.log("PFEnemies_spawnEnemies();");
  //Have to create a new group for the current wave of enemies, 
  //overlaps call back function dosent recongnise new sprites added to the group
  //after the call back has been initialised.
  let enemyWave = new Group;

  //Spawning enemies depending on type
  for (i = 0; i < spawnAmount; i++) {
    let enemy;
    if (type === "weak") {
      enemy = new Sprite(random(x, y), random(height + size * 2, size * 2),
        size, size, "d");
    } else if (type === "ranged") {
      enemy = new Sprite(random(x, y), random(height + size * 2, size * 2), size, size, "d");
      //Drawing the triangle ontop of the enemy otherwise it dosent count as a sprite
      enemy.draw = function() { triangle(-size / 2, size / 2, 0, -size / 2, size / 2, size / 2); };
    }
    //setting properties of enemies
    enemy.friction = PFEnemies_FRICTION;
    enemy.health = hp;
    enemy.rotationLock = true;
    enemy.onSurface = false;
    enemy.immune = false;
    enemy.bounciness = PFEnemies_BOUNCINESS
    enemy.stunned = false;
    enemy.color = PFEnemies_ENEMYCOLOR;
    enemy.idling = false;
    enemy.layer = layer;
    enemy.rangedColdDown = false;
    enemy.type = type;

    //Adding to array of enemies
    enemies.push(enemy);

    //Adding to groups
    enemyWave.add(enemy);
    gameSprites.add(enemy);
    PFWorld_gravityEffectedSprites.push(enemy)
  }
  //Resetting the collider for the new enemies
  PFSetUp_sword.overlapping(enemyWave, PFEnemies_swordHit);

  //Colliders
  if (type === "ranged") {
    PFSetUp_player.colliding(projectTileGroup, (player, enemy) => {
      PFEnemies_hit(player, enemy,
        PFEnemies_PROJECTILEDAMAGE, PFEnemies_PROJECTTILEKNOCKBACKX,
        PFEnemies_PROJECTTILEKNOCKBACKY, PFEnemies_PROJECTTILESTUNDUR,
        type)
    });
    PFSetUp_player.collides(projectTileGroup, (player, enemy) => {
      PFEnemies_hit(player, enemy,
        PFEnemies_PROJECTILEDAMAGE, PFEnemies_PROJECTTILEKNOCKBACKX,
        PFEnemies_PROJECTTILEKNOCKBACKY, PFEnemies_PROJECTTILESTUNDUR,
        type)
    });
  } else if (type === "weak") {
    PFSetUp_player.colliding(enemyWave, (player, enemy) => {
      PFEnemies_hit(player, enemy,
        PFEnemies_WEAKDAMAGE, PFEnemies_WEAKENEMYXKNOCKBACK,
        PFEnemies_WEAKENEMYYKNOCKBACK, PFEnemies_WEAKENEMYSTUNDUR,
        type)
    });
    PFSetUp_player.collides(enemyWave, (player, enemy) => {
      PFEnemies_hit(player, enemy,
        PFEnemies_WEAKDAMAGE, PFEnemies_WEAKENEMYXKNOCKBACK,
        PFEnemies_WEAKENEMYYKNOCKBACK, PFEnemies_WEAKENEMYSTUNDUR,
        type)
    });
  }
}

/*************************************************************/
//PFEnemies_swordHit()
//knocks back enemy when is hit
//called as call back by collides function
//input: sword, the specific enemy that was hit
/*************************************************************/
function PFEnemies_swordHit(sword, enemy) {
  //Only deals damage if player is actually swinging the sword
  if (PFSetUp_swordSwinging === false) { return; };

  //Can only stun enemy when they can be hit again (not in immune period)
  if (enemy.stunned === false && enemy.immune === false) {
    //Timeout function that enables the enemy to move again after a cold down
    enemy.stunned = true;

    setTimeout(function() {
      enemy.stunned = false;
    }, PFSetUp_SWORDSTUNDUR);

    //Determining which side the enemy was hit from, then sending the enemy in that direction
    let dx = enemy.x - PFSetUp_player.x;
    if (dx > 0) { enemy.vel.x = PFEnemies_WEAKENEMYXKNOCKBACK; }
    else { enemy.vel.x = -PFEnemies_WEAKENEMYXKNOCKBACK; };
    enemy.vel.y = PFSetUp_SWORDYKNOCKBACK;
  }

  if (enemy.immune === false) {
    enemy.onSurface = false;
    enemy.health -= PFSetUp_SWORDDAMAGE;
    enemy.color = PFEnemies_ENEMYHITCOLOR;

    //hit audio, is cloned to allow mutiple of the same audio to be played at the same time
    let hitClone = hit.cloneNode(true);
    hitClone.volume = 0.3;
    hitClone.play();

    console.log("PFEnemies_swordHit();");

    //Putting enemy on hit cold down
    enemy.immune = true;
  } else { return; };
  //Timeout function that enables the enemy to be hit again after a cold down
  setTimeout(function() {
    enemy.immune = false;
    enemy.color = PFEnemies_ENEMYCOLOR;
  }, PFEnemies_ENEMYIMMUNETIME);

  //Remove enemy if is dead
  if (enemy.health <= 0) {
    //Removing from the arrays
    if (enemy.type === "ranged") { PFEnemies_rangedEnemies.splice(PFEnemies_rangedEnemies.indexOf(enemy), 1); }
    else { PFEnemies_weakEnemies.splice(PFEnemies_weakEnemies.indexOf(enemy), 1); }
    PFWorld_gravityEffectedSprites.splice(PFWorld_gravityEffectedSprites.indexOf(enemy), 1);
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
//PFEnemies_move()
//Determines the movement of enemies
//called in draw()
//input: array of enemies, and the varaibles for the type of enemy.
/*************************************************************/
function PFEnemies_move(enemies, range, idleSpeed, idleTime, speed, jumpStrength, proximity) {
  for (i = 0; i < enemies.length; i++) {
    let enemy = enemies[i];
    let dx = enemy.x - PFSetUp_player.x;
    let dy = enemy.y - PFSetUp_player.y;

    //Kill enemy if they are too far away
    if (abs(dx) > 2.5 * PFWorld_terrainTriggerPoint) {
      //removing from arrays
      enemies.splice(enemies.indexOf(enemy), 1);
      PFWorld_gravityEffectedSprites.splice(PFWorld_gravityEffectedSprites.indexOf(enemy), 1);
      enemy.remove();
    }

    //Move around or idle if player is too far away.
    if (abs(dx) > range && enemy.idling === false) {
      //Determining random behaviour based off a random number
      let ranNum = Math.round(random(1, 4));
      if (ranNum === 2) {
        enemy.vel.x = idleSpeed;
      }
      else if (ranNum === 3) {
        enemy.vel.x = -idleSpeed;
      }

      //The enemy moves in a specific direction or stop for a while before switching behaviour
      enemy.idling = true;
      setTimeout(function() { enemy.idling = false }, idleTime);
      continue;
    };

    //If within detection range and idling, stop idling
    if (abs(dx) < range) {
      enemy.idling = false
    };

    //dont move towards player if idle, and make their colour orange
    if (enemy.idling === true) { enemy.color = PFEnemies_ENEMYIDLECOLOR; continue }
    else if (enemy.immune === false) { enemy.color = PFEnemies_ENEMYCOLOR };

    //If difference is positive (below the player), jump when it can.
    //Using half of players size so that enemies dont jump if they are too small (shorter than the player);
    if (dy > PFSetUp_PLAYERWIDTH && enemy.onSurface === true && enemy.stunned === false) {
      enemy.vel.y = jumpStrength;
      enemy.onSurface = false
    };

    //If the enemy is within proximity stop moving towards player, other wise keep moving towards player
    if (abs(dx) <= proximity && enemy.stunned === false) {
      enemy.vel.x = 0;
      //If enemy is ranged then use ranged attack when in proximity
      if (enemy.type === "ranged") { PFEnemies_rangedAttack(enemy, dx, dy); };
      continue;
    };
    //If difference is negative, player must be to the right. Else is to the left
    if (dx < 0 && enemy.stunned === false) { enemy.vel.x = speed }
    else if (enemy.stunned === false) { enemy.vel.x = -speed };
  }
}

/*************************************************************/
//PFEnemies_hit()
//Determines what happens when a srouce of damage hits the player
//called as a callback with weakEnemies and projectiles
//input: player, the source of damage that hits the player
//and the variables associsated with that source of damage.
/*************************************************************/
function PFEnemies_hit(player, source, damage, knockBackX, knockBackY, stunDur, type) {
//If projectile is too slow then don't do damage
 if (type === "ranged" && Math.abs(source.vel.x) < PFEnemies_PROJECTILEMINIMALSPEED) {return;}
  
  //Can only stun the player if they are not in immune period
  if (player.stunned === false && player.immune === false) {
    //Timeout function that enables the player to move again after a cold down
    player.stunned = true;
    setTimeout(function() {
      player.stunned = false;
      //Stopping the player from being knocked back after a colddown
      player.vel.x = 0;
    }, stunDur);
  }

  if (player.immune === false) {
    player.onSurface = false;
    player.color = PFSetUp_PLAYERHITCOLOR;
    player.health -= damage;
    console.log("Player has " + player.health + " hp left.")

    //player hit audio
    oof.currentTime = 0
    oof.play();

    if (type === "ranged") {
      source.hit = true;
      //Removing source from arrays
      PFWorld_gravityEffectedSprites.splice(PFWorld_gravityEffectedSprites.indexOf(source), 1);
      source.remove();
    }

    //Determining which side the player was hit from, then sending the player in that direction
    let dx = source.x - PFSetUp_player.x;
    if (dx > 0) { player.vel.x = -knockBackX; }
    else { player.vel.x = knockBackX; };
    player.vel.y = knockBackY;
    console.log("PFEnemies_hit();");

    //Putting player on hit cold down
    player.immune = true;

    //Timeout function that enables the player to be hit again after a cold down
    setTimeout(function() {
      player.immune = false;
      player.color = PFSetUp_PLAYERCOLOR;
    }, PFSetUp_PLAYERIMMUNEDUR);
  }
}

/*************************************************************/
//PFEnemies_rangedAttack()
//Enemies ranged attack function
//called by: PFEnemies_move();
//input: the ranged enemy, and the difference in distance between player and that enemy.
/*************************************************************/
function PFEnemies_rangedAttack(enemy, dx, dy) {
  //Can't use ranged attack if on colddown
  if (enemy.rangedColdDown === true) { return; };
  let projectile;
  let x;

  //Calculating what the y and x velocities will be
  let theta = Math.atan(abs(dy / dx));
  let yVel = PFEnemies_PROJECTILESPEED * Math.sin(theta);
  let xVel = PFEnemies_PROJECTILESPEED * Math.cos(theta);

  //If player to the right then projectile needs to go to the left
  if (dx > 0) {
    x = enemy.x - PFEnemies_PROJECTILEOFFSET;
    xVel = -xVel;
  }
  //If player to the left
  else { x = enemy.x + PFEnemies_PROJECTILEOFFSET; };

  //if player is above the enemy then projectile needs to go up
  if (dy > 0) { yVel = -yVel };

  projectile = new Sprite(x, enemy.y, PFEnemies_PROJECTILESIZE, PFEnemies_PROJECTILESIZE, "d");
  projectile.vel.x = xVel;
  projectile.vel.y = yVel;
  projectile.color = PFEnemies_PROJECTILECOLOR;
  projectile.hit = false;
  projectile.rotationSpeed = PFEnemies_PROJECTILEROTATIONSPEED;

  enemy.rangedColdDown = true;
  //Put enemy on range colddown
  setTimeout(_ => {
    enemy.rangedColdDown = false;
  }, PFEnemies_RANGEDATTACKINTERVAL);
  //Removing the projectile after a set time
  setTimeout(_ => {
    //Making sure that it dosent clear the projectile when it has already been cleared
    if (projectile.hit === true || PFSetUp_gameStarted === false) {return;}
    projectile.remove();
  }, PFEnemies_PROJECTILEDESPAWNTIME);

  //Adding to projectile group
  projectTileGroup.add(projectile);
  gameSprites.add(projectile);
  PFWorld_gravityEffectedSprites.push(projectile);
}
//
/**************************************************************************************************************/
// END OF ENEMY BEHAVIOUR SECTION OF THE CODE
/**************************************************************************************************************/
//