// Logic of the Spaceships Game
var canvas; // the canvas
var context; // used for drawing on the canvas

// constants for game play
var NUMBER_OF_ENEMIES_IN_ROW = 5;
var NUMBER_OF_ENEMIES_IN_COLUMN = 4;
var NUMBER_OF_ENEMIES = NUMBER_OF_ENEMIES_IN_ROW * NUMBER_OF_ENEMIES_IN_COLUMN;
var ENEMIES_SCORES_BY_ROW = new Array(5, 10, 15, 20);
var TIME_INTERVAL = 1; // screen refresh interval in milliseconds
var ENEMIES_ACCELERATION_UNITS = 5;
var NUMBER_OF_ENEMIES_ACCELERATIONS = 4;
var ENEMIES_ACCELERATION_TIMER = 5;
var TIME_FOR_A_GAME = 60;

// variables for the game loop and tracking statistics
var intervalTimer; // holds interval timer
var timeLeft; // the amount of time left in seconds
var timeElapsed; // the number of seconds elapsed
var then;

// variables for the Spaceship and the shootings
var spaceship;
var score;
var numberOfPsilot;
var keysDown;

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

// variables for images
var bgImage;
var spaceshipImage;


// called when the app first launches
function setupGame() {
    // stop timer if document unload event occurs
   document.addEventListener( "unload", stopTimer, false );
   document.getElementById( "startButton" ).addEventListener( 
    "click", newGame, false );
   // get the canvas, its context and setup its click event handler
   canvas = document.getElementById( "theCanvas" );
   ctx = canvas.getContext("2d");

   spaceship = new Object();
   hitStates = new Array(NUMBER_OF_ENEMIES);

   	// Background image

	bgImage = new Image();
	bgImage.src = "./images/game/space-background.jpg";
	
	
	// Spaceship image
	
	spaceshipImage = new Image();
	spaceshipImage.src = "./images/game/player.png";

    // Handle keyboard controls
	keysDown = {};

  
	// Check for keys pressed where key represents the keycode captured
	addEventListener("keydown", function (e) {keysDown[e.keyCode] = true;}, false);

	addEventListener("keyup", function (e) {delete keysDown[e.keyCode];}, false);
}

// set up interval timer to update game
function startTimer() {
    then = Date.now();
    intervalTimer = window.setInterval(main, TIME_INTERVAL);
}

// terminate interval timer
function stopTimer() {
    window.clearInterval(intervalTimer);
}

// called by function newGame to scale the size of the game elements
// relative to the size of the canvas before the game begins
function resetElements() {
	// Reset player's position to centre of canvas
	spaceship.x = 32 + (Math.random() * (canvas.width - 64));
	spaceship.y = canvas.height - 30;
    spaceship.speed = 256;
}

// reset all the screen elements and start a new game
function newGame() {
    resetElements(); // reinitialize all game elements
    // stopTimer(); // terminate previous interval timer

    // set every element of hitStates to false--restores target pieces
    // for (var i = 0; i < NUMBER_OF_ENEMIES_IN_COLUMN; ++i) {
    //     for (var j = 0; j < NUMBER_OF_ENEMIES_IN_ROW; ++j)
    //         enemiesState[i][j] = false; // enemy not destroyed yet
    // }

    // hitStates[i] = false; // target piece not destroyed

    numberOfDeadEnemies = 0; // no enemies have been hit
    timeLeft = TIME_FOR_A_GAME; // start the countdown at TIME_FOR_A_GAME seconds
    timeElapsed = 0; // set the time elapsed to zero
    startTimer(); // starts the game loop
}

// called every TIME_INTERVAL milliseconds
function updatePositions(modifier) {
	if ((38 in keysDown) ) { // Player holding up	
        if (spaceship.y > canvas.height * 0.6)	{
            spaceship.y -= spaceship.speed * modifier;
        }
	}
	if ((40 in keysDown) ) { // Player holding down	
		spaceship.y += spaceship.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		spaceship.x -= spaceship.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right	
		spaceship.x += spaceship.speed * modifier;	
	}
}

// fires a Spaceship shot
function fireSpaceshipShot(event) {


    // play cannon fired sound
    spaceshipFireSound.play();
}

// draws the game elements to the given Canvas
function draw() {
    // canvas.width = canvas.width; // clears the canvas (from W3C docs)
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceship.x, spaceship.y, 40, 40);

}

// display an alert when the game ends
function showGameOverDialog(message)
{
   alert(message + "\nShots fired: " + shotsFired + 
      "\nTotal time: " + timeElapsed + " seconds ");
}


// The main game loop
function main() {
    var now = Date.now();
	var delta = now - then;
	
	updatePositions(delta / 1000);
	draw();	

	then = now;
};
window.addEventListener("load", setupGame, false);
