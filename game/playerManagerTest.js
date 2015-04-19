var playerManager = require('./playerManager');

playerManager.players[6].selected = true;
playerManager.players[4].selected = true;
playerManager.score(1,2);
playerManager.score(3,2);
playerManager.score(6,1);

var players = playerManager.getPlayerGroup("topTwo").map(function(p,id){return p.playerId});

console.log(players);
