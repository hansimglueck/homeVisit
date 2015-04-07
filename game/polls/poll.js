var hat = require('hat');

Poll = function (item) {
    //if (typeof item == "undefined") return;
    this.id = hat();
    this.votes = [];            //Objekte mit Eigenschaften .multiplier, .playerId, .choice (array of ids bei optionpoll, number bei numberPoll
    this.voteCount = 0;
    this.invalidVotes = 0;
    this.open = true;
    this.text = item ? item.text || "" : "";
    this.voteType = item ? item.opts[0] || "none" : "none";
    this.ratedVote = item ? item.flags ? item.flags[0] || false : false : false;
    this.time = item ? item.time || 0 : 0;
    this.voteMulti = item ? item.voteMulti || 1 : 1;
    this.percentsForFinish = item ? parseInt(item.opts[1]) || 100 : 100;
    this.maxVotes = 0;
    this.finishCallbacks = [];
    this.init();
};

Poll.prototype = {
    //option-array vorbereiten für bestimmte polls - countries, players, ...
    init: function () {
        this.prepareWsContent();
    },
    //Stimmen annehmen, direkt auswerten
    vote: function (vote) {
        if (typeof vote == "undefined") return false;
        if (!(this.open && this.checkVoteValid(vote))) return false;
        if (this.votes.filter(function (v) {
                return v.playerId == vote.playerId
            }).length > 0) return false;

        if (!(vote.choice instanceof Array)) {
            vote.choice = [vote.choice];
        }
        if (typeof vote.multiplier == "undefined") vote.multiplier = 1;
        this.evalVote(vote);
        this.votes.push(vote);
        if (this.maxVotes != 0 && this.votes.length >= this.maxVotes*this.percentsForFinish/100) this.finish();
        return true;
    },
    checkVoteValid: function (vote) {
        return !!(vote.hasOwnProperty("playerId") && vote.hasOwnProperty("choice"));
    },
    //Stimme auswerten
    evalVote: function () {
    },
    //Poll schliessen - abschliessende Auswertung (zB nicht abgegebene Stimmen zählen)
    //onFinish-callbacks ausführen
    finish: function () {
        this.open = false;
        var self = this;
        this.finishCallbacks.forEach(function (cb) {
            cb.fn.call(cb.scope, self.getResult());
        })
    },
    //zum callback-funktionen registrieren
    onFinish: function (scope, fn) {
        this.finishCallbacks.push({scope: scope, fn: fn});
    },
    //Result-Objekt ausgeben
    getResult: function () {

    },
    //Result als Text ausgeben
    getNiceResult: function () {

    },
    prepareWsContent: function() {
        this.wsContent = {
            type: "vote",
            pollId: this.id,
            text: this.text,
            voteMulti: this.voteMulti,
            ratedVote: this.ratedVote,
            voteType: this.voteType,
            time: this.time
        }
    },
    getWsContent: function() {
        return this.wsContent;
    },
    setMaxVotes: function(x) {
        this.maxVotes = x;
    },
    isWeighted: function() {
        return this.ratedVote;
    }
};

module.exports = Poll;
