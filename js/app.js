//Enemy constants
const ENEMY_MIN_X_POSITION = -100;
const ENEMY_MIN_Y_POSITION = 65;
const ENEMY_MAX_LAPS = 5;
const ENEMY_MAX_LANES = 3;
const ENEMY_MIN_SPEED = 25;
const ENEMY_MAX_SPEED = 250;
const ENEMY_HITBOX_WIDTH = 65;

//Canvas constants
const CANVAS_X_MAX = 505;
const CANVAS_Y_MAX = 606;
const CANVAS_X_BOUNDARY_MIN = 0;
const CANVAS_Y_BOUNDARY_MIN = -15;
const CANVAS_X_BOUNDARY_MAX = 404;
const CANVAS_Y_BOUNDARY_MAX = 400;
const CANVAS_Y_STEP = 83;
const CANVAS_X_STEP = 101;

//Player constants
const PLAYER_START_X_POSITION = 202;
const PLAYER_START_Y_POSITION = 397;
const PLAYER_HITBOX_WIDTH = 65;

// Enemies our player must avoid
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.x = ENEMY_MIN_X_POSITION;
    this.randomizeSpeedAndPosition();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x = this.x + (dt * this.speed);
    if (this.x > CANVAS_X_MAX) {
      this.x = ENEMY_MIN_X_POSITION;
      this.laps++;
    }
    if (this.laps > ENEMY_MAX_LAPS) {
      this.randomizeSpeedAndPosition();
    }
    this.checkForPlayerCollision();
    this.render();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Assigns a random speed and position to the enemies
Enemy.prototype.randomizeSpeedAndPosition = function() {
    this.y = ENEMY_MIN_Y_POSITION + Math.floor(Math.random() * ENEMY_MAX_LANES) * CANVAS_Y_STEP;
    this.speed = Math.floor((Math.random() * ENEMY_MAX_SPEED) + ENEMY_MIN_SPEED);
    this.laps = 0;
}

//Checks to see if there is a collision with the player object
Enemy.prototype.checkForPlayerCollision = function() {
    if (this.x < player.x + PLAYER_HITBOX_WIDTH && this.x + ENEMY_HITBOX_WIDTH > player.x && this.y === player.y) {
      console.log("COLLISION DETECTED!!!");
      player.collisionDetected = true;
    }
}

//The player must avoid enemies and reach the water to achieve victory
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = PLAYER_START_X_POSITION;
    this.y = PLAYER_START_Y_POSITION;
    this.collisionDetected = false;
    this.score = 0;
    //this.updateScore();
};

// Update the player, check victory condition
Player.prototype.update = function() {
  this.checkForVictoryCondition();
  this.render();
  this.checkForEnemyCollision();
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Determine the position of the player based on keyboard input from the user
Player.prototype.handleInput = function(keyCode) {
    switch(keyCode) {
      case 'left':
        this.x = this.x - CANVAS_X_STEP;
        break;
      case 'up':
        this.y = this.y - CANVAS_Y_STEP;
        break;
      case 'right':
        this.x = this.x + CANVAS_X_STEP;
        break;
      case 'down':
        this.y = this.y + CANVAS_Y_STEP;
        break;
      }

    //Make sure the player does not go out of bounds
    switch(true) {
      case (this.x < CANVAS_X_BOUNDARY_MIN):
        this.x = CANVAS_X_BOUNDARY_MIN;
        break;
      case (this.x > CANVAS_X_BOUNDARY_MAX):
        this.x = CANVAS_X_BOUNDARY_MAX;
        break;
    }
    switch(true) {
      case (this.y < CANVAS_Y_BOUNDARY_MIN):
        this.y = CANVAS_Y_BOUNDARY_MIN;
        break;
      case (this.y > CANVAS_Y_BOUNDARY_MAX):
        this.y = CANVAS_Y_BOUNDARY_MAX;
        break;
    }
};

//Check to see if the player has met the victory conditions
Player.prototype.checkForVictoryCondition = function() {
    if (this.y <= CANVAS_Y_BOUNDARY_MIN) {
      //Victory!!
      this.x = PLAYER_START_X_POSITION;
      this.y = PLAYER_START_Y_POSITION;
      this.score++;
      this.updateScore();
    }
};

//Check to see if the collisionDetected boolean is true.  Restart the game if so.
Player.prototype.checkForEnemyCollision = function() {
    if (this.collisionDetected === true) {
      this.collisionDetected = false;
      this.x = PLAYER_START_X_POSITION;
      this.y = PLAYER_START_Y_POSITION;
      this.score = 0;
      this.updateScore();
    }
};

//Update player's score
Player.prototype.updateScore = function() {
  console.log("Update score")
  var canvas = document.querySelector('canvas');
  var ctx = canvas.getContext('2d');
  var previousScore = this.score - 1;

  ctx.font = '36px Impact'
  ctx.textAlign = "center";
  ctx.lineWidth = 1;
  ctx.strokeStyle = "white";
  ctx.fillStyle = "white";
  console.log("clearing 'Score: " + previousScore + "'");
  ctx.fillText("Score:  " + previousScore, canvas.width / 2, 40);
  ctx.strokeText("Score:  " + previousScore, canvas.width / 2, 40);
  ctx.strokeStyle = "black";
  ctx.fillText("Score:  " + this.score, canvas.width / 2, 40);
  ctx.strokeText("Score:  " + this.score, canvas.width / 2, 40);
  console.log("adding 'Score: " + this.score + "'");
};

var allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy()];
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
