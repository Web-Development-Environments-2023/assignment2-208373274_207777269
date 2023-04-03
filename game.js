// Logic of the Spaceships Game
var canvas; // the canvas
var context; // used for drawing on the canvas

// constants for game play
var NUMBER_OF_ENEMIES_IN_ROW = 5;
var NUMBER_OF_ENEMIES_IN_COLUMN = 4;
var NUMBER_OF_ENEMIES = NUMBER_OF_ENEMIES_IN_ROW * NUMBER_OF_ENEMIES_IN_COLUMN;
var ENEMIES_SCORES_BY_ROW = new Array(5, 10, 15, 20);
var TIME_INTERVAL = 25; // screen refresh interval in milliseconds
var ENEMIES_ACCELERATION_UNITS = 5;
var NUMBER_OF_ENEMIES_ACCELERATIONS = 4;
var ENEMIES_ACCELERATION_TIMER = 5;
var TIME_FOR_A_GAME = 60;

// variables for the game loop and tracking statistics
var intervalTimer; // holds interval timer
var timeLeft; // the amount of time left in seconds
var timeElapsed; // the number of seconds elapsed

// variables for the Spaceship and the shootings
var score;
var numberOfPsilot;

// variables for the enemies and their shootings
var enemiesSpeed;
var enemiesAccelerationsCounter = 0;
var enemiesState;
var numberOfDeadEnemies;


// variables for sounds
var gameBackgroundSound;
var spaceshipFireSound;
var psilaSound;
var hittingEnemySound;

// called when the app first launches
function setupGame() {

}

// set up interval timer to update game
function startTimer() {
    intervalTimer = window.setInterval(updatePositions, TIME_INTERVAL);
}

// terminate interval timer
function stopTimer() {
    window.clearInterval(intervalTimer);
}

// called by function newGame to scale the size of the game elements
// relative to the size of the canvas before the game begins
function resetElements() {

}

// reset all the screen elements and start a new game
function newGame() {
    resetElements(); // reinitialize all game elements
    stopTimer(); // terminate previous interval timer

    // set every element of hitStates to false--restores target pieces
    for (var i = 0; i < NUMBER_OF_ENEMIES_IN_COLUMN; ++i) {
        for (var j = 0; j < NUMBER_OF_ENEMIES_IN_ROW; ++j)
            enemiesState[i][j] = false; // enemy not destroyed yet
    }

    hitStates[i] = false; // target piece not destroyed

    numberOfDeadEnemies = 0; // no enemies have been hit
    timeLeft = TIME_FOR_A_GAME; // start the countdown at TIME_FOR_A_GAME seconds
    timeElapsed = 0; // set the time elapsed to zero
    startTimer(); // starts the game loop
}

// called every TIME_INTERVAL milliseconds
function updatePositions() {


    draw(); // draw all elements at updated positions

    // if the timer reached zero
    if (timeLeft <= 0)
    {
       stopTimer();
       showGameOverDialog("You lost"); // show the losing dialog
    }
}

// fires a Spaceship shot
function fireSpaceshipShot(event) {


    // play cannon fired sound
    spaceshipFireSound.play();
}

// draws the game elements to the given Canvas
function draw() {

}

// display an alert when the game ends
function showGameOverDialog(message)
{
   alert(message + "\nShots fired: " + shotsFired + 
      "\nTotal time: " + timeElapsed + " seconds ");
}

window.addEventListener("load", setupGame, false);