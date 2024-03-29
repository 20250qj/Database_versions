/*******************************************************/
// Unamed platformer game
// Written by: Martin jin
// Started on: 28/3/23
// V.1.0

// Description: module containing camera code
/*******************************************************/
MODULENAME = "platformer_PFCamera.js";
console.log('%c' + MODULENAME + ': ', 'color: blue;');

/*******************************************************/
// Constants and variables
/*******************************************************/

//
/**************************************************************************************************************/
// V CAMERA SECTION OF THE CODE V
/**************************************************************************************************************/
//

/*************************************************************/
//PFCamera_checkLock()
//checks if the camera should be locked
//called by: draw()
/*************************************************************/
function PFCamera_checkLock() {
  //camera cannot go any further back then 1.5 trigger points
  //camera also will lock untill player leaves spawning area
  if (PFSetUp_player.x > PFWorld_terrainTriggerPoint - (1.5 * PFWorld_TRIGGERDISTANCE)
    && PFSetUp_player.x > width / 3) {
    camera.x = PFSetUp_player.x + width / 6;
  }
  else if
    //If camera is locked, player cant go outside the visble camera region
    (PFSetUp_player.x <= (PFWorld_terrainTriggerPoint - 1.5 * PFWorld_TRIGGERDISTANCE - width / 3)) {
    PFSetUp_player.x = (PFWorld_terrainTriggerPoint - 1.5 * PFWorld_TRIGGERDISTANCE - width / 3);
  }
}

//
/**************************************************************************************************************/
// END OF CAMERA SECTION OF THE CODE
/**************************************************************************************************************/
//