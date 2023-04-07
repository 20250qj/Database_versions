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
const PFEnemies_TOTALWENEMIES = 20;
const PFEnemies_ENEMYSIZE = 50;
const PFEnemies_friction = 10;
const PFEnemies_pushBack = 4;
const PFEnemies_hitColdDown = 200;

//Weak enemy variables
const PFEnemies_WEAKENEMYHEALTH = 2;

/*************************************************************/
//PFEnemies_spawnEnemies()
//Spawns enemies
//called by: setup()
/*************************************************************/
function PFEnemies_spawnEnemies() {
  console.log("PFEnemies_spawnEnemies();");

  //Spawning weak enemies
  for (i=0; i < PFEnemies_TOTALWENEMIES; i++) {
    enemy = new Sprite(random(PFSetUp_WALLTHICKNESS, width), random(PFSetUp_WALLTHICKNESS, height), 
                       PFEnemies_ENEMYSIZE, PFEnemies_ENEMYSIZE, "d");
    //setting properties of enemies
    enemy.friction = PFEnemies_friction;
    enemy.health = PFEnemies_WEAKENEMYHEALTH;
    enemy.rotationLock = true;
    enemy.onFloor = false;
    
    //Adding to groups
    weakEnemies.add(enemy);
    gravityEffectedSprites.add(enemy);
    PFWorld_gravityEffectedSprites.push(enemy)
  }
}

/*************************************************************/
//PFEnemies_hit()
//knocks back enemy when is hit
//called as call back by collides function
//input: param1, the specific enemy that was hit
/*************************************************************/
function PFEnemies_hit(param1, enemy) {
  console.log("PFEnemies_hit();");
  //time out function so that theres a hit colddown
  setTimeout(function() {
    enemy.vel.x = PFEnemies_pushBack;
    enemy.onFloor = false;
    enemy.health -= 1;
  
    if (enemy.health === 0) {
      enemy.remove();
    }
  }, PFEnemies_hitColdDown);
}
