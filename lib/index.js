// var Game = require('../lib/game');
var ScoreKeeper = require('../lib/score-keeper');
var GameSetup = require('../lib/game-setup');
var Game = require('../lib/game');

// Load high scores
ScoreKeeper.loadHighScores();
ScoreKeeper.loadHighScores2P();
// What happens when I click on the button?
GameSetup.setStartScreen(Game);
