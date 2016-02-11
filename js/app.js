// get a random integer from a range
function getRandomInterger(min, max) {
  return Math.floor(Math.random()*(max - min + 1) + min);
}

// check for collison between game characters
function charCollision(object, player) {
  return (player.x > object.x - object.dimensions.width/2 &&
          player.x < object.x + object.dimensions.width/2 &&
          player.y > object.y - object.dimensions.height/2 &&
          player.y < object.y + object.dimensions.height/2);
}

// select a random elemet from an array
function randomElement(fromArray) {
  return fromArray[Math.floor(Math.random() * fromArray.length)];
}

//Create a game character class
var GmChar = function(thisx, thisy, imageN) {
  this.x = thisx;
  this.y = thisy;
  this.sprite = imageN;
};

GmChar.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
GmChar.prototype.dimensions = {'width': 101, 'height': 83};
//===

// Enemies our player must avoid
var Enemy = function(thisx, thisy, imageN) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    // this.sprite = 'images/enemy-bug.png';
    sprite = imageN || 'images/enemy-bug.png';
    GmChar.call(this, thisx, thisy, sprite);
    this.speed = getRandomInterger(100, 200);
};

Enemy.prototype = Object.create(GmChar.prototype);
Enemy.prototype.yPos = [60, 151, 234];
Enemy.prototype.pictures = [60, 151, 234];
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x <= canvas.width + (this.speed*dt))
      this.x += (this.speed + player.getDifficulty()) *dt;
    else
    {
      this.speed = getRandomInterger(100, 200);
      this.x = -this.dimensions.width;
      this.y = randomElement(this.yPos);
    }

    if (charCollision(this, player)) {
      player.reset();
    }
};

// Draw the enemy on the screen, required method for game
// Enemy.prototype.render = function() {
//     // ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
// };

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(thisx, thisy, imageN) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our player, this uses
    // a helper we've provided to easily load images
    // this.sprite = 'images/char-boy.png';
    sprite = imageN || 'images/char-boy.png';
    x = thisx || 200;
    y = thisy || 400;
    GmChar.call(this, x, y, sprite);
};
Player.prototype = Object.create(GmChar.prototype);

Player.prototype.update = function(dt) {
  //change the x depending on the input also make sure its within the canvas
  switch (this.action) {
    case 'left':
      if (this.x > canvas.boundaries.left)
        this.x -= this.dimensions.width;
      break;
    case 'up':
      if (this.y > canvas.boundaries.up)
        this.y -= this.dimensions.height;
      break;
    case 'right':
      if (this.x < canvas.boundaries.right)
        this.x += this.dimensions.width;
      break;
    case 'down':
      if (this.y < canvas.boundaries.down)
        this.y += this.dimensions.height;
      break;
    default:
  }

  this.action = null;

  if (this.y < 25) {
    this.score += 1;
    this.updateScore();
    this.updateDifficulty();
    this.reset();
  }
};

//reset the player to original pos
Player.prototype.reset = function() {
  this.x = 200;
  this.y = 400;
};

Player.prototype.handleInput = function(keyPressed) {
  this.action = keyPressed;
};

Player.prototype.score = 0;

Player.prototype.updateScore = function() {
  $('#score').text(this.score);
};

Player.prototype.getDifficulty = function() {
  var difMultiplier = 25;
  //Change the difficulty
  return this.score * difMultiplier;
};

Player.prototype.updateDifficulty = function() {
  var difficulty = Math.round(this.getDifficulty() / 100);
  $('#difficulty').text(difficulty);
};

//Gem class
var Gem = function(thisx, thisy, imageN) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our player, this uses
    // a helper we've provided to easily load images
    sprite = imageN || encodeURI('images/Gem-Green.png');
    console.log(sprite);
    x = thisx || 200;
    y = thisy || 68;
    GmChar.call(this, x, y, sprite);
};
Gem.prototype = Object.create(GmChar.prototype);
Gem.prototype.posX = [-2, 99, 200, 301, 402];
Gem.prototype.posY = [60, 151, 234];
Gem.prototype.pictures = ['Gem-Green', 'Gem-Blue', 'Gem-Orange', 'Heart', 'Star'];
Gem.prototype.update = function(dt) {
    //if the player collects the gem
    if (charCollision(this, player)) {
      this.x = randomElement(this.posX);
      this.y = randomElement(this.posY);
      var randomPic = randomElement(this.pictures);
      //Make sure that the Gem is random
      this.sprite = encodeURI('images/' + randomPic + '.png');
      player.score += 2;
      player.updateScore();
      player.updateDifficulty();
    }
};
//===
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [
  new Enemy(-100, 68),
  new Enemy(-100, 151),
  new Enemy(-100, 234),
];
// Place the player object in a variable called player
var player = new Player();
var gem = new Gem();


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
