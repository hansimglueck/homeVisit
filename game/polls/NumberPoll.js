(function() {
    'use strict';

    /*
     so ein NumberPoll erwartet nur votes mit genau einer choice...
     ich denke, falls mehrere Zahlen abgefragt werden, werden das einzelne Polls

     der multiplier macht auch nicht wirklich sinn, wird deshalb ausser acht gelassen
     */

    var Poll = require('./Poll');
    var OptionPoll = require('./OptionPoll');
    var logger = require('log4js').getLogger("NumberPoll");

    var NumberPoll = function (item) {
        this.sum = 0;
        Poll.call(this, item);
    };
    NumberPoll.prototype = new Poll;
    NumberPoll.prototype.constructor = OptionPoll;
    NumberPoll.prototype.evalVote = function (vote) {
        vote.choice = parseFloat(vote.choice[0]);
        logger.debug("parseFloat="+vote.choice);
        logger.debug("undefined="+(isNaN(vote.choice)));
        if (isNaN(vote.choice)) {
            this.abstentions++;
        } else {
            this.sum += vote.choice;
        }
    };
    NumberPoll.prototype.getResult = function () {
        var minVal = this.getMin(), maxVal = this.getMax();
        if (typeof minVal === 'undefined') {
            minVal = 0;
        }
        if (typeof maxVal === 'undefined') {
            maxVal = 0;
        }
        return {
            sum: this.sum,
            average: this.getAverage().toFixed(2),
            minVal: minVal.toFixed(2),
            maxVal: maxVal.toFixed(2),
            votes: this.votes,
            voteType: this.voteType
        };
    };
    NumberPoll.prototype.getAverage = function() {
        return this.sum/(this.votes.length-this.abstentions);
    };
    NumberPoll.prototype.getMin = function() {
        var min = this.votes.filter(function(v) {
            return !isNaN(v.choice);
        }).sort(function (a, b) {
            return a.choice - b.choice;
        })[0];
        if (typeof min !== 'undefined') {
            return min.choice;
        }
    };
    NumberPoll.prototype.getMax = function() {
        var max = this.votes.filter(function(v) {
            return !isNaN(v.choice);
        }).sort(function (b, a) {
            return a.choice - b.choice;
        })[0];
        if (typeof max !== 'undefined') {
            return max.choice;
        }
    };

    module.exports = NumberPoll;

})();
