var playerManager = require('../../playerManager.js');

module.exports = {
    executeItem: function () {
        this.mapToDevice();
    },
    getWsContent: function() {
        console.log("HAllo, hier rating-wsContent!!!");
        var bestWorst;
        var bestWorstArr;
        if (this.ratingType == "oneTeam") {
            bestWorstArr = playerManager.getPlayerGroup(this.bestWorst);
            if (bestWorstArr.length > 0) bestWorst = bestWorstArr.map(function (x) {
                return x.playerId
            });
        }
        return {
            type: this.type,
            ratingType: this.ratingType,
            posNeg: this.posNeg,
            playerId: bestWorst,
            text: this.text
        };
    }
};



