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
const PFEnemies_ENEMYSIZE = 50;
const PFEnemies_FRICTION = 0;
const PFEnemies_HITCOLDDOWN = 300;
const PFEnemies_proxmity = 70;

//Weak enemy variables
const PFEnemies_WEAKENEMYHEALTH = 2;
const PFEnemies_TOTALWENEMIES = 2;
const PFEnemies_ENEMIESARRAY = [];
const PFEnemies_WEAKENEMYSPEED = 5;
const PFEnemies_WEAKENEMYJUMPSTRENGTH = -16;
const PFEnemies_WEAKENEMYXKNOCKBACK = 10;
const PFEnemies_WEAKENEMYYKNOCKBACK = -10;
const PFEnemies_WEAKENEMYBOUNCE = 0;

//
/**************************************************************************************************************/
// V ENEMY SETUP SECTION OF THE CODE V
/**************************************************************************************************************/
//

/*************************************************************/
//PFEnemies_spawnEnemies()
//Spawns enemies
//called by: setup()
/*************************************************************/
function PFEnemies_spawnEnemies() {
  console.log("PFEnemies_spawnEnemies();");

  //Spawning weak enemies
  for (i = 0; i < PFEnemies_TOTALWENEMIES; i++) {
    enemy = new Sprite(random(PFSetUp_WALLTHICKNESS, width), random(PFSetUp_WALLTHICKNESS, height),
      PFEnemies_ENEMYSIZE, PFEnemies_ENEMYSIZE, "d");
    //setting properties of enemies
    enemy.friction = PFEnemies_FRICTION;
    enemy.health = PFEnemies_WEAKENEMYHEALTH;
    enemy.rotationLock = true;
    enemy.onSurface = false;
    enemy.onColdDown = false;
    enemy.bounciness = PFEnemies_WEAKENEMYBOUNCE;

    //Adding to array of enemies
    PFEnemies_ENEMIESARRAY.push(enemy);

    //Adding to groups
    weakEnemies.add(enemy);
    gravityEffectedSprites.add(enemy);
    PFWorld_GRAVITYEFFECTEDSPRITES.push(enemy)
  }
}

/*************************************************************/
//PFEnemies_hit()
//knocks back enemy when is hit
//called as call back by collides function
//input: param1, the specific enemy that was hit
/*************************************************************/
function PFEnemies_hit(param1, enemy) {
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
  }, PFEnemies_HITCOLDDOWN);


  if (enemy.health === 0) {
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
  for (i = 0; i < PFEnemies_ENEMIESARRAY.length; i++) {
    let weakEnemy = PFEnemies_ENEMIESARRAY[i];
    let dx = weakEnemy.x - PFSetUp_player.x;
    let dy = weakEnemy.y - PFSetUp_player.y;

    //If difference is positive (below the player), jump when it can.
    //Using one because of very small decimal differences causing the enemy to jump
    if (dy > 1 && weakEnemy.onSurface === true) {
      weakEnemy.vel.y = PFEnemies_WEAKENEMYJUMPSTRENGTH;
      weakEnemy.onSurface = false;
    };

    //If the enemy is within proximity stop moving towards player
    if (abs(dx) <= PFEnemies_proxmity) { weakEnemy.vel.x = 0; continue;};
    //If difference is negative, player must be to the right. Else is to the left
    if (dx < 0) { weakEnemy.vel.x = PFEnemies_WEAKENEMYSPEED }
    else { weakEnemy.vel.x = -PFEnemies_WEAKENEMYSPEED };
  }
}

/*************************************************************/
//PFEnemies_WEHit()
//WE stands for weak enemies
//Determines what happens when a weak enemy hits the player
//called as a callback when enemy collide with player;
//param1, and the player that collides
/*************************************************************/
function PFEnemies_WEHit(param1, enemy) {
  if (PFSetUp_player.stunned === false) {
    //Timeout function that enables the player to move again after a cold down
    PFSetUp_player.stunned = true;
    setTimeout(function() {
      PFSetUp_player.stunned = false;
    }, 1000);
  }

  if (PFSetUp_player.onColdDown === false) {
    PFSetUp_player.onSurface = false;
    PFSetUp_player.health -= 1;

    //Determining which side the player was hit from, then sending the player in that direction
    let dx = enemy.x - PFSetUp_player.x;
    if (dx > 0) { PFSetUp_player.vel.x = -PFEnemies_WEAKENEMYXKNOCKBACK;}
    else { PFSetUp_player.vel.x = PFEnemies_WEAKENEMYXKNOCKBACK; };
    PFSetUp_player.vel.y = PFEnemies_WEAKENEMYYKNOCKBACK;
    console.log("PFEnemies_WEhit();");

    //Putting player on hit cold down
    PFSetUp_player.onColdDown = true;

    //Timeout function that enables the player to be hit again after a cold down
    setTimeout(function() {
      PFSetUp_player.onColdDown = false;
    }, PFEnemies_HITCOLDDOWN);
  }
}

//
/**************************************************************************************************************/
// END OF ENEMY BEHAVIOUR SECTION OF THE CODE
/**************************************************************************************************************/
//