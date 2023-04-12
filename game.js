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

var canvasWidth; // width of the canvas
var canvasHeight; // height of the canvas

// variables for the Spaceship and the shootings
var spaceship;
var score;
var numberOfPsilot;
var keysDown;
var spaceshipFireKey;
var scoresData;
var spaceshipWidth;
var spaceshipHeight;

// variables for the enemies and their shootings
var enemies;
var enemiesSpeed;
var enemiesAccelerationsCounter = 0;
var enemiesState;
var numberOfDeadEnemies;
var enemyImageWidth;
var enemyImageHeight;
var initialEnemyVelocity;
var enemyVelocity;

// variables for the spaceship fire
var spaceshipFire; // spaceshipFire image's upper-left corner
var spaceshipFireVelocity; // spaceshipFire's velocity
var spaceshipFireOnScreen; // is the spaceshipFire on the screen
var spaceshipFireWidth; // spaceshipFire radius
var spaceshipFireHeight; // spaceshipFire radius
var spaceshipFireSpeed; // spaceshipFire speed

// variables for the enemy's fire
var enemyFire; // spaceshipFire image's upper-left corner
var enemyFireVelocity; // spaceshipFire's velocity
var senemyFireOnScreen; // is the spaceshipFire on the screen
var enemyFireWidth; // spaceshipFire radius
var enemyFireHeight; // spaceshipFire radius
var enemyFireSpeed; // spaceshipFire speed

// variables for sounds
var gameBackgroundSound;
var spaceshipFireSound;
var psilaSound;
var hittingEnemySound;

// variables for images
var bgImage;
var spaceshipImage;
var spaceshipFireImage;
var enemiesImages;
var enemyFireImage;

// variables for sounds
var themeSound;
var shootSound;
var hitSound;

var enemyVelocity = 50; // pixels per second
var speedIncreaseInterval = 5000; // milliseconds
var lastSpeedIncreaseTime;
var speedIncreaseCounter;
var acceleration = 1.2;

// called when the app first launches
function setupGame() {
    // stop timer if document unload event occurs
   document.addEventListener( "unload", stopTimer, false );
   document.getElementById( "startButton" ).addEventListener( 
    "click", newGame, false );
   // get the canvas, its context and setup its click event handler
   canvas = document.getElementById( "theCanvas" );
   context = canvas.getContext("2d");

   spaceship = new Object();
   spaceshipFire = new Object();

   hitStates = new Array(NUMBER_OF_ENEMIES_IN_COLUMN);
   enemies = new Array(NUMBER_OF_ENEMIES_IN_COLUMN);
   enemyFire = new Array(NUMBER_OF_ENEMIES_IN_COLUMN);
   for (var i = 0; i < NUMBER_OF_ENEMIES_IN_COLUMN; i++) {
    enemies[i] = new Array(NUMBER_OF_ENEMIES_IN_ROW);
    for (var j = 0; j < NUMBER_OF_ENEMIES_IN_ROW; j++) {
        enemies[i][j] = new Object();
        enemyFire[i][j] = new Object();
        }
    }
    
    scoresData = new Array(20, 15, 10, 5);

   	// Images
	bgImage = new Image();
	bgImage.src = "./images/game/space-background2.jpg";
	
	spaceshipImage = new Image();
	spaceshipImage.src = "./images/game/player.png";

    spaceshipFireImage = new Image();
	spaceshipFireImage.src = "./images/game/spaceshipFire3.png";

    enemyFireImage = new Image();
    enemyFireImage.src = "./images/game/enemyFire.png";

    enemiesImages = new Array(NUMBER_OF_ENEMIES_IN_COLUMN);
    for (var i = 1; i <= NUMBER_OF_ENEMIES_IN_COLUMN; i++){
     enemiesImages[i] = new Image();
     enemiesImages[i].src = "./images/game/enemy" + i + ".png";
    }
    
    // get sounds
   themeSound = document.getElementById( "themeSound" );
   shootSound = document.getElementById( "shootSound" );
    //    hitSound = document.getElementById( "blockerSound" );

    // Handle keyboard controls
    spaceshipFireKey = 32;
	keysDown = {};

	// Check for keys pressed where key represents the keycode captured
	addEventListener("keydown", function (e) {keysDown[e.keyCode] = true;}, false);
	addEventListener("keyup", function (e) {delete keysDown[e.keyCode];}, false);
}

// set up interval timer to update game
function startTimer() {
    then = Date.now();
    lastSpeedIncreaseTime = Date.now();
    intervalTimer = window.setInterval(main, TIME_INTERVAL);
}

