var Poll = require('./Poll');

OptionPoll = function (item) {
    Poll.call(this, item);
};
OptionPoll.prototype = new Poll;
OptionPoll.prototype.constructor = OptionPoll;
OptionPoll.prototype.init = function () {
    this.voteOptions = this.voteOptions ? JSON.parse(JSON.stringify(this.voteOptions)) : [];    //deep clone
    this.voteMulti = this.voteMulti || 1;
    if (this.voteType == "customOptions") this.voteMulti = 1;
    this.voteOptions.forEach(function (opt) {
        opt.result = 0;
        opt.votes = 0;
    });
    this.prepareWsContent();
    var lang = require('../gameConf').conf.language;
    this.wsContent.voteOptions = this.voteOptions.map(function(opt){
        return {
            text: opt.text[lang],
            value: opt.value,
            checked: false
        }
    });
};
OptionPoll.prototype.evalVote = function (vote) {
    var self = this;
    if (typeof vote.multiplier == "undefined" || !this.ratedVote) vote.multiplier = 1;
    vote.choice.forEach(function (ch) {
        var option = self.voteOptions.filter(function(opt){return opt.value == ch});
        if (option.length>0) {
            option[0].result += vote.multiplier;
            option[0].votes += 1;
        }
    });
};
OptionPoll.prototype.getResult = function () {
    var resultSum = this.voteOptions.reduce(function(prev, curr){return prev+curr.result},0);
    var lang = require('../gameConf').conf.language;
    this.voteOptions.forEach(function(opt) {
        opt.percent = (opt.result/resultSum*100).toFixed(0);
        if (typeof opt.text === 'object') {
            opt.text = opt.text[lang];
        }
    });
    return {
        voteOptions: this.voteOptions.sort(function(a,b){return b.result- a.result}),
        votes: this.votes,
        complete: !this.open,
        ratedVote: this.ratedVote
    }
};

module.exports = OptionPoll;
