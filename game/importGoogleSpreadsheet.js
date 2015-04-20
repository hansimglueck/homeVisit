#!/usr/bin/env node

var mongoConnection = require('../server/mongoConnection'),
    https = require('https'),
    csv = require('csv'),
    crypto = require('crypto'),
    colors = require('colors'),
    Q = require('q'),
    _ = require('underscore');

require('../homevisit_components/stringFormat');

// parse arguments
var args = process.argv.slice(2),
   deckTitle = args[0],
   url = args[1];

if (typeof deckTitle === 'undefined') {
    console.error('Error: No title given!'.red);
    process.exit(1);
}

if (typeof url === 'undefined') {
    url = 'https://docs.google.com/spreadsheets/d/1Of_mzFBUkaG-VrKPthuWZqZLlwoxIJXG-pcwpgbLWto/pub?output=csv';
    console.log('No URL given: using default spreadsheet URL.');
}

var columns = [
    'szenenTyp',
    'trigger',
    'wait',
    'text',
    'regie',
    'mcnote',
    'kommentare',
    'abstOptionen'
];

var contentFields = _.without(columns, 'kommentare');

var csvParseOpts = {
    delimiter: ',',
    quote: '"',
    trim: true,
    columns: columns
};

// build unique hash value using relevant fields
function calcHash(row) {
    var hash;
    hash = crypto.createHash('sha1');
    contentFields.forEach(function(key) {
        hash.update(row[key], 'utf8');
    });
    return hash.digest('hex');
}

// build an item from a spreadsheet row
function buildItemFromRow(row, hash) {
    var item = {
        _id: hash,
        wait: row.wait || 0,
        device: ['default'],
        mcnote: row.mcnote,
        highlight: 1 // mark for review
    };

    // type
    if (row.szenenTyp === 'Karte') {
        item.type = 'card';
        item.text = row.text;
    }

    // sound
    else if (row.szenenTyp === 'Sound') {
        item.type = 'sound';
        item.text = row.text;
    }

    else if (row.szenenTyp === 'Abstimmung') {
        // abstimmung has multiple steps, we exploit inlineswitch
        item.type = 'inlineSwitch';

        // parse voteOptions
        var voteOptions = row.abstOptionen.split('\n')
            .map(function(s) { return s.trim(); })
            .filter(function(s) { return s.length > 0; })
            .map(function(s) {
                return {
                    text: s,
                    value: ''
                };
            });

        item.inlineDecks = [
            {
                title: 'inline',
                description: 'inline-strang',
                inline: true,
                items: [
                    {
                        wait: 0,
                        trigger: 'go',
                        type: 'vote',
                        text: row.text,
                        device: ['default'],
                        percentsForFinish: '100',
                        voteType: 'customOptions',
                        voteOptions: voteOptions
                    },
                    {
                        wait: 0,
                        trigger: 'go',
                        type: 'results',
                        text: '',
                        device: ['default'],
                        sourceType: 'previousStep',
                        resultType: 'Pie',
                        scoreType: 'optionScore'
                    }
                ]
            }
        ];
    }
    else {
        // dummy/sonstiges
        item.type = 'dummy';
        item.text = row.text;
    }

    // regieanweisung
    if (row.regie.length > 0)
        item.comment = row.regie;

    // trigger
    if (row.trigger === 'Follow')
        item.trigger = 'follow';
    else
        item.trigger = 'go';

    return item;
}

// save item
function saveItem(db, item) {
    var items = db.collection('items');
    var update = Q.nbind(items.update, items);
    return update({ _id: item._id }, item, { upsert: true });
}

// save deck (create new or update existing)
function saveDeck(db, seqItems) {
    var decks = db.collection('decks'), query = { title: deckTitle };

    var countDecks = Q.nbind(decks.count, decks);
    return countDecks(query).then(function(count) {
        // more than 1 deck with this title
        if (count > 1) {
            throw new Error(
                ("Sorry... but there is more than one deck with this title. " +
                 "Don't know which one you mean!").red);
        }

        var itemData = { title: deckTitle, items: seqItems };

        // update existing deck
        if (count === 1) {
            console.log('Updating existing deck.');
            var updateOne = Q.nbind(decks.updateOne, decks);
            return updateOne(query, itemData);
        }

        // create new deck
        console.log('Creating new deck.');
        var insertOne = Q.nbind(decks.insertOne, decks);
        return insertOne(itemData);
    });
}

// parse data
function parseCsv(csvData) {
    csv.parse(csvData, csvParseOpts, function(err, output) {
        if (err === null) {
            var promises = [], totalCount = 0, newCount = 0;

            var deferred = Q.defer();
            mongoConnection(function(db) { deferred.resolve(db); });

            deferred.promise.then(function(db) {

                // iterate over all rows
                output.forEach(function(row, index) {

                    // skip first two rows
                    if (index < 2)
                        return;

                    // find item by hash
                    var hash = calcHash(row);
                    var items = db.collection('items');
                    var countItems = Q.nbind(items.count, items);
                    var promise = countItems({ _id: hash }).then(function(count) {
                        ++totalCount;
                        if (count === 1) {
                            // cache hit: easy! just return item id
                            return {
                                index: index - 1,
                                hash: hash
                            };
                        }
                        else {
                            // cache miss: build new item and save it
                            ++newCount;
                            return saveItem(db, buildItemFromRow(row, hash)).then(function(item) {
                                return {
                                    index: index - 1,
                                    hash: hash
                                };
                            });
                        }
                    });
                    promises.push(promise);

                });

                // save deck to db
                return Q.allSettled(promises).then(function(results) {

                    // make sure all items were built
                    var ok = _.all(results, function(r) { return r.state === 'fulfilled'; });
                    if (!ok) {
                        console.error(results);
                        throw new Error('Something went wrong!'.red);
                    }

                    // save deck
                    else {
                        var items = _.map(_.sortBy(_.pluck(results, 'value'), 'index'), function(v) {
                            return v.hash;
                        });
                        saveDeck(db, items).then(function() {
                            console.log('Successfully imported %s items of which %s are new!'.format(
                                String(totalCount).bold, String(newCount).bold).green);
                            db.close();
                        }).catch(function(err) {
                            throw new Error(err);
                        }).done();
                    }

                });

            }).done();

        }
        else {
            console.error('Could not parse CSV data: '.red, err);
        }
    });
}

// Fetch spreadsheet
console.log('Downloading spreadsheet...');
var req = https.get(url, function(res) {
    var csvData = '';
    res
        .on('data', function(chunk) {
            csvData += chunk;
        })
        .on('end', function() {
            parseCsv(csvData);
        });
}).on('error', function(e) {
    console.error(('Error: ' + e.message).red);
}).end();
