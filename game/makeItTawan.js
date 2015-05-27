var homevisitQueries = require("./homevisitQueries");
var logger = require('log4js').getLogger("mit");


function makeItTawan(recId, cb) {
    logger.info("i will make recording " + recId + " to the pleasure of tawan!");
    var tawan = [];
    homevisitQueries.getRecording(recId, function (err, recording) {
        if (err) {
            return err;
        }
        var recs = recording[0].recordings;
        var sid = recording[0].sessionId;

        //optionPolls
        tawan = recs.filter(function (rec) {
            return rec.name === "poll" &&
                (rec.data.voteType === "customOptions" || rec.data.type === "customOptions") &&
                rec.data.results.rid !== null &&
                typeof rec.data.results.rid !== "undefined"
                && typeof rec.data.results.voteOptions !== "undefined";
        }).map(function (rec) {
            //console.dir(rec);
            var array = [];
            rec.data.results.voteOptions.sort(function (a, b) {
                return a.value > b.value
            }).forEach(function (opt) {
                array[opt.value] = parseInt(opt.percent)
            });
            return {id: rec.data.results.rid, data: array}
        });

        //numberPolls
        var tawan2 = recs.filter(function (rec) {
            return rec.name === "poll" && rec.data.type === "enterNumber" && rec.data.results.rid !== null && typeof rec.data.results.rid !== "undefined";
        }).map(function (poll) {
            var array = poll.data.results.votes.sort(function (a, b) {
                return a.playerId > b.playerId;
            }).map(function (vote) {
                return vote.choice;
            });
            return {id: poll.data.results.rid, data: array}
        });
        tawan = tawan.concat(tawan2);

        //textPolls
        tawan2 = recs.filter(function (rec) {
            return rec.name === "poll" && rec.data.type === "enterText" && rec.data.results.rid !== null && typeof rec.data.results.rid !== "undefined";
        }).map(function (poll) {
            var array = poll.data.results.votes.sort(function (a, b) {
                return a.playerId > b.playerId;
            }).map(function (vote) {
                return vote.choice;
            });
            return {id: poll.data.results.rid, data: array}
        });
        tawan = tawan.concat(tawan2);

        //teams in game
        var teamCntArray = recs.filter(function (rec) {
            return rec.name === "poll" && rec.data.results.rid !== null && typeof rec.data.results.rid !== "undefined" && rec.data.results.rid === 106;
        });
        var teamCnt = 8;
        if (teamCntArray.length > 0) {
            teamCnt = teamCntArray[0].data.results.votes.length;
        }

        //börse
        tawan2 = recs.filter(function (rec) {
            return rec.name === "poll" && rec.data.uid === 111;
        }).map(function (poll) {
            var inRoulette = 0;
            if (typeof poll.data.results !== "undefined" && typeof poll.data.results.positivePlayerIds !== "undefined") {
                inRoulette = poll.data.results.positivePlayerIds.length;
            }
            return {id: 111, data: [inRoulette, teamCnt-inRoulette]};
        });
        tawan = tawan.concat(tawan2);

        //schweigeminute
        var startTime = 0, stopTime = 0, silenceTime = 0;
        var startRec = recs.filter(function (rec) {
            return rec.data.uid === 55
        });
        if (startRec.length > 0) {
            startTime = startRec[0].absTimestamp;
        }
        var stopRec = recs.filter(function (rec) {
            return rec.data.uid === 57
        });
        if (stopRec.length > 0) {
            stopTime = stopRec[0].absTimestamp;
        }

        if (startTime + stopTime !== 0) {
            silenceTime = stopTime - startTime;
        }
        tawan.push({id: 55, data: silenceTime});

        //gesamtSpieldauer
        startTime = 0;
        stopTime = 0;
        var gameTime = 0;
        startRec = recs.filter(function (rec) {
            return rec.data.uid === 5
        });
        if (startRec.length > 0) {
            startTime = startRec[0].absTimestamp;
        }
        stopRec = recs.filter(function (rec) {
            return rec.data.uid === 142
        });
        if (stopRec.length > 0) {
            stopTime = stopRec[0].absTimestamp;
        }

        if (startTime + stopTime !== 0) {
            gameTime = stopTime - startTime;
        }
        tawan.push({id: 183, data: gameTime});

        //die mythos-entscheidung
        //roter knopf -> churchill
        //grüner knopf und kurz danach -> nix
        //sonst -> mythos
        //TODO: bis jetzt wurde der parameter (rot/grün) noch nicht aufgezeichnet...
        var mythos = 1;
        var gruen = recs.filter(function(rec){
            return rec.data.index === "75:0:0"
        });
        var rot = recs.filter(function(rec){
            return rec.data.index === "75:1:0"
        });
        var text = recs.filter(function(rec){
            return rec.data.uid === 62
        });

        if (rot.length > 0) {
            mythos = 2;
        } else if (gruen.length > 0) {
            if (gruen[0].absTimestamp - text.absTimestamp < 120) {
                mythos = 3;
            }
        }
        tawan.push({id: 62, data: mythos});

        //weitere Felder
        tawan.push({id: 181, data: recId});

        //MC-answers
        var answers = recs.filter(function (rec) {
            return rec.name === "answers"
        });
        var playerCnt = 15;
        if (answers.length > 0) {
            if (typeof answers[0].data.inGame === "undefined") {
                answers[0].data.inGame = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                answers[0].data.playerNames.forEach(function(playerName, id){
                    if (playerName.indexOf("Spieler") !== 0 && playerName.indexOf("Player") !== 0) {
                        answers[0].data.inGame[id] = 1;
                    }
                })
            }
            playerCnt = answers[0].data.inGame.reduce(function(prev, curr){
                return prev+curr;
            },0);
            tawan.push({id: 182, data:playerCnt});
            answers[0].data.answers.forEach(function (answer) {
                var array = [];
                var cnt = (answer.type === "fingers") ? 6 : 2;
                var j = 0;
                for (var i = -1; i < cnt; i++) {
                    j = i;
                    if (i === -1) j = cnt;
                    array[j] = answer.answers.filter(function (a, id) {
                        return (a === i) && (answers[0].data.inGame[id] === 1);
                    }).length;
                }
                tawan.push({id: answer.rid, data: array})
            });
        }
        //console.dir(tawan);
        var realTawan = {'gruppe_ID': sid};
        tawan.forEach(function (t) {
            realTawan[t.id] = t.data.toString();
        });
        cb(realTawan);
    });
}

module.exports = makeItTawan;
