/*******************************************************/
// Flappy bird
// Written by: Martin jin
// Started on: 14/2/23
// Finished on: 15/2/23
// V.1.1.0

// Description: Not the classic flappy bird if you die
// when you touch the pipe, but instead when the bird is bounced
// off the screen, everything else is standard.
/*******************************************************/
MODULENAME = "game_flappy.js";
console.log('%c' + MODULENAME + ': ', 'color: blue;');

/*******************************************************/
// Constants and variables
/*******************************************************/
//pipe properties
const flappy_PIPEWIDTH = 30;
const flappy_PIPEGAP = 150;
const flappy_PIPEINTERVAL = 3000;
const flappy_PIPESPEED = -4;
const flappy_PIPEDISTANCE = 200;
const flappy_PIPEBOUNCINESS = 4;

var flappy_pipeSpawn;

//Bird properties
const flappy_BIRDSIZE = 40;
const flappy_FLIGHTSTRENGTH = -16;
const flappy_BIRDSIZERATIO = 3;
const flappy_BIRDGRAVITY = 0.5;
const flappy_FLIGHTCONSTANT = 0.7;
const flappy_DEADROTATIONSPEED = 3;

var flappy_birdDied = false;

//Wall properties
const flappy_WALLHEIGHT = 8;

//World properties
const flappy_GRAVITYCONSTANT = -0.65;

//Game properties
const flappy_DEATHZONE = -100;

var flappy_score;
var flappy_ready = false;

//Controls
const flappy_JUMPKEY = "KeyW";
const flappy_KEYDISPLAY = "W";

/*************************************************************/
//preload()
//Preloads the images.
//Called when page is loaded.
/*************************************************************/
function preload() {
  console.log("preload();");

  bird = loadImage('/game_assets/flappy_bird.png');
  hidden = loadImage('/game_assets/transparent.png');
}

/*************************************************************/
//flappy_createSprites()
//Sets up loucation of sprites.
//called by: setup()
/*************************************************************/
function flappy_createSprites() {
  //Sprites
  flappy_bird = new Sprite(width / 3, height / 2, flappy_BIRDSIZE + flappy_BIRDSIZE / flappy_BIRDSIZERATIO, flappy_BIRDSIZE, "d");
  flappy_bird.addImage(bird);
  bird.resize(flappy_BIRDSIZE + flappy_BIRDSIZE / flappy_BIRDSIZERATIO, flappy_BIRDSIZE);

  //Walls
  wall_bottom = new Sprite(width / 2, height + flappy_WALLHEIGHT, width, flappy_WALLHEIGHT, "k");
  wall_bottom.addImage(hidden);
  hidden.resize(width, flappy_WALLHEIGHT);

  wall_top = new Sprite(width / 2, 0, width, flappy_WALLHEIGHT, "k");
  wall_top.addImage(hidden);
  hidden.resize(width, flappy_WALLHEIGHT);
}

/*************************************************************/
//flappy_startGame()
//Starts the program.
//called by: Play button on html_flappy.html.
/*************************************************************/
function flappy_startGame() {
  console.log("flappy_startGame();");

  var x = document.getElementById("start_button");
  x.style.display = "none";

  x = document.getElementById("header");
  x.style.display = "none";

  //Displaying the controls
  document.getElementById("confirm").innerHTML = "Press " + flappy_KEYDISPLAY + " to begin.";

  //flappy_confirming start by pressing w
  flappy_confirm();
  setup();
}

/*************************************************************/
//flappy_confirm()
//flappy_confirms the start of a game, requires user to press W.
//called by: flappy_startGame()
/*************************************************************/
function flappy_confirm() {
  console.log("flappy_confirm();");

  //Hiding and showing html elements
  var x = document.getElementById("confirm");
  x.style.display = "block";
  x = document.getElementById("score");
  x.style.display = "none";

  document.addEventListener("keyup", function(event) {
    if (event.code === flappy_JUMPKEY && flappy_ready === false) {
      //Stopping the flappy_ready function from being false when the game started, and allowing
      //the setup and draw function to be called.
      flappy_ready = true;

      //Creating the sprites
      flappy_createSprites();

      //Hiding and displaying texts
      x = document.getElementById("confirm");
      x.style.display = "none";
      x = document.getElementById("score");
      x.style.display = "block";

      //Allowing users to continue with their last score from database
      x = document.getElementById("score");
      flappy_score = fbV_flappyHighScore.score;
      x.innerHTML = flappy_score;

      //Starting the game by calling the setup function.
      setup();
      console.log("Game started;");
    }
  });
}

