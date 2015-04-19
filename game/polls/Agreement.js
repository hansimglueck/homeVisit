var OptionPoll = require('./OptionPoll');

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
Agreement.prototype.getResult = function () {
    var result = OptionPoll.prototype.getResult.call(this);
    var fullfilled = false;
    if (result.voteOptions[0].percent > 99 && result.voteOptions[0].value=="yes") fullfilled = true;
    var resText = "The Agreement on " + this.agreementType;
    resText += fullfilled ? " is fullfilled." : " is neglected.";
    return {
        text: resText,
        fullfilled: fullfilled,
        complete: !this.open
    }
};

module.exports = Agreement;
