(function() {
    'use strict';

    var OptionPoll = require('./OptionPoll');
    require('../../homevisit_components/stringFormat');

    var Agreement = function (item) {
        this.gettext = require('../gettext');
        this.voteOptions = [
            {
                value: 'yes',
                text: this.gettext.gettext('Yes')
            },
            {
                value: 'no',
                text: this.gettext.gettext('No')
            }
        ];
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
        this.wsContent.playerIds = this.playerIds;
    };
    Agreement.prototype.getResult = function () {
        var result = OptionPoll.prototype.getResult.call(this);
        var fullfilled = false;
        if (result.voteOptions[0].percent > 99 && result.voteOptions[0].value === "yes") {
            fullfilled = true;
        }
        var resText;
        if (fullfilled) {
            resText = this.gettext.gettext('The alliance is fullfilled.');
        }
        else {
            resText = this.gettext.gettext('The alliance is neglected.');
        }
        var positivePlayerIds = result.votes.filter(function(vote){
            return vote.choice.indexOf('yes') !== -1;
        }).map(function(vote){
            return vote.playerId;
        });
        return {
            text: resText,
            fullfilled: fullfilled,
            complete: !this.open,
            positivePlayerIds: positivePlayerIds,
            voteType: this.voteType
        };
    };

    module.exports = Agreement;

})();
