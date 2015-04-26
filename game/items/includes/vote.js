var colors = require('colors');
var OptionPoll = require('../../polls/OptionPoll.js');
var NumberPoll = require('../../polls/NumberPoll.js');

module.exports = {
    test: "test",

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
            case "countryChoice":
                var lang = this.language;
                this.voteOptions = data.getEUcountries().map(function (c) {
                    return {value: c.id, text: c[lang]}
                });
                poll = new OptionPoll(this);
                break;

            case "enterNumber":
                poll = new NumberPoll(this);
                break;
            default:
                break;
        }
        if (typeof poll !== 'undefined') {
            poll.onFinish(this, function (result) {
                //game.trigger(-1, {data: 'go'})
                this.step(result);
            });
            this.poll = poll;
            //this.polls ist "static"
            this.polls[this.poll.id] = (this.poll);

            this.mapToDevice();
        }
        else {
            console.log('Warning: Vote without voteOptions!'.red);
        }
    },
    getData: function () {
        if (typeof this.poll !== "undefined") return this.poll.getResult();
        else return null;
    },
    getWsContent: function () {
        return this.poll.getPollWsContent();
    }
};
