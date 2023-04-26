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
const PFEnemies_BOUNCINESS = 0;
const PFEnemies_ENEMYIMMUNETIME = 400;
const PFEnemies_SPAWNHEIGHT = 100;
var PFEnemies_weakEnemies = [];
var PFEnemies_rangedEnemies = [];

//Weak enemy variables
const PFEnemies_WEAKENEMYMAX = 1000;
const PFEnemies_WEAKENEMYLAYER = 2;
const PFEnemies_WEAKENEMYSIZE = 50;
const PFEnemies_WEAKENEMIESSPAWNTIME = 5000;
const PFEnemies_WEAKENEMYHEALTH = 2;
const PFEnemies_ENEMYHITCOLOR = "#ffb8d2";
const PFEnemies_ENEMYIDLECOLOR = "#ff7900";
const PFEnemies_ENEMYCOLOR = "#ff2675";
var PFEnemies_weakEnemyRange;

const PFEnemies_WEAKSPAWNAMOUNT = 4;
const PFEnemies_WEAKENEMYSPEED = 8;
const PFEnemies_WEAKIDLESPEED = 1;
const PFEnemies_WEAKIDLETIME = 3000;
const PFEnemies_WEAKENEMYJUMPSTRENGTH = -20;
const PFEnemies_WEAKENEMYXKNOCKBACK = 5;
const PFEnemies_WEAKENEMYYKNOCKBACK = -10;
const PFEnemies_WEAKENEMYSTUNDUR = 400;
const PFEnemies_WEAKPROXIMITY = 10;
const PFEnemies_WEAKDAMAGE = 1;

//Ranged enemy variables
const PFEnemies_RANGEDSPAWNAMOUNT = 2;
const PFEnemies_RANGEDENEMYMAX = 1000;
const PFEnemies_RANGEDENEMYSIZE = 50;
const PFEnemies_RANGEDENEMYHEALTH = 2;
const PFEnemies_RANGEDENEMYLAYER = 2;
const PFEnemies_RANGEDENEMYIDLESPEED = 2;
const PFEnemies_RANGEDIDLETIME = 3000;
const PFEnemies_RANGEDSPEED = 4;
const PFEnemies_RANGEDJUMPSTRENGTH = -15;
const PFEnemies_RANGEDPROXIMITY = 500;
const PFEnemies_RANGEDATTACKINTERVAL = 100;
var PFEnemies_rangedEnemyRange;

//Ranged enemy projectile variables
const PFEnemies_PROJECTILESIZE = 13;
const PFEnemies_PROJECTILECOLOR = "#ff2675";
const PFEnemies_PROJECTILEOFFSET = 25;
const PFEnemies_PROJECTILESPEED = 35;
const PFEnemies_PROJECTILEDESPAWNTIME = 700;
const PFEnemies_PROJECTTILEKNOCKBACKX = 2.5;
const PFEnemies_PROJECTTILEKNOCKBACKY = -2.5;
const PFEnemies_PROJECTILEDAMAGE = 0.1;
const PFEnemies_PROJECTTILESTUNDUR = 100;
const PFEnemies_PROJECTILEROTATIONSPEED = 200;
const PFEnemies_PROJECTILEDRAG = 0;
const PFEnemies_PROJECTILEBOUNCINESS = 0;
const PFEnemies_PROJECTILEYVELCORRECTION = -5;
const PFEnemies_PROJECTILEMINXVEL = 2;


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
      enemy = new Sprite(random(x, y), PFEnemies_SPAWNHEIGHT,
        size, size, "d");
    } else if (type === "ranged") {
      enemy = new Sprite(random(x, y), PFEnemies_SPAWNHEIGHT, size, size, "d");
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
  PFSetUp_sword.overlapping(enemyWave, (sword, enemy) => { PFEnemies_hit(enemy, sword, PFSetUp_SWORDDAMAGE, PFSetUp_SWORDXKNOCKBACK, PFSetUp_SWORDYKNOCKBACK, PFSetUp_SWORDSTUNDUR); });

  //Colliders
  if (type === "ranged") {
    PFSetUp_player.colliding(projectileGroup, (player, enemy) => {
      PFEnemies_hit(player, enemy,
        PFEnemies_PROJECTILEDAMAGE, PFEnemies_PROJECTTILEKNOCKBACKX,
        PFEnemies_PROJECTTILEKNOCKBACKY, PFEnemies_PROJECTTILESTUNDUR);
    });
    PFSetUp_player.collides(projectileGroup, (player, enemy) => {
      PFEnemies_hit(player, enemy,
        PFEnemies_PROJECTILEDAMAGE, PFEnemies_PROJECTTILEKNOCKBACKX,
        PFEnemies_PROJECTTILEKNOCKBACKY, PFEnemies_PROJECTTILESTUNDUR);
    });
  } else if (type === "weak") {
    PFSetUp_player.colliding(enemyWave, (player, enemy) => {
      PFEnemies_hit(player, enemy,
        PFEnemies_WEAKDAMAGE, PFEnemies_WEAKENEMYXKNOCKBACK,
        PFEnemies_WEAKENEMYYKNOCKBACK, PFEnemies_WEAKENEMYSTUNDUR);
    });
    PFSetUp_player.collides(enemyWave, (player, enemy) => {
      PFEnemies_hit(player, enemy,
        PFEnemies_WEAKDAMAGE, PFEnemies_WEAKENEMYXKNOCKBACK,
        PFEnemies_WEAKENEMYYKNOCKBACK, PFEnemies_WEAKENEMYSTUNDUR);
    });
  }
  //Spike collision
  enemyWave.collides(spikeGroup, (enemy, spike) => {
    PFEnemies_hit(enemy, spike,
      PFWorld_SPIKEDAMAGE, PFWorld_SPIKEXKNOCKBACK,
      PFWorld_SPIKEYKNOCKBACK, PFWorld_SPIKESTUNDUR);
  });
  enemyWave.colliding(spikeGroup, (enemy, spike) => {
    PFEnemies_hit(enemy, spike,
      PFWorld_SPIKEDAMAGE, PFWorld_SPIKEXKNOCKBACK,
      PFWorld_SPIKEYKNOCKBACK, PFWorld_SPIKESTUNDUR);
  });
}

