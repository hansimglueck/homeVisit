(function() {
    'use strict';

    var playerManager = require('../../playerManager.js');
    var Agreement = require('../../polls/Agreement.js');

    module.exports = {
        executeItem: function () {
            this.playerIds = playerManager.getPlayerGroup(this.agreementOption).map(function (player) {
                return player.playerId;
            });
            var poll;
            if (this.type === "agreement") {
                poll = new Agreement(this);
                poll.onFinish(playerManager, function (result) {
                    if (result.fullfilled) {
                        playerManager.setAgreement(poll);
                    }
                    poll.playerIds.forEach(function (pid) {
                        playerManager.sendMessage(pid, "display", {type: "card", text: result.text});
                    });
                });
            }
            this.poll = poll;

            this.polls[this.poll.id] = this.poll;

            this.mapToDevice();
        },
        getData: function() {
            if (typeof this.poll !== "undefined") {
                return this.poll.getResult();
            }
            return null;
        },
        getWsContent: function () {
            return this.poll.getPollWsContent();
        }
    };

})();
