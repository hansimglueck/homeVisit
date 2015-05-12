(function() {
    'use strict';

    /*
     so ein NumberPoll erwartet nur votes mit genau einer choice...
     ich denke, falls mehrere Zahlen abgefragt werden, werden das einzelne Polls

     der multiplier macht auch nicht wirklich sinn, wird deshalb ausser acht gelassen
     */

    var Poll = require('./Poll');
    var OptionPoll = require('./OptionPoll');

    var TextPoll = function (item) {
        Poll.call(this, item);
    };
    TextPoll.prototype = new Poll;
    TextPoll.prototype.constructor = OptionPoll;
    TextPoll.prototype.evalVote = function (vote) {
        vote.choice = vote.choice[0];
    };
    TextPoll.prototype.getResult = function () {
        return {
            votes: this.votes,
            voteType: this.voteType
        };
    };
    module.exports = TextPoll;

})();
