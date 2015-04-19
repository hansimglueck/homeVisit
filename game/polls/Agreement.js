var OptionPoll = require('./OptionPoll');
var playerManager = require('../playerManager.js');

Agreement = function (item) {
    this.voteOptions = [{value: "yes", text: "Yes"}, {value: "no", text: "No"}];    //deep clone
    this.voteType = "customOptions";
    OptionPoll.call(this, item);
};
Agreement.prototype = new OptionPoll;
Agreement.prototype.constructor = Agreement;
Agreement.prototype.init = function () {
    OptionPoll.prototype.init.call(this);
    this.maxVotes = this.playerIds.length;
    this.wsContent.type = "agreement";
    this.wsContent.agreementType = this.agreementType;
    this.wsContent.playerIds = this.playerIds
};

module.exports = Agreement;