// terminate interval timer
function stopTimer() {
    window.clearInterval(intervalTimer);
}

// called by function newGame to scale the size of the game elements
// relative to the size of the canvas before the game begins
function resetElements() {
    var w = canvas.width;
    var h = canvas.height;
    canvasWidth = w; // store the width
    canvasHeight = h; // store the height
	// Reset player's position to centre of canvas
    spaceshipWidth = 100;
    spaceshipHeight = 100;

	spaceship.x = 32 + (Math.random() * (canvas.width - 64));
	spaceship.y = canvas.height - spaceshipHeight;
    spaceship.speed = 300;
    spaceshipFireWidth = 20;
    spaceshipFireHeight = 50;
    spaceshipFireSpeed = w * 3 / 2; // spaceshipFire speed multiplier

    enemyImageWidth = 80;
    enemyImageHeight = 80;

    for (var i = 0; i < NUMBER_OF_ENEMIES_IN_COLUMN; i++) {
        for (var j = 0; j < NUMBER_OF_ENEMIES_IN_ROW; j++) {
            // console.log(enemiesImages[i]);
            enemies[i][j].x = j * enemyImageWidth
            enemies[i][j].y = i * enemyImageHeight
        }
      }
    initialEnemyVelocity = -w / 4; // initial target speed multiplier

}

// reset all the screen elements and start a new game
function newGame() {
    resetElements(); // reinitialize all game elements
    // stopTimer(); // terminate previous interval timer

    // set every element of hitStates to false--restores target pieces
    for (var i = 0; i < NUMBER_OF_ENEMIES_IN_COLUMN; i++) {
        hitStates[i] = new Array(NUMBER_OF_ENEMIES_IN_ROW);
        for (var j = 0; j < NUMBER_OF_ENEMIES_IN_ROW; j++) {
            hitStates[i][j] = false;
        }
    }
    enemyVelocity = initialEnemyVelocity; // set initial velocity
    numberOfDeadEnemies = 0; // no enemies have been hit
    timeLeft = TIME_FOR_A_GAME; // start the countdown at TIME_FOR_A_GAME seconds
    timeElapsed = 0; // set the time elapsed to zero
    spaceshipFireOnScreen = false;
    speedIncreaseCounter = 0;
    themeSound.play();
    startTimer(); // starts the game loop
}

// called every TIME_INTERVAL milliseconds
function updatePositions(modifier) {

    // move spaceship using keyboard
	if ((38 in keysDown) && spaceship.y > canvas.height * 0.6) { // Player holding up	
        spaceship.y -= spaceship.speed * modifier;
	}
	if ((40 in keysDown && spaceship.y <= canvas.height - spaceshipHeight) ) { // Player holding down	
        if (spaceship.y <= canvas.height){
            spaceship.y += spaceship.speed * modifier;
        }
	}
	if (37 in keysDown && spaceship.x > 0) { // Player holding left
        spaceship.x -= spaceship.speed * modifier;
	}
	if (39 in keysDown && spaceship.x < canvas.width - spaceshipWidth) { // Player holding right	
		spaceship.x += spaceship.speed * modifier;	
	}

    // shoot spaceship fire
    if (spaceshipFireKey in keysDown) { // Player holding right	
		fireSpaceshipShot();
	}

    // update the spaceship fire position
    if (spaceshipFireOnScreen) // if there is currently a shot fired
    {
       // update spaceshipFire position
       var interval = TIME_INTERVAL / 1000.0;
 
       spaceshipFire.y -= interval * spaceshipFireSpeed;

       // check for collision with upper wall
        if (spaceshipFire.y - spaceshipFireHeight < 0)
        {
            spaceshipFireOnScreen = false; // make the spaceshipFire disappear
        } 

        // check for spaceshipFire collision with target
        else{
            for (var i = 0; i < NUMBER_OF_ENEMIES_IN_COLUMN; i++) {
                for (var j = 0; j < NUMBER_OF_ENEMIES_IN_ROW; j++) {
                    if (hitStates[i][j]){
                        continue;
                    }
                    if ((spaceshipFire.y >= enemies[i][j].y && spaceshipFire.y <= (enemies[i][j].y + enemyImageHeight)) &&
                        (((spaceshipFire.x + spaceshipFireWidth) <= (enemies[i][j].x + enemyImageWidth) && (spaceshipFire.x + spaceshipFireWidth) >= enemies[i][j].x) ||
                        (spaceshipFire.x >= enemies[i][j].x && spaceshipFire.x <= (enemies[i][j].x + enemyImageWidth))))
                    {
                        hitStates[i][j] = true;
                        spaceshipFireOnScreen = false;
                        score += scoresData[i];
                    }

              }
            }
        }   

        //     // if all pieces have been hit
        //     if (++targetPiecesHit == TARGET_PIECES)
        //     {
        //         stopTimer(); // game over so stop the interval timer
        //         draw(); // draw the game pieces one final time
        //         showGameOverDialog("You Won!"); // show winning dialog
        //     } // end if
        //     } // end if
        // } // end else if
    }

    // increase enemey's speed
    if (speedIncreaseCounter < 4){
        // Calculate time since last speed increase
        var currentTime = Date.now();
        var timeSinceLastSpeedIncrease = currentTime - lastSpeedIncreaseTime;
        
        // Check if it's time to increase the speed
        if (timeSinceLastSpeedIncrease >= speedIncreaseInterval) {
            // Increase the enemy velocity and reset the timer
            enemyVelocity *= acceleration; // increase speed by 20%
            lastSpeedIncreaseTime = currentTime;
            speedIncreaseCounter ++;
        }
    }
        
    // update the enemies position
    var enemyUpdate = 2 / 1000.0 * enemyVelocity;
    for (var i = 0; i < NUMBER_OF_ENEMIES_IN_COLUMN; i++) {
        for (var j = 0; j < NUMBER_OF_ENEMIES_IN_ROW; j++) {
            enemies[i][j].x += enemyUpdate;
        }
    }

   // if the target hit the top or bottom, reverse direction
   if (enemies[0][0].x < 0 || enemies[NUMBER_OF_ENEMIES_IN_COLUMN - 1][NUMBER_OF_ENEMIES_IN_ROW - 1].x > canvasWidth - 300)
      enemyVelocity *= -1;

}

