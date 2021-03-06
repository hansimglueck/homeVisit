(function() {
    'use strict';

    var OptionPoll = require('../../polls/OptionPoll.js');
    var NumberPoll = require('../../polls/NumberPoll.js');
    var TextPoll = require('../../polls/TextPoll.js');
    var playerManager = require('../../playerManager.js');
    var logger = require('log4js').getLogger();

    module.exports = {
        executeItem: function () {
            var poll;
            switch (this.voteType) {
                case "customOptions":
                case "customMultipleOptions":
                    this.voteOptions.forEach(function (opt, id) {
                        opt.value = id;
                    });
                    poll = new OptionPoll(this);
                    break;
                case "playerChoice":
                    this.voteOptions = playerManager.getPlayerGroup("joined").map(function(player){
                        return {value: player.playerId, text: player.playerId};
                    });
                    poll = new OptionPoll(this);
                    break;
                case "enterNumber":
                    poll = new NumberPoll(this);
                    break;
                case "enterText":
                    poll = new TextPoll(this);
                    break;
                default:
                    break;
            }
            if (typeof poll !== 'undefined') {
                poll.onFinish(this, function (result) {
                    this.step(result);
                });
                this.poll = poll;
                //this.polls ist "static"
                this.polls[this.poll.id] = this.poll;

                this.mapToDevice();
            }
            else {
                logger.warn('Warning: Vote without voteOptions!');
            }
        },
        getData: function () {
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
