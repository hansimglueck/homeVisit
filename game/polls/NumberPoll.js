(function() {
    'use strict';

    /*
     so ein NumberPoll erwartet nur votes mit genau einer choice...
     ich denke, falls mehrere Zahlen abgefragt werden, werden das einzelne Polls

     der multiplier macht auch nicht wirklich sinn, wird deshalb ausser acht gelassen
     */

    var Poll = require('./Poll');
    var OptionPoll = require('./OptionPoll');

    var NumberPoll = function (item) {
        this.sum = 0;
        Poll.call(this, item);
    };
    NumberPoll.prototype = new Poll();
    NumberPoll.prototype.constructor = OptionPoll;
    NumberPoll.prototype.evalVote = function (vote) {
        vote.choice = parseFloat(vote.choice[0]);
        this.sum += vote.choice;
    };
    NumberPoll.prototype.getResult = function () {
        return {
            sum: this.sum,
            average: this.getAverage().toFixed(2),
            minVal: this.getMin().toFixed(2),
            maxVal: this.getMax().toFixed(2),
            votes: this.votes
        };
    };
    NumberPoll.prototype.getAverage = function() {
        return this.sum/this.votes.length;
    };
    NumberPoll.prototype.getMin = function() {
        return this.votes.sort(function (a, b) {
            return a.choice - b.choice;
        })[0].choice;
    };
    NumberPoll.prototype.getMax = function() {
        return this.votes.sort(function (b, a) {
            return a.choice - b.choice;
        })[0].choice;
    };

    module.exports = NumberPoll;

})();
