var playerManager = require('./playerManager');


playerManager.players.forEach(function (player) {
    player.joined = true;
});
playerManager.players[1].joined = false;

playerManager.players[6].selected = true;
playerManager.players[4].selected = true;
playerManager.score(1, 2);
playerManager.score(3, 2);
playerManager.score(6, 1);

playerManager.setAgreement({id: "abcd", playerIds: [2,3]});

console.log(playerManager.getPlayerArray()[2].relations);
return;
var players = playerManager.getPlayerGroup("topTwo").map(function (p) {
    return p.playerId
});

//console.log(playerManager.getPlayerArray());