/*************************************************************/
//setup()
//Sets up movement and creates sprites.
//called by: flappy_confirm()
/*************************************************************/
function setup() {
  console.log("setup();");

  //Creating canvas and groups
  cnv = new Canvas(windowWidth, windowHeight);
  pipeGroup = new Group();
  colliderGroup = new Group();

  if (flappy_ready === true) {
    console.log("player ready");

    //Detecting collision
    flappy_bird.collides(colliderGroup, flappy_addScore);
    flappy_bird.collides(pipeGroup, flappy_killBird);

    //Movement
    document.addEventListener("keyup", function(event) {
      if (event.code === flappy_JUMPKEY && flappy_birdDied === false) {
        flappy_bird.vel.y += flappy_FLIGHTSTRENGTH;

        //Limits the maximum y velocity of the bird.
        if (flappy_bird.vel.y < flappy_FLIGHTCONSTANT * flappy_FLIGHTSTRENGTH) {
          flappy_bird.vel.y = flappy_FLIGHTCONSTANT * flappy_FLIGHTSTRENGTH;
        }
      }
    });

    //Spawning in the pipes
    flappy_intervalPipes(flappy_PIPEINTERVAL);
  }
}

/*************************************************************/
//draw()
//Refreshes the background 60/s.
//called when player is ready.
/*************************************************************/
function draw() {
  if (flappy_ready === true) {
    background("#62daff");

    //Limiting the effects of gravity (terminal velocity);
    if (flappy_bird.velocity.y < flappy_GRAVITYCONSTANT * flappy_FLIGHTSTRENGTH) {
      flappy_bird.velocity.y += flappy_BIRDGRAVITY;
    }

    if (flappy_bird.x < flappy_DEATHZONE || flappy_bird.x > width - flappy_DEATHZONE) {
      flappy_ready = false;
      flappy_restart();
    }
  }
}

/*************************************************************/
//flappy_createPipes()
//Spawns in pipes.
//called by flappy_intervalPipes()
/*************************************************************/
function flappy_createPipes() {
  console.log("flappy_createPipes();")

  //The height of the pipe below is calculated so that there is always enough height for
  //pipe gap, and so the pipes will never get negative height.
  var pipe_below_height = height - random(flappy_PIPEGAP, height - flappy_PIPEGAP);
  var pipe_above_height = height - pipe_below_height;

  pipe_below_height = pipe_below_height - flappy_PIPEGAP;
  pipe_above_height = pipe_above_height - flappy_PIPEGAP;

  //Coordinates of the pipes being calculated.
  var pipeBelowYPos = height - pipe_below_height / 2;
  var pipeAboveYPos = pipe_above_height / 2;

  //Creating the pipes with the previous values.
  pipe_below = new Sprite(width + flappy_PIPEDISTANCE, pipeBelowYPos, flappy_PIPEWIDTH, pipe_below_height, "k");
  pipe_below.vel.x = flappy_PIPESPEED;
  pipe_below.shapeColor = color("#29ff00");
  pipe_below.bounciness = flappy_PIPEBOUNCINESS;

  pipe_above = new Sprite(width + flappy_PIPEDISTANCE, pipeAboveYPos, flappy_PIPEWIDTH, pipe_above_height, "k");
  pipe_above.vel.x = flappy_PIPESPEED;
  pipe_above.shapeColor = color("#29ff00");
  pipe_above.bounciness = flappy_PIPEBOUNCINESS;

  //Calculating the y position of the collider (middle of the space between the pipes).
  var colliderYPos = ((pipeBelowYPos - pipe_below_height / 2) + (pipeAboveYPos + pipe_above_height / 2)) / 2;

  //Calulcating the height of collider.
  var colliderHeight = height - pipe_above_height - pipe_below_height;

  //Creating the collider with the previous values.
  collider = new Sprite(width + flappy_PIPEDISTANCE, colliderYPos, flappy_PIPEWIDTH, colliderHeight, "k");
  collider.vel.x = flappy_PIPESPEED;

  //Making the collider transparent by using a transparent image.
  collider.addImage(hidden);
  hidden.resize(flappy_PIPEWIDTH, colliderHeight);

  //Adding the sprites to their respective groups.
  pipeGroup.add(pipe_below);
  pipeGroup.add(pipe_above);
  colliderGroup.add(collider);
}

