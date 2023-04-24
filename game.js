// Logic of the Spaceships Game
var canvas; // the canvas
var context; // used for drawing on the canvas
var isGameRunning;

// constants for game play
var NUMBER_OF_ENEMIES_IN_ROW = 5;
var NUMBER_OF_ENEMIES_IN_COLUMN = 4;
var NUMBER_OF_ENEMIES = NUMBER_OF_ENEMIES_IN_ROW * NUMBER_OF_ENEMIES_IN_COLUMN;
var ENEMIES_SCORES_BY_ROW = new Array(5, 10, 15, 20);
var TIME_INTERVAL = 1; // screen refresh interval in milliseconds
var ENEMIES_ACCELERATION_UNITS = 5;
var NUMBER_OF_ENEMIES_ACCELERATIONS = 4;
var ENEMIES_ACCELERATION_TIMER = 5;
var TIME_FOR_A_GAME;

// variables for the game loop and tracking statistics
var intervalTimer; // holds interval timer
var timeLeft; // the amount of time left in seconds
var timeElapsed; // the number of seconds elapsed
var then;

var canvasWidth; // width of the canvas
var canvasHeight; // height of the canvas
var infoBarHeight;

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
var enemiesAccelerationsCounter;
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
var pastEnemyFire;
var enemyFireVelocity; // spaceshipFire's velocity
var enemyFireOnScreen; // is the spaceshipFire on the screen
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
var lastEnemyFireInterval;
var livesImages;
var flatEggImage;
var blackHoleImage;

var lifeImageHeight;
var lifeImageWidth;
// variables for sounds
var themeSound;
var shootSound;
var hitSound;

var enemyVelocity; // pixels per second
var speedIncreaseInterval; // milliseconds
var lastSpeedIncreaseTime;
var speedIncreaseCounter;
var acceleration;


var isFiring;
var firstTime;

const gameResultEnum = {
    CHAMPION: 0,
    WINNER: 1,
    DO_BETTER: 2,
    LOST: 3
  };

const gameResult = [
    {text: "Champion!",
     image: "./images/game/champion.png",
     sound: document.getElementById( "champion" )
    },
    {text: "Winner!",
    image: "./images/game/winner.png"
   },
   {text: "You can do better...",
   image: "./images/game/doBetter.png"
  },
  {text: "You Lost!",
  image: "./images/game/loser.png",
  sound: document.getElementById( "loser" )
 }
]

var stopButtons;

