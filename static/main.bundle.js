/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Game = __webpack_require__(1);
	var canvas = document.getElementById('game');
	var game = new Game(canvas);

	game.play();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Dinosaur = __webpack_require__(2);
	var Windup = __webpack_require__(5);
	var GamePlay = __webpack_require__(6);
	var Levels = __webpack_require__(9);
	var ScoreKeeper = __webpack_require__(11);

	function Game(canvas) {
	  this.canvas = canvas;
	  this.context = canvas.getContext('2d');
	  this.dino = new Dinosaur(this.canvas, "bob");
	  this.windups = [new Windup(canvas, this.dino), new Windup(canvas, this.dino)];
	  this.bubbles = [];
	  this.fruits = [];
	  this.keyPressed = {};
	}

	Game.prototype.play = function () {
	  setKeyBindings(this);
	  ScoreKeeper.loadHighScores();
	  ScoreKeeper.loadHighScores2P();
	  setStartScreen(gameLoop, gameLoop2P, this);
	  setEndScreen(gameLoop, this);
	  set2PEndScreens(gameLoop2P, this);
	};

	Game.prototype.floors = function () {
	  return new Levels().whichLevel(this.canvas, this.dino.level);
	};

	function gameLoop() {
	  var game = this;
	  game.context.fillStyle = "000000";
	  game.context.fillRect(0, 0, game.canvas.width, game.canvas.height);
	  GamePlay.drawFloors(game.floors(), game.context);
	  GamePlay.respondToPresses(game);
	  game.dino.move(game.floors()).draw(game.context);
	  GamePlay.drawBubbles(game.bubbles, game.context);
	  GamePlay.checkWindupBubbleCollisions(game.windups, game.bubbles);
	  GamePlay.checkDinoBubbleCollisions(game.dino, game.bubbles, game.fruits, game.canvas);
	  GamePlay.drawFruits(game.fruits, game.context);
	  GamePlay.checkDinoFruitCollisions(game.dino, game.fruits);
	  GamePlay.drawWindups(game.windups, game.context, game.dino, game.floors());
	  GamePlay.checkDinoWindupCollisions(game.dino, game.windups);
	  GamePlay.drawScore(game.dino, game.context);
	  GamePlay.decrementFruitValues(game.fruits);
	  if (GamePlay.gameOver(game.dino, game.bubbles, game.windups, game.fruits)) {
	    ScoreKeeper.recordScore(game);
	    ScoreKeeper.loadHighScores();
	    GamePlay.endGameSequence(game.dino);
	    return true;
	  }
	  var newWindups = GamePlay.levelUp(game.dino, game.fruits, game.windups, game.canvas, game.bubbles);
	  if (newWindups) {
	    game.windups = newWindups;
	    GamePlay.nextLevel(game);
	  }
	  requestAnimationFrame(gameLoop.bind(game));
	}

	function gameLoop2P() {
	  var game = this;
	  game.context.fillStyle = "000000";
	  game.context.fillRect(0, 0, game.canvas.width, game.canvas.height);
	  GamePlay.drawFloors(game.floors2p, game.context);
	  GamePlay.respondToPresses2P(game);
	  game.dino.move(game.floors2p).draw(game.context);
	  game.dino2.move(game.floors2p).draw(game.context);
	  GamePlay.drawBubbles(game.bubbles, game.context);
	  GamePlay.checkWindupBubbleCollisions(game.windups, game.bubbles);
	  GamePlay.checkDinoBubbleCollisions(game.dino, game.bubbles, game.fruits, game.canvas, true);
	  GamePlay.checkDinoBubbleCollisions(game.dino2, game.bubbles, game.fruits, game.canvas, true);
	  GamePlay.drawFruits(game.fruits, game.context);
	  GamePlay.checkDinoFruitCollisions(game.dino, game.fruits);
	  GamePlay.checkDinoFruitCollisions(game.dino2, game.fruits);
	  GamePlay.drawWindups(game.windups, game.context, game.dino, game.floors2p);
	  GamePlay.checkDinoWindupCollisions(game.dino, game.windups);
	  GamePlay.checkDinoWindupCollisions(game.dino2, game.windups);
	  GamePlay.drawScore(game.dino, game.context);
	  GamePlay.drawScore2(game.dino2, game.context);
	  GamePlay.decrementFruitValues(game.fruits);
	  if (GamePlay.gameOver2P(game.dino, game.dino2)) {
	    if (game.dino.points > game.dino2.points) {
	      ScoreKeeper.recordScore2P(game, game.dino);
	    } else {
	      ScoreKeeper.recordScore2P(game, game.dino2);
	    }
	    ScoreKeeper.loadHighScores2P();
	    clearInterval(game.intID);
	    GamePlay.endGameSequence2P(game.dino, game.dino2);
	    return true;
	  }
	  requestAnimationFrame(gameLoop2P.bind(game));
	}

	function setKeyBindings(game) {
	  document.addEventListener('keydown', function (e) {
	    e.preventDefault();
	    game.keyPressed[e.keyCode] = true;
	  }, false);
	  document.addEventListener('keyup', function (e) {
	    game.keyPressed[e.keyCode] = false;
	  }, false);
	  document.addEventListener('keydown', function (e) {
	    var themeMusic = document.getElementById("game-music");
	    if (e.keyCode === 51) {
	      themeMusic.pause();
	    } else if (e.keyCode === 52) {
	      themeMusic.play();
	    }
	  }, false);
	}

	function setStartScreen(gameLoop, gameLoop2P, game) {
	  var startScreen = document.getElementById("start-screen");
	  var instructionsScreen = document.getElementById("instructions-screen");
	  var startButton = document.getElementById("start");
	  var startButtonDoubleBubble = document.getElementById("start-double");
	  var instructionsButton = document.getElementById("instructions");
	  var backButton = document.getElementById("back");
	  startButton.addEventListener('click', function () {
	    startScreen.className += "hidden";
	    var themeMusic = document.getElementById("game-music");
	    themeMusic.play();
	    game.canvas.setAttribute('width', 400);
	    game.canvas.style["marginLeft"] = "125px";
	    requestAnimationFrame(gameLoop.bind(game));
	  });
	  instructionsButton.addEventListener('click', function () {
	    startScreen.className += "hidden";
	    instructionsScreen.className = "";
	  });
	  backButton.addEventListener('click', function () {
	    startScreen.className = "";
	    instructionsScreen.className += "hidden";
	  });
	  startButtonDoubleBubble.addEventListener('click', function () {
	    startScreen.className += "hidden";
	    var themeMusic = document.getElementById("game-music");
	    themeMusic.play();
	    reset2Pgame(game);
	    requestAnimationFrame(gameLoop2P.bind(game));
	  });
	}

	function setEndScreen(gameLoop, game) {
	  var endScreens = document.getElementsByClassName('new-single');
	  for (var i = 0; i < endScreens.length; i++) {
	    endScreens[i].addEventListener('click', function () {
	      this.parentElement.className += "hidden";
	      reset1Pgame(game);
	      setKeyBindings(game);
	      requestAnimationFrame(gameLoop.bind(game));
	    });
	  }
	}

	function set2PEndScreens(gameLoop2P, game) {
	  var endScreens = document.getElementsByClassName('new-double');
	  for (var i = 0; i < endScreens.length; i++) {
	    endScreens[i].addEventListener('click', function () {
	      this.parentElement.className += "hidden";
	      setKeyBindings(game);
	      reset2Pgame(game);
	      requestAnimationFrame(gameLoop2P.bind(game));
	    });
	  }
	}

	function reset1Pgame(game) {
	  game.canvas.setAttribute('width', 400);
	  game.canvas.style["marginLeft"] = "125px";
	  game.canvas.style["borderTop"] = "10px solid #ff1d8e";
	  game.canvas.style["borderLeft"] = "10px solid #ff1d8e";
	  game.canvas.style["borderRight"] = "10px solid #ff1d8e";
	  game.dino = new Dinosaur(game.canvas, "bob");
	  game.windups = [new Windup(game.canvas, game.dino), new Windup(game.canvas, game.dino)];
	  game.bubbles = [];
	  game.fruits = [];
	}

	function reset2Pgame(game) {
	  game.canvas.setAttribute('width', 550);
	  game.canvas.style["marginLeft"] = "50px";
	  game.canvas.style["borderTop"] = "20px solid #ff1d8e";
	  game.canvas.style["borderLeft"] = "20px solid #ff1d8e";
	  game.canvas.style["borderRight"] = "20px solid #ff1d8e";
	  game.dino2 = new Dinosaur(game.canvas, "bub");
	  game.dino2.x = game.canvas.width - game.dino2.width;
	  game.dino2.direction = "left";
	  game.dino2.floorHeight = 20;
	  game.dino.floorHeight = 20;
	  game.dino.x = 0;
	  game.dino.y = game.canvas.height - game.dino.height - 20;
	  game.dino2.y = game.canvas.height - game.dino2.height - 20;
	  game.windups = [new Windup(game.canvas, game.dino, true), new Windup(game.canvas, game.dino, true), new Windup(game.canvas, game.dino2, true), new Windup(game.canvas, game.dino2, true)];
	  game.bubbles = [];
	  game.fruits = [];
	  game.windups.forEach(function (windup) {
	    windup.floorHeight = 20;
	  });
	  game.dino.lives = 3;
	  game.dino.points = 0;
	  game.dino.rebornTime = 0;
	  game.floors2p = new Levels().twoPlayer(game.canvas);
	  game.intID = setInterval(makeNewWindups.bind(game), 5000);
	}

	function makeNewWindups() {
	  var nw = new Windup(this.canvas, chooseRandomDino(this), true);
	  nw.floorHeight = 20;
	  this.windups.push(nw);
	  nw = new Windup(this.canvas, chooseRandomDino(this), true);
	  nw.floorHeight = 20;
	  this.windups.push(nw);
	}

	function chooseRandomDino(game) {
	  var dino;
	  if (Math.random() < 0.5) {
	    dino = game.dino;
	  } else {
	    dino = game.dino2;
	  }
	  return dino;
	}
	module.exports = Game;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Collision = __webpack_require__(3);
	var Jump = __webpack_require__(4);

	function Dinosaur(canvas, bubOrBob) {
	  this.height = 25;
	  this.width = 25;
	  this.x = canvas.width / 2;
	  this.y = canvas.height - this.height - 10;
	  this.status = null;
	  this.direction = "right";
	  if (bubOrBob === "bob") {
	    this.dino_img_left = createImage("images/bob_left.png");
	    this.dino_img_left_1 = createImage("images/bob_left_1.png");
	    this.dino_img_left_2 = createImage("images/bob_left_2.png");
	    this.dino_img_right = createImage("images/bob_right.png");
	    this.dino_img_right_1 = createImage("images/bob_right_1.png");
	    this.dino_img_right_2 = createImage("images/bob_right_2.png");
	  } else {
	    this.dino_img_left = createImage("images/bub_left.png");
	    this.dino_img_left_1 = createImage("images/bub_left_1.png");
	    this.dino_img_left_2 = createImage("images/bub_left_2.png");
	    this.dino_img_right = createImage("images/bub_right.png");
	    this.dino_img_right_1 = createImage("images/bub_right_1.png");
	    this.dino_img_right_2 = createImage("images/bub_right_2.png");
	  }
	  this.count = 0;
	  this.canvas = canvas;
	  this.points = 0;
	  this.rebornTime = 0;
	  this.lives = 3;
	  this.jumpSteps = 20;
	  this.jumpTotal = 150;
	  this.jumpSize = this.jumpTotal / this.jumpSteps;
	  this.level = 1;
	  this.floorHeight = 10;
	  this.jump = new Jump();
	}

	Dinosaur.prototype.reborn = function () {
	  if (this.rebornTime === 0) {
	    this.x = this.canvas.width / 2;
	    this.y = this.canvas.height - this.height - this.floorHeight;
	    this.direction = "right";
	    this.rebornTime = 150;
	    this.lives--;
	    resetDino(this);
	  }
	};

	// These perhaps should be getters instead of functions
	Dinosaur.prototype.mouthX = function () {
	  if (this.direction === "right") {
	    return this.x + this.width;
	  }
	  return this.x - 30;
	};

	Dinosaur.prototype.mouthY = function () {
	  return this.y;
	};

	Dinosaur.prototype.dino_img = function () {
	  if (this.direction === "right" && this.rebornTime >= 75) {
	    return this.dino_img_right_1;
	  } else if (this.direction === "right" && this.rebornTime > 0 && this.rebornTime < 75) {
	    return this.dino_img_right_2;
	  } else if (this.direction === "right") {
	    return this.dino_img_right;
	  } else if (this.direction === "left" && this.rebornTime >= 75) {
	    return this.dino_img_left_1;
	  } else if (this.direction === "left" && this.rebornTime > 0 && this.rebornTime < 75) {
	    return this.dino_img_left_2;
	  } else if (this.direction === "left") {
	    return this.dino_img_left;
	  }
	};

	Dinosaur.prototype.draw = function (context) {
	  context.drawImage(this.dino_img(), this.x, this.y, this.width, this.height);
	  return this;
	};

	Dinosaur.prototype.left = function (game) {
	  var verticalFloors = findVerticalFloors(game.floors());
	  if (runIntoVerticalFloor(this, verticalFloors, "left") && notOnTopWall(this)) {
	    this.x = this.x;
	  } else if (this.x > 4) {
	    this.x -= 2;
	  } else {
	    this.x = 0;
	  }
	  this.direction = "left";
	  return this;
	};

	Dinosaur.prototype.right = function (game) {
	  var verticalFloors = findVerticalFloors(game.floors());
	  if (runIntoVerticalFloor(this, verticalFloors, "right") && notOnTopWall(this)) {
	    this.x = this.x;
	  } else if (this.x < this.canvas.width - this.width) {
	    this.x += 2;
	  } else {
	    this.x = this.canvas.width - this.width;
	  }
	  this.direction = "right";
	  return this;
	};

	Dinosaur.prototype.move = function (floors) {
	  if (this.rebornTime > 0) {
	    this.rebornTime--;
	  }
	  if (this.status === "jumping") {
	    this.jump.jump(floors, this);
	  }
	  if (!this.jump.onAFloor(floors, this)) {
	    this.y += 2;
	  }
	  return this;
	};

	Dinosaur.prototype.setJumpingStatus = function () {
	  if (!this.status) {
	    this.status = "jumping";
	  }
	};

	function resetDino(dino) {
	  dino.status = null;
	  dino.count = 0;
	}

	function createImage(imageSrc) {
	  var image = document.createElement("img");
	  image.src = imageSrc;
	  image.style.visibility = 'hidden';
	  return image;
	}

	function findVerticalFloors(floors) {
	  var verticalFloors = [];
	  floors.forEach(function (floor) {
	    if (floor.height > 10) {
	      verticalFloors.push(floor);
	    }
	  });
	  return verticalFloors;
	}

	function runIntoVerticalFloor(dino, verticalFloors, direction) {
	  for (var i = 0; i < verticalFloors.length; i++) {
	    var dino_collider = Collision.generateReceiver(dino);
	    var floor_receiver = Collision.generateReceiver(verticalFloors[i]);
	    if (Collision.collisionVertical(dino_collider, floor_receiver, direction)) {
	      return true;
	    }
	  }
	  return false;
	}

	function notOnTopWall(dino) {
	  return !(dino.y > 30 && dino.y < 34);
	}

	module.exports = Dinosaur;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.collision = collision;
	exports.collisionVertical = collisionVertical;
	exports.generateCollider = generateCollider;
	exports.generateReceiver = generateReceiver;

	function collision(collider, receiver) {
	  return collideX(collider, receiver) && collideY(collider, receiver);
	}

	function collisionVertical(collider, receiver, direction) {
	  return collideXVertical(collider, receiver, direction) && collideYVertical(collider, receiver);
	}

	function generateCollider(object) {
	  return { x: object.x + object.width / 2,
	    y: object.y + object.height / 2 };
	}

	function generateReceiver(object) {
	  return { minX: object.x,
	    maxX: object.x + object.width,
	    minY: object.y,
	    maxY: object.y + object.height };
	}

	function collideX(collider, receiver) {
	  return collider.x >= receiver.minX && collider.x <= receiver.maxX;
	}

	function collideY(collider, receiver) {
	  return collider.y >= receiver.minY && collider.y <= receiver.maxY;
	}

	function collideYVertical(collider, receiver) {
	  return collider.maxY >= receiver.minY && collider.minY <= receiver.maxY;
	}

	function collideXVertical(collider, receiver, direction) {
	  if (direction === "right") {
	    return collider.maxX > receiver.minX - 2 && collider.maxX < receiver.minX + 2;
	  } else {
	    return collider.minX < receiver.maxX + 2 && collider.minX > receiver.maxX - 2;
	  }
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Collision = __webpack_require__(3);

	function Jump() {}

	Jump.prototype.jump = function (floors, element) {
	  if (stillJumpingUp(element)) {
	    dontHitCeiling(element);
	  } else if (jumpingDown(element)) {
	    findNearestFloor(floors, element);
	  } else if (finishedJumpingAndFalling(element)) {
	    resetElement(element);
	  }
	  return this;
	};

	Jump.prototype.onThisFloor = function (floor, element) {
	  var element_collider = { x: element.x + element.width / 2, y: element.y + element.height };
	  var floor_receiver = { minX: floor.x,
	    maxX: floor.x + floor.width,
	    minY: floor.y,
	    maxY: floor.y + floor.height };
	  if (Collision.collision(element_collider, floor_receiver)) {
	    return true;
	  }
	};

	Jump.prototype.onAFloor = function (floors, windup) {
	  var floor;
	  for (var i = 0; i < floors.length; i++) {
	    floor = floors[i];
	    if (new Jump().onThisFloor(floor, windup)) {
	      return true;
	    }
	  }
	  return false;
	};

	function stillJumpingUp(element) {
	  return element.count < element.jumpSteps;
	}

	function dontHitCeiling(element) {
	  element.count++;
	  if (element.y - element.jumpSize > 0) {
	    element.y -= element.jumpSize;
	  } else {
	    element.y = 0;
	    element.count = element.jumpSteps;
	  }
	}

	function jumpingDown(element) {
	  return element.count >= element.jumpSteps && element.count < 2 * element.jumpSteps;
	}

	function findNearestFloor(floors, element) {
	  element.count++;
	  floors.forEach(function (floor) {
	    if (new Jump().onThisFloor(floor, element)) {
	      element.y = floor.y - floor.height / 2 - element.height - 2;
	      resetElement(element);
	    }
	  });
	  element.y += element.jumpSize;
	  return element;
	}

	function finishedJumpingAndFalling(element) {
	  return element.count === 2 * element.jumpSteps;
	}

	function resetElement(element) {
	  element.status = null;
	  element.count = 0;
	}

	module.exports = Jump;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Jump = __webpack_require__(4);

	function Windup(canvas, dino, twoPlayer) {
	  this.x = Math.random() * (canvas.width - 17);
	  this.y = 0;
	  this.height = 20;
	  this.width = 20;
	  this.canvas = canvas;
	  this.count = 0;
	  this.fallRate = 0.75;
	  this.paceRate = 0.75;
	  this.direction = "right";
	  this.img_right = createImage('images/windup_right.png');
	  this.img_left = createImage('images/windup_left.png');
	  this.floorHeight = 10;
	  this.jumpSteps = 20;
	  this.jumpTotal = 120;
	  this.jumpSize = this.jumpTotal / this.jumpSteps;
	  this.status = "falling";
	  this.dino = dino;
	  this.jump = new Jump();
	  if (twoPlayer) {
	    this.twoPlayer = true;
	  }
	}

	Windup.prototype.draw = function (context) {
	  context.drawImage(this.img(), this.x, this.y, this.width, this.height);
	  return this;
	};

	Windup.prototype.img = function () {
	  if (this.direction === "right") {
	    return this.img_right;
	  } else {
	    return this.img_left;
	  }
	};

	Windup.prototype.fall = function () {
	  this.y += this.fallRate;
	  return this;
	};

	Windup.prototype.move = function (floors) {
	  if (this.status === "falling" && this.y < this.canvas.height - this.height - this.floorHeight) {
	    this.fall();
	  } else if (this.status === "jumping") {
	    this.jump.jump(floors, this);
	  } else if (this.x >= this.dino.x) {
	    this.direction = "left";
	    this.x -= this.paceRate;
	  } else if (this.x < this.dino.x) {
	    this.direction = "right";
	    this.x += this.paceRate;
	  }

	  if (this.status !== "falling" && !this.jump.onAFloor(floors, this)) {
	    this.y += 2;
	  }

	  if (this.status === "falling" && this.y >= this.canvas.height - this.height - this.floorHeight) {
	    this.status = null;
	  }

	  if (this.status !== "falling" && this.status !== "jumping" && Math.random() < 0.02 && this.twoPlayer) {
	    this.status = "jumping";
	  }
	  return this;
	};

	function createImage(imageSrc) {
	  var image = document.createElement("img");
	  image.src = imageSrc;
	  image.style.visibility = 'hidden';
	  return image;
	}

	module.exports = Windup;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.gameOver = gameOver;
	exports.gameOver2P = gameOver2P;
	exports.respondToPresses = respondToPresses;
	exports.respondToPresses2P = respondToPresses2P;
	exports.checkDinoWindupCollisions = checkDinoWindupCollisions;
	exports.checkDinoFruitCollisions = checkDinoFruitCollisions;
	exports.checkDinoBubbleCollisions = checkDinoBubbleCollisions;
	exports.checkWindupBubbleCollisions = checkWindupBubbleCollisions;
	exports.drawWindups = drawWindups;
	exports.drawBubbles = drawBubbles;
	exports.drawFruits = drawFruits;
	exports.drawFloors = drawFloors;
	exports.drawScore = drawScore;
	exports.drawScore2 = drawScore2;
	exports.levelUp = levelUp;
	exports.nextLevel = nextLevel;
	exports.nextLevel2P = nextLevel2P;
	exports.endGameSequence = endGameSequence;
	exports.endGameSequence2P = endGameSequence2P;
	exports.decrementFruitValues = decrementFruitValues;
	var Collision = __webpack_require__(3);
	var Fruit = __webpack_require__(7);
	var Windup = __webpack_require__(5);
	var Bubble = __webpack_require__(8);

	function gameOver(dino, bubbles, windups, fruits) {
	  if (dino.lives === 0 || dino.level === 3 && allFilledBubblesPopped(bubbles) && windups.length === 0 && allFruitsCollected(fruits)) {
	    return true;
	  }
	  return false;
	}

	function gameOver2P(dino, dino2) {
	  if (dino.lives === 0 || dino2.lives === 0 || dino.points >= 10000 || dino2.points >= 10000) {
	    return true;
	  }
	  return false;
	}

	function respondToPresses(game) {
	  if (game.keyPressed[65]) {
	    game.dino.left(game);
	  }
	  if (game.keyPressed[68]) {
	    game.dino.right(game);
	  }
	  if (game.keyPressed[87] || game.keyPressed[75]) {
	    game.dino.setJumpingStatus();
	  }
	  if (game.keyPressed[32] || game.keyPressed[74]) {
	    var bubble = new Bubble(game.dino.mouthX(), game.dino.mouthY(), game.dino.direction, game.canvas, "bob");
	    game.bubbles.push(bubble);
	    game.keyPressed[32] = false;
	    game.keyPressed[74] = false;
	  }
	}

	function respondToPresses2P(game) {
	  if (game.keyPressed[65]) {
	    game.dino.left(game);
	  }
	  if (game.keyPressed[68]) {
	    game.dino.right(game);
	  }
	  if (game.keyPressed[87]) {
	    game.dino.setJumpingStatus();
	  }
	  if (game.keyPressed[32]) {
	    var bubble = new Bubble(game.dino.mouthX(), game.dino.mouthY(), game.dino.direction, game.canvas, "bob");
	    game.bubbles.push(bubble);
	    game.keyPressed[32] = false;
	  }
	  if (game.keyPressed[74]) {
	    game.dino2.left(game);
	  }
	  if (game.keyPressed[76]) {
	    game.dino2.right(game);
	  }
	  if (game.keyPressed[222]) {
	    var bubble2 = new Bubble(game.dino2.mouthX(), game.dino2.mouthY(), game.dino2.direction, game.canvas, "bub");
	    game.bubbles.push(bubble2);
	    game.keyPressed[222] = false;
	  }
	  if (game.keyPressed[13]) {
	    game.dino2.setJumpingStatus();
	  }
	}

	function checkDinoWindupCollisions(dino, windups) {
	  windups.forEach(function (windup) {
	    var windup_collider = Collision.generateCollider(windup);
	    var dino_receiver = Collision.generateReceiver(dino);
	    if (Collision.collision(windup_collider, dino_receiver)) {
	      dino.reborn();
	      return;
	    }
	  });
	}

	function checkDinoFruitCollisions(dino, fruits) {
	  fruits.forEach(function (fruit) {
	    var fruit_collider = Collision.generateCollider(fruit);
	    var dino_receiver = Collision.generateReceiver(dino);
	    if (Collision.collision(fruit_collider, dino_receiver) && fruit.collectible()) {
	      fruit.status = "collected";
	      dino.points += fruit.points;
	    }
	  });
	}

	function checkDinoBubbleCollisions(dino, bubbles, fruits, canvas, twoPlayer) {
	  bubbles.forEach(function (bubble) {
	    var bubble_collider = Collision.generateCollider(bubble);
	    var dino_receiver = Collision.generateReceiver(dino);
	    if (Collision.collision(bubble_collider, dino_receiver)) {
	      if (bubble.filled && bubble.status !== "popped") {
	        var fruit = new Fruit(canvas, bubble.x, bubble.y, 1000);
	        if (twoPlayer) {
	          fruit.floorHeight = 20;
	        }
	        fruits.push(fruit);
	      }
	      bubble.status = "popped";
	    }
	  });
	  return bubbles;
	}

	function checkWindupBubbleCollisions(windups, bubbles) {
	  bubbles.forEach(function (bubble) {
	    windups.forEach(function (windup, index, windups) {
	      var bubble_collider = Collision.generateCollider(bubble);
	      var windup_receiver = Collision.generateReceiver(windup);
	      if (Collision.collision(bubble_collider, windup_receiver) && bubble.status === "new") {
	        bubble.fillUp();
	        windups.splice(index, 1);
	      }
	    });
	  });
	}

	function drawWindups(windups, context, dino, floors) {
	  windups.forEach(function (windup) {
	    windup.move(floors).draw(context);
	  });
	}

	function drawBubbles(bubbles, context) {
	  bubbles.forEach(function (bubble) {
	    if (bubble.status !== "popped") {
	      bubble.move().draw(context);
	    }
	  });
	}

	function drawFruits(fruits, context) {
	  fruits.forEach(function (fruit) {
	    if (fruit.status !== "collected") {
	      fruit.fall().draw(context);
	    }
	  });
	}

	function drawFloors(floors, context) {
	  floors.forEach(function (floor) {
	    floor.draw(context);
	  });
	}

	function drawScore(dino, context) {
	  context.font = "16px monospace";
	  context.fillStyle = "#fff";
	  context.fillText("Score: " + dino.points, 10, 20);
	  context.fillText("Lives: " + dino.lives, 10, 40);
	  context.fillStyle = "#000";
	}

	function drawScore2(dino2, context) {
	  context.font = "16px monospace";
	  context.fillStyle = "#fff";
	  context.fillText("Score: " + dino2.points, 425, 20);
	  context.fillText("Lives: " + dino2.lives, 425, 40);
	  context.fillStyle = "#000";
	}

	function levelUp(dino, fruits, windups, canvas, bubbles) {
	  if (levelOver(windups, fruits, dino, bubbles)) {
	    if (dino.level === 1 || dino.level === 2) {
	      var newWindups = [new Windup(canvas, dino), new Windup(canvas, dino)];
	      setTimeout(function () {
	        dino.level++;
	      }, 2000);
	      return newWindups;
	    }
	  }
	}

	function nextLevel(game) {
	  var elem = document.getElementById('game');
	  elem.style.transition = "opacity 1s linear 0s";
	  elem.style.opacity = 0;
	  setTimeout(function () {
	    elem.style.opacity = 1;
	    if (game) {
	      game.bubbles = [];
	      game.windups.forEach(function (windup) {
	        windup.y = 0;
	      });
	      game.dino.x = game.canvas.width / 2;
	      game.dino.y = game.canvas.height - game.dino.height - 10;
	    }
	  }, 2000);
	}

	function nextLevel2P(game) {
	  var elem = document.getElementById('game');
	  elem.style.transition = "opacity 1s linear 0s";
	  elem.style.opacity = 0;
	  setTimeout(function () {
	    elem.style.opacity = 1;
	    if (game) {
	      game.bubbles = [];
	      game.windups.forEach(function (windup) {
	        windup.y = 0;
	      });
	      game.dino.x = 0;
	      game.dino.direction = "right";
	      game.dino2.x = game.canvas.width - game.dino2.width;
	      game.dino.y = game.canvas.height - game.dino.height - 10;
	      game.dino2.y = game.canvas.height - game.dino.height - 10;
	      game.dino2.direction = "left";
	    }
	  }, 2000);
	}

	function endGameSequence(dino) {
	  nextLevel(null);
	  dino.level = 0;
	  if (dino.lives === 0) {
	    setTimeout(function () {
	      document.getElementById('end-game-lose').className = "";
	    }, 2000);
	  } else {
	    setTimeout(function () {
	      document.getElementById('end-game-win').className = "";
	    }, 2000);
	  }
	}

	function endGameSequence2P(bob, bub) {
	  nextLevel(null);
	  if (bob.lives === 0) {
	    setTimeout(function () {
	      document.getElementById('end-game-lose-bub').className = "";
	    }, 2000);
	  } else if (bub.lives === 0) {
	    setTimeout(function () {
	      document.getElementById('end-game-lose-bob').className = "";
	    }, 2000);
	  } else if (bob.points > bub.points) {
	    setTimeout(function () {
	      document.getElementById('end-game-win-bob').className = "";
	    }, 2000);
	  } else {
	    setTimeout(function () {
	      document.getElementById('end-game-win-bub').className = "";
	    }, 2000);
	  }
	}

	function decrementFruitValues(fruits) {
	  fruits.forEach(function (fruit) {
	    fruit.points -= 1;
	  });
	}

	function allFruitsCollected(fruits) {
	  return fruits.every(function (element) {
	    return element.status === "collected";
	  });
	}

	function levelOver(windups, fruits, dino, bubbles) {
	  return windups.length === 0 && allFruitsCollected(fruits) && allFilledBubblesPopped(bubbles);
	}

	function allFilledBubblesPopped(bubbles) {
	  for (var i = 0; i < bubbles.length; i++) {
	    if (bubbles[i].filled && !(bubbles[i].status === "popped")) {
	      return false;
	    }
	  }
	  return true;
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	function Fruit(canvas, startingX, startingY, points) {
	  this.startingY = startingY;
	  this.x = startingX;
	  this.y = startingY;
	  this.height = 20;
	  this.width = 20;
	  this.canvas = canvas;
	  this.count = 0;
	  this.points = points;
	  this.fallRate = 0.75;
	  this.status = "new";
	  this.image = createFruitImage();
	  this.floorHeight = 10;
	}

	Fruit.prototype.draw = function (context) {
	  context.drawImage(this.image, this.x, this.y, this.width, this.height);
	  return this;
	};

	Fruit.prototype.fall = function () {
	  if (this.y < this.canvas.height - this.height - this.floorHeight) {
	    this.count++;
	    this.y += this.fallRate;
	  }
	  return this;
	};

	Fruit.prototype.collectible = function () {
	  return (this.y > this.startingY + 10 || this.y > this.canvas.height - this.height - 30) && this.status !== "collected";
	};

	function createImage(imageSrc) {
	  var image = document.createElement("img");
	  image.src = imageSrc;
	  image.style.visibility = 'hidden';
	  return image;
	}

	function createFruitImage() {
	  var randFruit = 'images/fruit' + Math.round(Math.random() * 5) + '.png';
	  return createImage(randFruit);
	}
	module.exports = Fruit;

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	function Bubble(x, y, direction, canvas, bobOrBub) {
	  this.x = x;
	  this.y = y;
	  this.direction = direction;
	  this.status = "new";
	  this.height = 30;
	  this.width = 30;
	  this.count = 0;
	  this.canvas = canvas;
	  this.dino = bobOrBub;
	  if (bobOrBub === "bob") {
	    this.image = setBubbleImage('images/bubble_new.png');
	  } else {
	    this.image = setBubbleImage('images/bub_bubble_new.png');
	  }
	  this.drift = 0.25;
	  setXAndXInc(this);
	}

	Bubble.prototype.draw = function (context) {
	  context.drawImage(this.image, this.x, this.y, this.width, this.height);
	  return this;
	};

	Bubble.prototype.move = function () {
	  var bubble = this;
	  float(bubble);
	  bubble.count++;
	  if (doneFloatingSidewaysOrHitAWall(bubble)) {
	    bubble.status = "floating";
	    if (!bubble.filled) {
	      if (this.dino === "bob") {
	        bubble.image = setBubbleImage('images/bubble_floating.png');
	      } else {
	        bubble.image = setBubbleImage('images/bub_bubble_floating.png');
	      }
	    }
	  }
	  if (onRightEdge(bubble)) {
	    bubble.x = bubble.canvas.width - bubble.width;
	  }
	  if (onLeftEdge(bubble)) {
	    bubble.x = 0;
	  }
	  if (onCeiling(bubble)) {
	    driftX(bubble);
	    this.status = "done";
	  }
	  return bubble;
	};

	Bubble.prototype.fillUp = function () {
	  this.status = "floating";
	  if (this.dino === "bob") {
	    this.image = setBubbleImage('images/bubble_filled.png');
	  } else {
	    this.image = setBubbleImage('images/bub_bubble_filled.png');
	  }
	  this.filled = true;
	};

	function driftX(bubble) {
	  if (Math.random() < 0.10) {
	    bubble.drift *= -1;
	  }
	  if (bubble.drift < 0 && bubble.x > -1 * bubble.drift || bubble.drift > 0 && bubble.x < bubble.canvas.width - bubble.width - bubble.drift) {
	    bubble.x += bubble.drift;
	  }
	}

	function doneFloatingSidewaysOrHitAWall(bubble) {
	  return onRightEdge(bubble) || onLeftEdge(bubble) || bubble.count === 100;
	}

	function onCeiling(bubble) {
	  return bubble.y <= 0;
	}

	function onRightEdge(bubble) {
	  return bubble.x >= bubble.canvas.width - bubble.width;
	}

	function onLeftEdge(bubble) {
	  return bubble.x <= 0;
	}

	function float(bubble) {
	  if (bubble.status === "new") {
	    bubble.x += bubble.xInc;
	  } else if (bubble.status === "floating") {
	    bubble.y--;
	  }
	  return bubble;
	}

	function setXAndXInc(bubble) {
	  if (bubble.direction === "right") {
	    bubble.x += 3;
	    bubble.xInc = 1;
	  } else {
	    bubble.x -= 3;
	    bubble.xInc = -1;
	  }
	}

	function setBubbleImage(imageSrc) {
	  var image = document.createElement("img");
	  image.src = imageSrc;
	  image.style.visibility = 'hidden';
	  return image;
	}
	module.exports = Bubble;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Floor = __webpack_require__(10);

	function Levels() {}

	Levels.prototype.whichLevel = function (canvas, level) {
	  if (level === 1) {
	    return levelOne(canvas);
	  } else if (level === 2) {
	    return levelTwo(canvas);
	  } else if (level === 3) {
	    return levelThree(canvas);
	  } else if (level === 0) {
	    return this.twoPlayer(canvas);
	  }
	};

	Levels.prototype.twoPlayer = function (canvas) {
	  return [new Floor(canvas, 0, canvas.height - 20, 20, canvas.width), new Floor(canvas, 95, 66, 20, 455), new Floor(canvas, 0, 142, 20, 455), new Floor(canvas, 95, 218, 20, 455), new Floor(canvas, 50, 294, 20, 200), new Floor(canvas, 300, 294, 20, 200)];
	};

	function levelOne(canvas) {
	  return [new Floor(canvas, 85, 100, 10, 230), new Floor(canvas, 85, 215, 10, 230), new Floor(canvas, 85, 315, 10, 230), new Floor(canvas, 0, 315, 10, 50), new Floor(canvas, 0, 215, 10, 50), new Floor(canvas, 0, 100, 10, 50), new Floor(canvas, 350, 100, 10, 50), new Floor(canvas, 350, 215, 10, 50), new Floor(canvas, 350, 315, 10, 50), new Floor(canvas, 0, canvas.height - 10, 10, canvas.width)];
	}

	function levelTwo(canvas) {
	  return [new Floor(canvas, 0, canvas.height - 10, 10, canvas.width), new Floor(canvas, 55, 315, 10, 75), new Floor(canvas, 165, 315, 10, 75), new Floor(canvas, 275, 315, 10, 75), new Floor(canvas, 90, 235, 10, 225), new Floor(canvas, 140, 160, 10, 50), new Floor(canvas, 225, 160, 10, 50), new Floor(canvas, 170, 85, 10, 70)];
	}

	function levelThree(canvas) {
	  return [new Floor(canvas, 0, canvas.height - 10, 10, canvas.width), new Floor(canvas, 0, 315, 10, 75), //1
	  new Floor(canvas, 105, 315, 10, 50), //2
	  new Floor(canvas, 250, 315, 10, 50), //3
	  new Floor(canvas, 325, 315, 10, 75), //4
	  new Floor(canvas, 50, 55, 200, 10), // left vertical
	  new Floor(canvas, 350, 55, 200, 10), //right vertical
	  new Floor(canvas, 50, 55, 10, 115), //top left
	  new Floor(canvas, 50, 155, 10, 135), //left middle
	  new Floor(canvas, 50, 255, 10, 145), //bottom left
	  new Floor(canvas, 215, 255, 10, 145), //bottom right
	  new Floor(canvas, 225, 155, 10, 135), //middle right
	  new Floor(canvas, 245, 55, 10, 115)]; //top right
	}

	module.exports = Levels;

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";

	function Floor(canvas, x, y, height, width) {
	  this.x = x;
	  this.y = y;
	  this.height = height;
	  this.width = width;
	}

	Floor.prototype.draw = function (context) {
	  context.fillStyle = "#ff1d8e";
	  context.fillRect(this.x, this.y, this.width, this.height);
	  context.fillStyle = "#000";
	  return this;
	};

	module.exports = Floor;

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";

	function loadHighScores() {
	  removeAllNodes();
	  addHighScores();
	}

	function loadHighScores2P() {
	  removeAllNodes2P();
	  addHighScores2P();
	}

	function removeAllNodes() {
	  var highScoreList = document.getElementById("high-score-list");
	  while (highScoreList.firstChild) {
	    highScoreList.removeChild(highScoreList.firstChild);
	  }
	}

	function removeAllNodes2P() {
	  var highScoreList = document.getElementById("high-score-list-double");
	  while (highScoreList.firstChild) {
	    highScoreList.removeChild(highScoreList.firstChild);
	  }
	}

	function addHighScores() {
	  var highScoreList = document.getElementById("high-score-list");
	  var scores = localStorage.getItem('high-scores');
	  if (scores) {
	    scores = scores.split(" ");
	    scores.forEach(function (score) {
	      var scoreElement = document.createElement("li");
	      scoreElement.innerHTML = score;
	      highScoreList.appendChild(scoreElement);
	    });
	  }
	}

	function addHighScores2P() {
	  var highScoreList = document.getElementById("high-score-list-double");
	  var scores = localStorage.getItem('high-scores-2p');
	  if (scores) {
	    scores = scores.split(" ");
	    scores.forEach(function (score) {
	      var scoreElement = document.createElement("li");
	      scoreElement.innerHTML = score;
	      highScoreList.appendChild(scoreElement);
	    });
	  }
	}

	function recordScore(game) {
	  var scores = localStorage.getItem('high-scores');
	  if (scores) {
	    insertScore(scores, game.dino.points);
	  } else {
	    localStorage.setItem('high-scores', game.dino.points);
	  }
	}

	function recordScore2P(game, winner) {
	  var scores = localStorage.getItem('high-scores-2p');
	  if (scores) {
	    insertScore2P(scores, winner.points);
	  } else {
	    localStorage.setItem('high-scores-2p', winner.points);
	  }
	}

	function insertScore(scores, score) {
	  var scoresArr = scores.split(" ");
	  for (var i = 0; i < scoresArr.length; i++) {
	    if (score > scoresArr[i]) {
	      scoresArr.splice(i, 0, score);
	      break;
	    }
	  }
	  if (score <= scoresArr[scoresArr.length - 1]) {
	    scoresArr.push(score);
	  }
	  localStorage.setItem('high-scores', scoresArr.slice(0, 10).join(" "));
	}

	function insertScore2P(scores, score) {
	  var scoresArr = scores.split(" ");
	  for (var i = 0; i < scoresArr.length; i++) {
	    if (score > scoresArr[i]) {
	      scoresArr.splice(i, 0, score);
	      break;
	    }
	  }
	  if (score <= scoresArr[scoresArr.length - 1]) {
	    scoresArr.push(score);
	  }
	  localStorage.setItem('high-scores-2p', scoresArr.slice(0, 10).join(" "));
	}

	module.exports.loadHighScores = loadHighScores;
	module.exports.loadHighScores2P = loadHighScores2P;
	module.exports.recordScore = recordScore;
	module.exports.recordScore2P = recordScore2P;
	module.exports.insertScore = insertScore;
	module.exports.insertScore2P = insertScore2P;

/***/ }
/******/ ]);