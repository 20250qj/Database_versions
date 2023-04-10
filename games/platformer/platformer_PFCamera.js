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
  if (PFSetUp_player.x > width/2) {
    camera.x = PFSetUp_player.x;
  }
}

//
/**************************************************************************************************************/
// END OF CAMERA SECTION OF THE CODE
/**************************************************************************************************************/
//