// fires a Spaceship shot
function fireSpaceshipShot(event) {
    if (spaceshipFireOnScreen) // if a spaceshipFire is already on the screen
      return; // do nothing
      spaceshipFire.x = spaceship.x + (spaceshipWidth / 2) - (spaceshipFireWidth / 2); // align x-coordinate with cannon
      spaceshipFire.y = spaceship.y; // centers ball vertically

    spaceshipFireOnScreen = true; // the spaceshipFire is on the screen

    // play cannon fired sound
    shootSound.play();
}

function fireEnemyShot(event) {
    if (spaceshipFireOnScreen) // if a spaceshipFire is already on the screen
      return; // do nothing
      spaceshipFire.x = spaceship.x+5; // align x-coordinate with cannon
      spaceshipFire.y = spaceship.y; // centers ball vertically

    spaceshipFireOnScreen = true; // the spaceshipFire is on the screen

    // play cannon fired sound
    // spaceshipFireSound.play();
}

// draws the game elements to the given Canvas
function draw() {
    // canvas.width = canvas.width; // clears the canvas (from W3C docs)
    context.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    context.drawImage(spaceshipImage, spaceship.x, spaceship.y, spaceshipWidth, spaceshipHeight);

    // if a spaceshipFire is currently on the screen, draw it
   if (spaceshipFireOnScreen)
   { 
      context.drawImage(spaceshipFireImage, spaceshipFire.x, spaceshipFire.y, spaceshipFireWidth, spaceshipFireHeight);

   } // end if

   // draw enemies
   for (var i = 0; i < NUMBER_OF_ENEMIES_IN_COLUMN; i++) {
    for (var j = 0; j < NUMBER_OF_ENEMIES_IN_ROW; j++) {
        // console.log(enemiesImages[i]);
        if (!hitStates[i][j]){
            context.drawImage(
                enemiesImages[i+1],
                enemies[i][j].x,
                enemies[i][j].y,
                enemyImageWidth,
                enemyImageHeight
              );
        }
    }
  }
}

// display an alert when the game ends
function showGameOverDialog(message)
{
   alert(message + "\nShots fired: " + shotsFired + 
      "\nTotal time: " + timeElapsed + " seconds ");
}

function updateVelocity() {
    var counter = 0;
    var maxIterations = 4;
    
    var intervalId = setInterval(function() {
      counter++;
      
      // Update the variable
      enemyVelocity *= 0.5;
      
      // Check if we've reached the maximum number of iterations
      if (counter >= maxIterations) {
        clearInterval(intervalId);
      }
    }, 5000); // Run every 5 seconds
  }

// The main game loop
function main() {
    var now = Date.now();
	var delta = now - then;
	updatePositions(delta / 1000);
	// updateVelocity();
	draw();	

	then = now;
};
window.addEventListener("load", setupGame, false);
