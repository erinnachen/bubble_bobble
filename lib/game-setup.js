var Game = require('../lib/game');

function setStartScreen() {
  var startScreen = document.getElementById("start-screen");
  var instructionsScreen = document.getElementById("instructions-screen");
  var singleButtons = document.getElementsByClassName("new-single");
  var startButtonDoubleBubble = document.getElementById("start-double");
  var instructionsButton = document.getElementById("instructions");
  var backButton = document.getElementById("back");
  var themeMusic  = document.getElementById("game-music");
  var canvas = document.getElementById('game');
  addNewGameListeners(singleButtons, playNewGame, canvas);

  // startButton.addEventListener('click', function(){
  //   startScreen.className += "hidden";
  //   playNewGame(canvas, 1);
  // });
  instructionsButton.addEventListener('click', function(){
    startScreen.className += "hidden";
    instructionsScreen.className = "";
  });
  backButton.addEventListener('click', function(){
    startScreen.className = "";
    instructionsScreen.className += "hidden";
  });
  startButtonDoubleBubble.addEventListener('click', function(){
    startScreen.className += "hidden";
    themeMusic.play();
    reset2Pgame(game);
    requestAnimationFrame(gameLoop2P.bind(game));
  });
}

function playNewGame(canvas, nplayers) {
  // themeMusic.play();
  var game = new Game(canvas, nplayers);
  game.play();
  // create new game (1 or 2player)
  // play the game
  // set the end screen
}

function addNewGameListeners(singleButtons, playNewGame, canvas) {
  var startScreen = document.getElementById("start-screen");
  for(var i = 0; i< singleButtons.length;i++) {
    singleButtons[i].addEventListener('click', function(){
      startScreen.className += "hidden";
      playNewGame(canvas, 1);
    });
  }
}

module.exports.setStartScreen = setStartScreen;