/*************************************************************/
//flappy_intervalPipes(interval)
//Creates pipes at set intervals.
//called by setup()
//input: interval
/*************************************************************/
function flappy_intervalPipes(interval) {
  console.log("flappy_intervalPipes();");

  //Creating pipes at the set intervals.
  flappy_pipeSpawn = setInterval(flappy_createPipes, interval);
}

/*************************************************************/
//flappy_addScore()
//Giving the player score.
//called by the callback function upon collision.
//input: param1, the collider that has collided with the bird.
/*************************************************************/
function flappy_addScore(flappy_bird, collider) {
  console.log("flappy_addScore();");

  //Removes the collider once collided
  collider.remove();

  //Prevents bird from bouncing off due to physics
  flappy_bird.vel.x = 0;
  flappy_bird.x += 1;

  //Adding the score
  flappy_score += 1;

  //Writing to data base
  fbV_flappyHighScore.score = flappy_score;

  console.log(fbV_flappyHighScore);
  fb_writeRec(fbV_FLAPPYSCOREPATH, fbV_userDetails.uid, fbV_flappyHighScore, fbR_procWriteError);

  //Saving values to session storage
  manager_saveValues();

  console.log("score: " + flappy_score);
  document.getElementById("score").innerHTML = flappy_score;
}


/*************************************************************/
//flappy_killBird()
//Stops the bird from flying when user hits the pipe
//called by callback function upon collision with pipe.
/*************************************************************/
function flappy_killBird() {
  console.log("Bird died.")
  flappy_birdDied = true;
  flappy_bird.rotationSpeed = flappy_DEADROTATIONSPEED;
}

/*************************************************************/
//flappy_restart()
//restarts the game
//called by draw() if player dies;
/*************************************************************/
function flappy_restart() {
  console.log("flappy_restart();");

  //Writing to data base
  fbV_flappyHighScore.score = flappy_score;
  fb_writeRec(fbV_DETAILS, fbV_userDetails.uid, fbV_userDetails, fbR_procWriteError);

  //Saving values to session storage
  manager_saveValues();

  //Checking high score
  flappy_checkHighScore(fbV_FLAPPYSCOREPATH, fbV_flappyHighScore.uid, fbV_flappyHighScore, fbR_procUserHighScore, flappy_score);

  //Reseting variables
  flappy_ready = false;
  flappy_birdDied = false;
  flappy_bird.rotationSpeed = 0;
  document.getElementById("score").innerHTML = flappy_score;

  //Removing sprites
  flappy_bird.remove();
  pipeGroup.remove();
  colliderGroup.remove();

  //Stopping pipes spawning
  clearInterval(flappy_pipeSpawn);

  //Restarting
  flappy_confirm();
}

/*************************************************************/
//flappy_checkHighScore()
//checks if current score is high score
//called by flappy_restart()
//input: _path and _key to check, loucation to save data,
//       _procFunc to process the read data, score to check.
/*************************************************************/
function flappy_checkHighScore(_path, _key, _save, _procFunc, score) {
  console.log("flappy_checkHighScore();");
  //Reading user highscore
  fb_readRec(_path, _key, _save, _procFunc);

  //Updating high score
  if (score > _save.highScore) {
    _save.highScore = score;
    fb_writeRec(_path, _save.uid, _save, fbR_procWriteError);

    //Saving values to session storage
    manager_saveValues();

    console.log("High score is: " + _save.highScore);
  }

  //Resetting here to make sure score is only reset after high score was checked.
  flappy_score = 0;
  fbV_flappyHighScore.score = flappy_score;
  fb_writeRec(_path, _key, _save, fbR_procWriteError);

  //Saving values to session storage
  manager_saveValues();
}

/*******************************************************/
//  END OF APP
/*******************************************************/