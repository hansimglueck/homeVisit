#!/usr/bin/env node

var mongoConnection = require('./mongoConnection');
var https = require('https');
var csv = require('csv');

var url = 'https://docs.google.com/spreadsheets/d/1Of_mzFBUkaG-VrKPthuWZqZLlwoxIJXG-pcwpgbLWto/pub?output=csv'
var csvParseOpts = {
    delimiter: ',',
    quote: '"',
    trim: true,
    columns: [
        'szenenTyp',
        'trigger',
        'wait',
        'text',
        'regie',
        'kommentare',
        'abstOptionen'
    ]
};

// insert deck
function insertDeck(seqItems) {
    mongoConnection(function(db) {
        var decks = db.collection('decks');
        decks.insert({
            title: 'Spreadsheet import ' + (new Date().toGMTString()),
            items: seqItems
        });
        db.close();
        console.log('Imported!');
    });
}

// parse data
function parseCsv(csvData) {
    csv.parse(csvData, csvParseOpts, function(err, output) {
        if (err === null) {
            var rowIndex = 0, seqItems = [];
            output.forEach(function(row) {
                // Skip header
                if (rowIndex > 0) {
                    // sequenceItem
                    var item = {
                        text: row.text,
                        wait: row.wait || 0
                    };

                    // type
                    if (row.szenenTyp === 'Karte')
                        item.type = 'card';
                    else if (row.szenenTyp === 'Sound')
                        item.type = 'sound';
                    else if (row.szenenTyp === 'Abstimmung') {
                        item.type = 'vote';
                        item.voteType = 'customOptions';
                        // parse voteOptions
                        item.voteOptions = row.abstOptionen.split('\n')
                            .map(function(s) { return s.trim(); })
                            .filter(function(s) { return s.length > 0; })
                            .map(function(s) {
                                return {
                                    text: s,
                                    value: ''
                                };
                            });
                    }
                    else {
                        // dummy/sonstiges
                        item.type = 'dummy';
                        item.highlight = 1;
                    }

                    // regieanweisung
                    if (row.regie.length > 0)
                        item.comment = row.regie;

                    // trigger
                    if (row.trigger === 'Go')
                        item.trigger = 'go';
                    else if (row.trigger === 'Follow')
                        item.trigger = 'follow';
                    else
                        item.trigger = 'go';

                    seqItems.push(item);

                    // abstimmungen folgen immer ein result item
                    if (item.type === 'vote') {
                        seqItems.push({
                            'wait' : 0,
                            'trigger' : 'go',
                            'type' : 'results',
                            'device' : 'default',
                            'sourceType' : 'previousStep',
                            'resultType' : 'Pie',
                            'scoreType' : 'noScore',
                            'autoGo' : false
                        });
                    }
                }
                ++rowIndex;
            });
            insertDeck(seqItems);
        }
        else {
            console.error('Could not parse CSV data: ', err);
        }
    });
}

// Fetch document from Google
console.log('Downloading Google spreadsheet...');
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
    console.error('Error: ' + e.message);
}).end();
