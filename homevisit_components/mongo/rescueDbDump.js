// rescue script for processing a db dump file
// 1) picks a single deck
// 2) deletes all items which are either
//  a: not referenced by deck or
//  b: bigger than 5000 chars
// 3) saves result as new dump

var fs = require('fs');

var obj = JSON.parse(fs.readFileSync('broken_dump_2015_04_27b.json'));

var newDecks = [];
obj.decks.forEach(function(deck) {
    if (deck._id === '55394371b5d889662a64677a') {
        newDecks.push(deck);
    }
});
var referencedItems = newDecks[0].items;

var newItems = [];
obj.items.forEach(function(item) {
    if (referencedItems.indexOf(item._id) === -1)
        return;
    if (JSON.stringify(item).length < 5000) {
        newItems.push(item);
    }
    else {
        console.log(item._id + ' war wichtig!');
        var index = referencedItems.indexOf(item._id);
        newDecks[0].items.splice(index, 1);
    }
});

console.dir([
    'newDecks: ' + newDecks.length,
    'newItems: ' + newItems.length,
]);

var newJson = JSON.stringify({
    decks: newDecks,
    items: newItems,
    gameconfs: obj.gameconfs
}, null, 2)

fs.writeFileSync('fixed.json', newJson)
