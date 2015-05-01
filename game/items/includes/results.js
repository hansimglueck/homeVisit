var playerManager = require('../../playerManager');
var gettext = require('../../gettext');

module.exports = {
    executeItem: function () {
        //der score wird hier ermittelt, da das result ja auch zB an den printer geschickt werden könnte, dann käme playerManager.result() garnicht dran
        this.data = {};
        switch (this.sourceType) {
            case "previousStep":
                this.data = this.previous.getData();
                this.data.dataSource = this.sourceType;
                break;
            case "positivePlayerScore":
                var posScoreArr = playerManager.players.filter(function (player, id) {
                    player.playerId = id;
                    return player.score > 0 && player.joined;
                });
                var sum = posScoreArr.reduce(function (prev, curr) {
                    return prev + curr.score
                }, 0);
                this.data.text = gettext('The division of the cake');
                this.data.dataSource = this.sourceType;
                this.data.voteOptions = posScoreArr.map(function (player) {
                    return {
                        value: player.playerId,
                        result: player.score,
                        votes: player.score,
                        text: player.playerId,
                        percent: (player.score / sum * 100).toFixed(1),
                        playercolor: player.playercolor
                    }
                });
                break;
            default:
                break;
        }
        if (this.data !== null) switch (this.scoreType) {
            case "optionScore":
                //checke, welche votes eine option mit .correctAnswer in der choice haben
                //und verteile +1 für jede korrekte choice, -1 für die anderen
                var correct = this.data.voteOptions.filter(function (opt) {
                    return opt.correctAnswer
                }).map(function (opt) {
                    return opt.value
                });
                var score;
                this.data.votes.forEach(function (vote) {
                    score = -1;
                    vote.choice.forEach(function (ch) {
                        if (correct.indexOf(ch) != -1) score = 1;
                    });
                    // TODO translation
                    playerManager.score(vote.playerId, score, "correct Answer");
                });
                break;
            case "majorityScore":
                //checke, welche votes die voteOption[0] der results (sortiert) in der choice haben
                //und verteile +1 dafür, -1 für die anderen
                //TODO: bei zwei gleichguten Antworten wird nur eine berücksichtigt...
                var best = this.data.voteOptions[0].value;
                var score;
                this.data.votes.forEach(function (vote) {
                    score = -1;
                    vote.choice.forEach(function (ch) {
                        if (best == ch) score = 1;
                    });
                    // TODO translation
                    playerManager.score(vote.playerId, score, "opportunism");
                });
                break;
            case "guessedBest":
                var best = playerManager.getPlayerGroup("best")[0].playerId;
                var score;
                this.data.votes.forEach(function (vote) {
                    score = -1;
                    vote.choice.forEach(function (ch) {
                        if (best == ch) score = 1;
                    });
                    // TODO translation
                    playerManager.score(vote.playerId, score, "guessed Best");
                });
                break;
            case "noScore":
            default:
                break;
        }

        this.mapToDevice();
    },
    getWsContent: function () {
        var text = "";
        if (this.data !== null) text = this.data.text;
        return {
            data: this.data,
            type: this.type,
            text: text,
            silent: this.silent,
            resultType: this.resultType,
            color: this.color,
            ratedVote: this.ratedVote,
            resultColors: this.resultColors
        };
    },
    getData: function() {
        return this.data;
    }
} ;