/*************************************************************/
//PFEnemies_setImmune()
//Sets a specific target back to the false immune state after being hit, and remove them if they are dead.
//called by PFEnemies_hit function after a target has been hit and a timeout.
//input: the target that was hit, its original colour and any array that it was in.
/*************************************************************/
function PFEnemies_setImmune(target, color, array) {
  target.immune = false;
  target.color = color;

  //Remove target if is dead
  if (target.health <= 0 && PFSetUp_gameStarted === true) {
    //Removing from the arrays
    if (array !== undefined) { console.log("yes"); array.splice(array.indexOf(target), 1); }
    //Removing from gravity effected sprites
    PFWorld_gravityEffectedSprites.splice(PFWorld_gravityEffectedSprites.indexOf(target), 1);
    //Removing the sprite
    target.remove();
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

    //Kill enemy if they are too far away or if they are dead
    if (abs(dx) > 1.3 * PFWorld_TRIGGERDISTANCE) {
      //removing from arrays
      enemies.splice(enemies.indexOf(enemy), 1);
      PFWorld_gravityEffectedSprites.splice(PFWorld_gravityEffectedSprites.indexOf(enemy), 1);
      enemy.remove();
    }

    //Move around or idle if player is too far away.
    if (abs(dx) > range && enemy.idling === false) {
      enemy.vel.x = 0;
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

    //move around randomly if idle, and make their colour orange
    if (enemy.idling === true) { enemy.color = PFEnemies_ENEMYIDLECOLOR; continue; }
    else if (enemy.immune === false) { enemy.color = PFEnemies_ENEMYCOLOR };

    //If difference is positive (below the player), jump when it can.
    //Using half of players size so that enemies dont jump if they are too small (shorter than the player);
    if (dy > PFSetUp_PLAYERWIDTH && enemy.onSurface === true && enemy.stunned === false) {
      enemy.vel.y = jumpStrength;
      enemy.onSurface = false
    };

    //move towards the player if in range
    if (dx < 0 && enemy.stunned === false) { enemy.vel.x = speed }
    else if (enemy.stunned === false) { enemy.vel.x = -speed };

    //If the enemy is within proximity stop moving towards player, other wise keep moving towards player
    if (abs(dx) <= proximity && enemy.stunned === false) {
      enemy.vel.x = 0;
      //If enemy is ranged then use ranged attack when in proximity
      if (enemy.type === "ranged" && PFEnemies_rangedEnemies.includes(enemy) === true) { PFEnemies_rangedAttack(enemy, dx, dy); };
      continue;
    };
  }
}

/*************************************************************/
//PFEnemies_hit()
//Determines what happens when a source of damage hits a target, either player or enemy
//called as a callback with weakEnemies and projectiles
//input: target, the source of damage that hits the target
//and the variables associsated with that source of damage.
/*************************************************************/
function PFEnemies_hit(target, source, damage, knockBackX, knockBackY, stunDur) {

  //Special exception if the source is a sword
  if (source.type === "sword") {
    //If sword is not swinging then cant deal damage
    if (PFSetUp_swordSwinging === false) { return; }
    //If sword is used to hit a projectile then remove the projectile
    else if (target.type === "projectile") { target.hit = true; target.remove(); return; }
  }

  //Can only stun the target if they are not in immune period
  if (target.stunned === false && target.immune === false) {

    //Ranged attack cant do damage if too slow
    if (source.type === "projectile" && Math.abs(source.vel.x) < PFEnemies_PROJECTILEMINXVEL) { return; }

    //Timeout function that enables the target to move again after a cold down
    target.stunned = true;
    setTimeout(function() {
      target.stunned = false;
      //Stopping the target from being knocked back after a colddown
      target.vel.x = 0;
    }, stunDur);
  }

  if (target.immune === false) {
    target.onSurface = false;
    //Depending on the type of target change their color differently
    if (target.type !== PFSetUp_player.type) {
      target.color = PFEnemies_ENEMYHITCOLOR;
    } else { target.color = PFSetUp_PLAYERHITCOLOR; console.log("Player has " + target.health + " hp left.") }

    //Taking away whatever amount of damage that source deals
    target.health -= damage;

    //target hit audio
    if (target.type !== PFSetUp_player.type) {
      //hit audio is cloned to allow mutiple of the same audio to be played at the same time
      let hitClone = hit.cloneNode(true);
      hitClone.volume = 0.3;
      hitClone.play();
    } else {
      oof.currentTime = 0
      oof.play();
    }

    if (source.type === "projectile") {
      source.hit = true;
      //Removing source from arrays
      PFWorld_gravityEffectedSprites.splice(PFWorld_gravityEffectedSprites.indexOf(source), 1);
      source.remove();
    }

    //Determining which side the target was hit from, then sending the target in that direction
    let dx = source.x - PFSetUp_player.x;
    if (dx > 0) { target.vel.x = -knockBackX; }
    else { target.vel.x = knockBackX; };
    target.vel.y = knockBackY;
    console.log("PFEnemies_hit();");

    //Putting target on hit cold down
    target.immune = true;

    //Timeout function that enables the target to be hit again after a cold down
    setTimeout(function() {
      //Depending on the type of target change their color differently
      if (target.type === "ranged") {
        PFEnemies_setImmune(target, PFEnemies_ENEMYCOLOR, PFEnemies_rangedEnemies);
      }
      else if (target.type === "weak") { PFEnemies_setImmune(target, PFEnemies_ENEMYCOLOR, PFEnemies_weakEnemies); }
      else {
        PFEnemies_setImmune(target, PFSetUp_PLAYERCOLOR);
      }
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
  //Can't use ranged attack if on colddown or enemy is dead/cleared
  if (enemy.rangedColdDown === true || PFEnemies_rangedEnemies.includes(enemy) !== true) { return; };
  let projectile;
  let projectileWave = new Group();
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
  //Makes the projectile fire up sligthly if there is a small difference to counteract gravity
  if (dy < PFSetUp_PLAYERWIDTH / 2 && dy > -PFSetUp_PLAYERWIDTH / 2) { yVel = PFEnemies_PROJECTILEYVELCORRECTION };

  projectile = new Sprite(x, enemy.y, PFEnemies_PROJECTILESIZE, PFEnemies_PROJECTILESIZE, "d");
  projectile.vel.x = xVel;
  projectile.vel.y = yVel;
  projectile.color = PFEnemies_PROJECTILECOLOR;
  projectile.hit = false;
  projectile.rotationSpeed = PFEnemies_PROJECTILEROTATIONSPEED;
  projectile.drag = PFEnemies_PROJECTILEDRAG;
  projectile.bounciness = PFEnemies_PROJECTILEBOUNCINESS;
  projectile.type = "projectile";

  enemy.rangedColdDown = true;
  //Put enemy on range colddown
  setTimeout(_ => {
    enemy.rangedColdDown = false;
  }, PFEnemies_RANGEDATTACKINTERVAL);
  //Removing the projectile after a set time
  setTimeout(_ => {
    //Making sure that it dosent clear the projectile when it has already been cleared
    if (projectile.hit !== false || PFSetUp_gameStarted === false) { return; }
    projectile.remove();
  }, PFEnemies_PROJECTILEDESPAWNTIME);

  //Adding to projectile group
  projectileGroup.add(projectile);
  gameSprites.add(projectile);
  PFWorld_gravityEffectedSprites.push(projectile);
  projectileWave.add(projectile);

  //Setting colliders
  PFSetUp_sword.overlapping(projectileWave, _ => { PFEnemies_hit(projectile, PFSetUp_sword, PFSetUp_SWORDDAMAGE, PFSetUp_SWORDXKNOCKBACK, PFSetUp_SWORDYKNOCKBACK, PFSetUp_SWORDSTUNDUR); })
  PFSetUp_sword.overlaps(projectileWave, _ => { PFEnemies_hit(projectile, PFSetUp_sword, PFSetUp_SWORDDAMAGE, PFSetUp_SWORDXKNOCKBACK, PFSetUp_SWORDYKNOCKBACK, PFSetUp_SWORDSTUNDUR); })
}
//
/**************************************************************************************************************/
// END OF ENEMY BEHAVIOUR SECTION OF THE CODE
/**************************************************************************************************************/
//