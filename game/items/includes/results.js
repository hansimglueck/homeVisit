(function () {
    'use strict';

    var playerManager = require('../../playerManager');
    var gettext = require('../../gettext');
    var gameRecording = require('../../gameRecording');

    module.exports = {
        executeItem: function () {
            //der score wird hier ermittelt, da das result ja auch zB an den printer geschickt werden könnte, dann käme playerManager.result() garnicht dran
            this.data = {};
            switch (this.sourceType) {
                case "previousStep":
                    this.data = this.previous.getData();
                    if (this.data !== null) {
                        this.data.dataSource = this.sourceType
                    };
                    break;
                case "positivePlayerScore":
                    var posScoreArr = playerManager.players.filter(function (player, id) {
                        player.playerId = id;
                        return player.score > 0 && player.joined;
                    });
                    var sum = posScoreArr.reduce(function (prev, curr) {
                        return prev + curr.score;
                    }, 0);
                    this.data.voteType = "customOptions"; //fürs recording...
                    this.data.text = gettext.gettext('The division of the cake');
                    this.data.dataSource = this.sourceType;
                    this.data.voteOptions = posScoreArr.map(function (player) {
                        return {
                            value: player.playerId,
                            result: player.score,
                            votes: player.score,
                            text: player.playerId,
                            percent: (player.score / sum * 100).toFixed(1),
                            playercolor: gettext.gettext(player.playercolor)
                        };
                    });
                    break;
                default:
                    break;
            }
            if (this.data !== null) {
                this.data.rid = this.rid;
                gameRecording.poll(this.data);
                var score, best;
                switch (this.scoreType) {
                    case "optionScore":
                        //checke, welche votes eine option mit .correctAnswer in der choice haben
                        //und verteile +1 für jede korrekte choice, -1 für die anderen
                        var correct = this.data.voteOptions.filter(function (opt) {
                            return opt.correctAnswer;
                        }).map(function (opt) {
                            return opt.value;
                        });
                        this.data.votes.forEach(function (vote) {
                            score = -1;
                            vote.choice.forEach(function (ch) {
                                if (correct.indexOf(ch) !== -1) {
                                    score = 1;
                                }
                            });
                            // TODO translation
                            playerManager.score(vote.playerId, score, "correct Answer");
                        });
                        break;
                    case "majorityScore":
                        //checke, welche votes die voteOption[0] der results (sortiert) in der choice haben
                        //und verteile +1 dafür, -1 für die anderen
                        //TODO: bei mehr al zwei gleichguten Antworten werden nur zwei berücksichtigt...
                        best = [this.data.voteOptions[0].value];
                        if (typeof this.data.voteOptions[1] !== "undefined") if (this.data.voteOptions[0].votes === this.data.voteOptions[1].votes) {
                            best.push(this.data.voteOptions[1].value);
                        }
                        this.data.votes.forEach(function (vote) {
                            score = -1;
                            vote.choice.forEach(function (ch) {
                                if (best.indexOf(ch) > -1) {
                                    score = 1;
                                }
                            });
                            // TODO translation
                            playerManager.score(vote.playerId, score, "opportunism");
                        });
                        break;
                    case "guessedBest":
                        best = playerManager.getPlayerGroup("best")[0].playerId;
                        this.data.votes.forEach(function (vote) {
                            score = 0;
                            vote.choice.forEach(function (ch) {
                                if (best === ch) {
                                    score = 3;
                                }
                            });
                            // TODO translation
                            playerManager.score(vote.playerId, score, "guessed Best");
                        });
                        break;
                    case "noScore":
                        break;
                    default:
                        break;
                }
            }

            this.mapToDevice();
        },
        getWsContent: function () {
            return {
                data: this.data,
                type: this.type,
                silent: this.silent,
                resultType: this.resultType,
                color: this.color,
                ratedVote: this.ratedVote,
                resultColors: this.resultColors
            };
        },
        getData: function () {
            return this.data;
        }
    };

})();
