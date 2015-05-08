var mongoConnection = require('../homevisit_components/mongo/mongoConnection.js');

function makeItTawan(recId, cb) {
    console.log("i will make recording "+recId+" to the pleasure of tawan!");
    var tawan = [];
    mongoConnection(function (db) {
        db.collection('recordings').find({"recordingId": recId}).toArray(function (err, recs) {
            if (err) {
                return err;
            }
            var sid = recs[0].sessionId;
            tawan = recs.filter(function (rec) {
                return rec.name === "poll" && rec.data.type === "customOptions" && rec.data.results.rid !== null;
            }).map(function (rec) {
                var array = rec.data.results.voteOptions.sort(function (a, b) {
                    return a.value > b.value
                }).map(function (opt) {
                    return parseInt(opt.percent)
                });
                return {id: rec.data.results.rid, data: array}
            });
            recs.filter(function (rec) {
                return rec.name === "answers"
            })[0].data.answers.forEach(function (answer) {
                    var array = [];
                    var cnt = (answer.type === "fingers") ? 6 : 2;
                    var j = 0;
                    for (var i = -1; i < cnt; i++) {
                        j = i;
                        if (i === -1) j = cnt;
                        array[j] = answer.answers.filter(function (a) {
                            return a == i;
                        }).length;
                    }
                    tawan.push({id: answer.rid, data: array})
                });
            //console.dir(tawan);
            var realTawan = {'gruppe_ID':sid};
            tawan.forEach(function(t){
                realTawan[t.id.toString()] = t.data;
            });
            cb(realTawan);
        });
    });
}

module.exports = makeItTawan;
