//testkommentar zum neu committen
var Poll = require('./Poll');

OptionPoll = function (item) {
    this.voteOptions = item.voteOptions ? JSON.parse(JSON.stringify(item.voteOptions)) : [];    //deep clone
    this.voteMulti = item.voteMulti || 1;
    Poll.call(this, item);
};
OptionPoll.prototype = new Poll;
OptionPoll.prototype.constructor = OptionPoll;
OptionPoll.prototype.init = function () {
    if (this.voteType == "customOptions") this.voteMulti = 1;
    this.voteOptions.forEach(function (opt) {
        opt.result = 0;
        opt.votes = 0;
    });
    this.prepareWsContent();
    this.wsContent.voteOptions = this.voteOptions.map(function(opt){return {text: opt.text, value: opt.value, checked: false}});
};
OptionPoll.prototype.evalVote = function (vote) {
    var self = this;
    if (typeof vote.multiplier == "undefined" || !this.ratedVote) vote.multiplier = 1;
    vote.choice.forEach(function (ch) {
        var option = self.voteOptions.filter(function(opt){return opt.value == ch})[0];
        option.result += vote.multiplier;
        option.votes += 1;
    });
};
OptionPoll.prototype.getResult = function () {
    var resultSum = this.voteOptions.reduce(function(prev, curr){return prev+curr.result},0);
    this.voteOptions.forEach(function(opt){opt.percent = (opt.result/resultSum*100).toFixed(1)});
    return {
        text: this.text,
        voteOptions: this.voteOptions.sort(function(a,b){return b.result- a.result}),
        votes: this.votes
    }
};

module.exports = OptionPoll;