// called when the app first launches
function setupGame() {
    // stop timer if document unload event occurs
   document.addEventListener( "unload", stopTimer, false );
   // get the canvas, its context and setup its click event handler
   canvas = document.getElementById( "theCanvas" );
   context = canvas.getContext("2d");
   canvas.width = window.innerWidth ;
   canvas.height = window.innerHeight - 100;

    scoresData = new Array(20, 15, 10, 5);

   	// Images
	bgImage = new Image();
	bgImage.src = "./images/game/space-background4.jpg";
	
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

    flatEggImage = new Image();
    flatEggImage.src = "./images/game/flatEgg.png";

    // get sounds
    themeSound = document.getElementById( "themeSound" );
    shootSound = document.getElementById( "shootSound" );
    hitSound = document.getElementById( "hitSound" );

    // Handle keyboard controls
	keysDown = {};

	// Check for keys pressed where key represents the keycode captured
	addEventListener("keydown", function (e) {keysDown[e.keyCode] = true;}, false);
	addEventListener("keyup", function (e) {delete keysDown[e.keyCode];}, false);
    // Select all buttons with the class "stop-button"
    
    stopButtons = document.querySelectorAll('.stop-button');
    console.log(stopButtons);
    // Loop through each button and attach the event listener
    stopButtons.forEach(button => {
    button.addEventListener('click', stopGameLoop);
    });
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

function resetSpaceshipPosition(){
    spaceship.x = 32 + (Math.random() * (canvas.width - 64));
	spaceship.y = canvas.height - spaceshipHeight;
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

    resetSpaceshipPosition();
    spaceship.speed = 300;
    spaceshipFireWidth = 20;
    spaceshipFireHeight = 40;
    spaceshipFireSpeed = w * 3 / 2; // spaceshipFire speed multiplier

    enemyImageWidth = w * 0.3 * 0.13;
    enemyImageHeight = h * 0.4 * 0.2;
    
    enemyFireSpeed =  1000;
    enemyFireWidth = 20;
    enemyFireHeight = 30;

    infoBarHeight = 50;
    lifeImageWidth = 25;
    lifeImageHeight = 25;

    enemyVelocity = 50; // pixels per second
    speedIncreaseInterval = 5000; // milliseconds
    acceleration = 1.2;
    enemiesAccelerationsCounter = 0

    for (var i = 0; i < NUMBER_OF_ENEMIES_IN_COLUMN; i++) {
        for (var j = 0; j < NUMBER_OF_ENEMIES_IN_ROW; j++) {
            enemies[i][j].x = j * enemyImageWidth;
            enemies[i][j].y = i * enemyImageHeight + infoBarHeight;
        }
      }
    initialEnemyVelocity = -w / 4; // initial target speed multiplier

}

// reset all the screen elements and start a new game
function newGame() {
    isGameRunning = true;
    spaceship = new Object();
    spaceshipFire = new Array();
 
    hitStates = new Array(NUMBER_OF_ENEMIES_IN_COLUMN);
    enemies = new Array(NUMBER_OF_ENEMIES_IN_COLUMN);
    enemyFire = new Array();
    pastEnemyFire = new Array();
 
    for (var i = 0; i < NUMBER_OF_ENEMIES_IN_COLUMN; i++) {
     enemies[i] = new Array(NUMBER_OF_ENEMIES_IN_ROW);
     for (var j = 0; j < NUMBER_OF_ENEMIES_IN_ROW; j++) {
         enemies[i][j] = new Object();
         }
     }
     livesImages = new Array(3);
     for (var i = 0; i < 3; i++){
         livesImages[i] = new Image();
         livesImages[i].src = "./images/game/fullHeart.png";
     }
    resetElements(); // reinitialize all game elements
    // stopTimer(); // terminate previous interval timer

    // set every element of hitStates to false--restores target pieces
    for (var i = 0; i < NUMBER_OF_ENEMIES_IN_COLUMN; i++) {
        hitStates[i] = new Array(NUMBER_OF_ENEMIES_IN_ROW);
        for (var j = 0; j < NUMBER_OF_ENEMIES_IN_ROW; j++) {
            hitStates[i][j] = false;
        }
    }
    // Add an event listener for the keydown event
    document.addEventListener("keydown", onKeyDownShoot);
    document.addEventListener("keyup", onKeyUpShoot);
    enemyVelocity = initialEnemyVelocity; // set initial velocity
    numberOfDeadEnemies = 0; // no enemies have been hit
    timeLeft = TIME_FOR_A_GAME; // start the countdown at TIME_FOR_A_GAME seconds
    timeElapsed = 0; // set the time elapsed to zero
    timeLeft = TIME_FOR_A_GAME; // start the countdown at 2 minutes
    timerCount = 0; // the timer has fired 0 times so far
    spaceshipFireOnScreen = false;
    enemyFireOnScreen = true;
    speedIncreaseCounter = 0;
    score = 0;
    firstTime = true;
    numberOfPsilot = 0;
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

    updateAndCheckSpaceshipFireCollisons();

    // enemies shootings
    var interval = TIME_INTERVAL / 1000.0;
        
    for (var i = 0; i < enemyFire.length; i++){
        enemyFire[i].y += interval * enemyFireSpeed;
    }
    
    if (enemyFire.length == 0 || enemyFire[enemyFire.length - 1].y + enemyFireHeight  >= canvasHeight * 0.75)
    {
        fireEnemyShot();
    } 
    checkEnemyFireCollisons();


    // increase enemey's speed
    if (speedIncreaseCounter < 4){
        // Calculate time since last speed increase
        var currentTime = Date.now();
        var timeSinceLastSpeedIncrease = currentTime - lastSpeedIncreaseTime;
        
        // Check if it's time to increase the speed
        if (timeSinceLastSpeedIncrease >= speedIncreaseInterval) {
            // Increase the enemy velocity and reset the timer
            enemyVelocity *= acceleration; // increase speed by 20%
            enemyFireSpeed *= acceleration;
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
   if (enemies[0][0].x < 0 || enemies[NUMBER_OF_ENEMIES_IN_COLUMN - 1][NUMBER_OF_ENEMIES_IN_ROW - 1].x > canvasWidth - enemyImageWidth)
      enemyVelocity *= -1;
}

function fireSpaceshipShot(event) {
    var bullet = {
        x: spaceship.x + (spaceshipWidth / 2) - (spaceshipFireWidth / 2),
        y: spaceship.y,
      };
            spaceshipFire.push(bullet);
    shootSound.play();
}

function fireEnemyShot(event) {
    var randomRowIndex = Math.floor(Math.random() * NUMBER_OF_ENEMIES_IN_COLUMN);
    var randomColumnIndex = Math.floor(Math.random() * NUMBER_OF_ENEMIES_IN_ROW);

    if (hitStates[randomRowIndex][randomColumnIndex]){
        return;
    }
    var x = enemies[randomRowIndex][randomColumnIndex].x + (enemyImageWidth / 2) - (enemyFireWidth / 2);
    var y = enemies[randomRowIndex][randomColumnIndex].y;
    let newEnemy = {x: x, y: y}
    enemyFire.push(newEnemy);
    
    lastEnemyShoot = newEnemy;
    lastEnemyFireInterval = Date.now();
}

function updateAndCheckSpaceshipFireCollisons(){
    for (var k = 0; k < spaceshipFire.length; k++)  // if there is currently a shot fired
    {
       // update spaceshipFire position
       var interval = TIME_INTERVAL / 1000.0;
       spaceshipFire[k].y -= interval * spaceshipFireSpeed;
       if (spaceshipFire[k].y - spaceshipFireHeight < 0)
       {
           spaceshipFire.splice(k, 1);
           k--;
           continue;
       } 
       // check for spaceshipFire collision with target
       else{
           for (var i = 0; i < NUMBER_OF_ENEMIES_IN_COLUMN; i++) {
               for (var j = 0; j < NUMBER_OF_ENEMIES_IN_ROW; j++) {
                   if (hitStates[i][j]){
                       continue;
                   }
                   if ((spaceshipFire[k].y >= enemies[i][j].y && spaceshipFire[k].y <= (enemies[i][j].y + enemyImageHeight)) &&
                       (((spaceshipFire[k].x + spaceshipFireWidth) <= (enemies[i][j].x + enemyImageWidth) && (spaceshipFire[k].x + spaceshipFireWidth) >= enemies[i][j].x) ||
                       (spaceshipFire[k].x >= enemies[i][j].x && spaceshipFire[k].x <= (enemies[i][j].x + enemyImageWidth))))
                   {

                       hitStates[i][j] = true;
                       spaceshipFire.splice(k, 1);
                       k--;
                       score += scoresData[i];
                       if (++numberOfDeadEnemies == NUMBER_OF_ENEMIES){
                               gameOver(gameResultEnum.CHAMPION);
                           } 
                        return;
                   }
               }
           }
       }   
    } 
}

function checkEnemyFireCollisons(){
    for (var i = 0; i < enemyFire.length; i++){

        if (enemyFire[i].y + enemyFireHeight  >= canvasHeight)
        {
            context.drawImage(flatEggImage, enemyFire[i].x, enemyFire[i].y - 50, 50 ,50);
            enemyFire.splice(i, 1);
            i--;
        } 
        else{
            if ((enemyFire[i].x >= spaceship.x && enemyFire[i].x <= spaceship.x + spaceshipWidth) &&
                    ((enemyFire[i].y + enemyFireHeight  >= spaceship.y) &&
                    (enemyFire[i].y + enemyFireHeight  <= spaceship.y + spaceshipHeight)))
                {
                    spaceshipGotHit();
                    enemyFire.splice(i, 1);
                    i--;
                } 
        }
    }
}


function spaceshipGotHit(){
    if (numberOfPsilot < 2){
        hitSound.play();
        livesImages[numberOfPsilot].src = "./images/game/emptyHeart.png";
        numberOfPsilot ++;
        resetSpaceshipPosition();
    }
    else{
        gameOver(gameResultEnum.LOST)
    }
}

// draws the game elements to the given Canvas
function draw() {
    context.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    context.drawImage(spaceshipImage, spaceship.x, spaceship.y, spaceshipWidth, spaceshipHeight);

    for (var i = 0; i < spaceshipFire.length; i++){
      context.drawImage(spaceshipFireImage, spaceshipFire[i].x, spaceshipFire[i].y, spaceshipFireWidth, spaceshipFireHeight);
   }

    for (var i = 0; i < enemyFire.length; i++){
        context.drawImage(enemyFireImage, enemyFire[i].x, enemyFire[i].y, enemyFireWidth, enemyFireHeight);
    }

   for (var i = 0; i < NUMBER_OF_ENEMIES_IN_COLUMN; i++) {
        for (var j = 0; j < NUMBER_OF_ENEMIES_IN_ROW; j++) {
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

    // draw info bar
    for (var i = 0; i < livesImages.length; i++){
        context.drawImage(livesImages[i], i * lifeImageWidth, 5, lifeImageWidth, lifeImageHeight);
    }

    context.font = "24px Open Sans";
    context.fillStyle = "white";
    context.fillText(score, 4 * lifeImageWidth , 25);
    context.fillText("Time remaining: " + timeLeft, 4 * lifeImageWidth + 40, 25);
}

// The main game loop
function main() {
    if (!isGameRunning) {
        return;
    }
    var now = Date.now();
	var delta = now - then;
    lastEnemyFireInterval = Date.now();
    updateTime();
	updatePositions(delta / 1000);
	draw();	

	then = now;
};

function updateTime(){
    ++timerCount; // increment the timer event counter

    // if one second has passed
    if (TIME_INTERVAL * timerCount >= 250)
    {
       --timeLeft; // decrement the timer
       ++timeElapsed; // increment the time elapsed
       timerCount = 0; // reset the count
    } 

   // if the timer reached zero
   if (timeLeft <= 0)
   {
        if (score < 100){
            gameOver(gameResultEnum.DO_BETTER)
        }
        else{
            gameOver(gameResultEnum.WINNER)
        }
   } 
}
// window.addEventListener("load", setupGame, false);

  
function submitConfigurations(){
    let key = document.forms["configurationForm"]["key"].value;
    let timeDuration = document.forms["configurationForm"]["time"].value;
    let weapon = document.forms["configurationForm"]["weapon"].value;
    
    if (key == "" || timeDuration == "" || weapon == "") {
        alert("All fields must be filled out");
        return false;
    }

    if (key >= 37 && key <=40) {
        alert("Choose key from the english letters or space!");
        return false;
    }

    if (timeDuration < 120) {
        alert("Duration must be above 120 sconds!");
        return false;
    }
    setupGame();
    spaceshipFireKey = shootKey;
    TIME_FOR_A_GAME = timeDuration;
    spaceshipFireImage.src = "./images/game/spaceshipFire" + weapon + ".png"
    startGame();
}

function startGame(){
    showScreen("game-screen");
    newGame();
}

function gameOver(gameResultNumber){
    stopGameLoop();
    showScreen("end-screen")
    document.getElementById("end-text").innerHTML = gameResult[gameResultNumber].text;
    var img = document.getElementById("end-img");
    img.src = gameResult[gameResultNumber].image;
    insertToRecordsTable();
}

function insertToRecordsTable(){
    let recordTableJson = localStorage.getItem("recordTable");
    let recordTable = JSON.parse(recordTableJson);
    if (recordTable === null || recordTable.username != loggedUser.username){
        recordTable = {username: loggedUser.username, scores: [score]}
    }
    else{
        recordTable.scores.push(score)
        recordTable.scores.sort(function(a, b){return b-a});
    }

    let newRecordTableJson = JSON.stringify(recordTable);

    // Save the JSON string to local storage
    localStorage.setItem("recordTable", newRecordTableJson);

    // Get the <ul> element from the HTML document
    const scoresList = document.getElementById('scores-list');
    
    // Create a new <li> element for each score and append it to the <ul> element
    while (scoresList.firstChild) {
        scoresList.removeChild(scoresList.firstChild);
    }

    let isMarked = false;
    recordTable.scores.forEach(s => {
        const li = document.createElement('li');
        li.textContent = ` ${s}`;
        li.classList.add('font');
        if (s == score && !isMarked) {
            li.classList.add('bold');
            isMarked = true;
          }
        scoresList.appendChild(li);
    });
}
// Function to stop the game loop
function stopGameLoop() {
    document.removeEventListener("keydown", onKeyDownShoot);
    document.removeEventListener("keyup", onKeyUpShoot);
    themeSound.pause();
    themeSound.currentTime = 0;
    themeSound.load();
    stopTimer();
}

function stopAndStartGame(){
    stopGameLoop();
    newGame();
}


function onKeyDownShoot(event) {
    // Check if the fire key is pressed
    if (event.keyCode == spaceshipFireKey) {
      // If the fire key is not already pressed, fire a new bullet and set the flag to true
      if (!isFiring) {
        fireSpaceshipShot();
        isFiring = true;
      }
    }
  }
  
  function onKeyUpShoot(event) {
    // Check if the fire key is released
    if (event.keyCode == spaceshipFireKey) {
      // Reset the flag to false
      isFiring = false;
    }
  }
  