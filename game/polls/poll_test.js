var OptionPoll = require('./OptionPoll');
var NumberPoll = require('./NumberPoll');

var game = {
    a: 10,
    b: function (res) {
        console.log("game-cb");
        console.log(res);
        console.log(this.a);
    }
};

var polls = [];

test = new OptionPoll({
    opts: ["customOptions"],
    voteOptions: [{text: "A"}, {text: "B"}, {text: "C"}],
    maxVotes: 5
});
polls[test.id] = test;

test.onFinish(game, game.b);
console.log(test.vote({playerId: 0, choice: [1,2]}));
console.log(test.vote({playerId: 1, choice: [1,0]}));
console.log(test.vote({playerId: 3, choice: [0,2]}));
console.log(test.vote({playerId: 2, choice: [0,1]}));
console.log(test.vote({playerId: 4, choice: [2,2]}));
console.log(test.getResult());

console.log("--------------------");
test2 = new NumberPoll();
polls[test2.id] = test2;
console.log(test2.voteType);
console.log(test2.vote());
console.log(test2.vote({playerId: 0, choice: 1}));
console.log(test2.vote({playerId: 1, choice: 1}));
console.log(test2.vote({playerId: 3, choice: 1}));
console.log(test2.vote({playerId: 2, choice: 0}));
console.log(test2.getResult());

console.log();
