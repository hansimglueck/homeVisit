#!/usr/bin/env node

(function() {
    'use strict';

    require('colors');
    require('../homevisit_components/stringFormat');

    var mongoConnection = require('../homevisit_components/mongo/mongoConnection'),
        https = require('https'),
        csv = require('csv'),
        crypto = require('crypto'),
        Q = require('q'),
        _ = require('underscore');

    // parse arguments
    var args = process.argv.slice(2),
        deckTitle = args[0],
        url = args[1];
    if (typeof deckTitle === 'undefined') {
        console.error('Error: No title given!'.red);
        process.exit(1);
    }
    if (typeof url === 'undefined') {
        url = 'https://docs.google.com/spreadsheets/d/1FmZuCtTrGx_03p8A3kWPxY-vBSuTWRcMYEX3W932em4/pub?output=csv';
        console.log('No URL given: using default spreadsheet URL.');
    }

    // columns in order of spreadsheet
    var columns = [
        'szenenTyp',
        'trigger',
        'wait',
        'text',
        'regie',
        'mcnote',
        'kommentare',
        'voteOptions',
        'techNotes',
        'website',
        // translation fields
        'text_en',
        'mcnote_en',
        'voteOptions_en',
        'text_cs',
        'mcnote_cs',
        'voteOptions_cs',
        'text_da',
        'mcnote_da',
        'voteOptions_da',
        'text_fr',
        'mcnote_fr',
        'voteOptions_fr',
        'text_nl',
        'mcnote_nl',
        'voteOptions_nl',
        'text_no',
        'mcnote_no',
        'voteOptions_no',
        'text_pl',
        'mcnote_pl',
        'voteOptions_pl',
        'text_pt',
        'mcnote_pt',
        'voteOptions_pt'
    ];

    // columns we use to build the item hash
    var hashFields = [
        'szenenTyp',
        'trigger',
        'wait',
        'text',
        'regie',
        'mcnote',
        'voteOptions'
    ];

    // languages we support
    var langCodes = [
        'de',
        'en',
        'cs',
        'da',
        'fr',
        'nl',
        'no',
        'pl',
        'pt'
    ];

    // build unique hash value using relevant fields
    function calcHash(row) {
        var hash;
        hash = crypto.createHash('sha1');
        hashFields.forEach(function(key) {
            hash.update(row[key], 'utf8');
        });
        return hash.digest('hex');
    }

    function parseVoteOptions(voteOptions) {
        return voteOptions
            .split('\n')
            .map(function(s) { return s.trim(); })
            .filter(function(s) { return s.length > 0; });
    }

    // build an item from a spreadsheet row
    function buildItemFromRow(row, hash) {
        var item = {
            _id: hash,
            wait: row.wait || 0,
            device: ['default'],
            text: {},
            mcnote: {
                de: row.mcnote,
                en: row.mcnote_en,
                cs: row.mcnote_cs,
                da: row.mcnote_da,
                fr: row.mcnote_fr,
                nl: row.mcnote_nl,
                no: row.mcnote_no,
                pl: row.mcnote_pl,
                pt: row.mcnote_pt
            },
            highlight: 1 // mark for review
        };

        // type
        if (row.szenenTyp === 'Karte') {
            item.type = 'card';
            item.text = {
                de: row.text,
                en: row.text_en,
                cs: row.text_cs,
                da: row.text_da,
                fr: row.text_fr,
                nl: row.text_nl,
                no: row.text_no,
                pl: row.text_pl,
                pt: row.text_pt
            };
        }

        // sound
        else if (row.szenenTyp === 'Sound') {
            item.type = 'sound';
            item.text = {
                de: row.text,
                en: row.text_en,
                cs: row.text_cs,
                da: row.text_da,
                fr: row.text_fr,
                nl: row.text_nl,
                no: row.text_no,
                pl: row.text_pl,
                pt: row.text_pt
            };
        }

        else if (row.szenenTyp === 'Abstimmung') {
            item.type = 'inlineSwitch';

            var voteOptions_en = parseVoteOptions(row.voteOptions_en),
                voteOptions_cs = parseVoteOptions(row.voteOptions_cs),
                voteOptions_da = parseVoteOptions(row.voteOptions_da),
                voteOptions_fr = parseVoteOptions(row.voteOptions_fr),
                voteOptions_nl = parseVoteOptions(row.voteOptions_nl),
                voteOptions_no = parseVoteOptions(row.voteOptions_no),
                voteOptions_pl = parseVoteOptions(row.voteOptions_pl),
                voteOptions_pt = parseVoteOptions(row.voteOptions_pt);

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
                            text: {
                                de: row.text,
                                en: row.text_en,
                                cs: row.text_cs,
                                da: row.text_da,
                                fr: row.text_fr,
                                nl: row.text_nl,
                                no: row.text_no,
                                pl: row.text_pl,
                                pt: row.text_pt
                            },
                            device: ['default'],
                            percentsForFinish: '100',
                            voteType: 'customOptions',
                            voteOptions: parseVoteOptions(row.voteOptions).map(function(s, i) {
                                return {
                                    text: {
                                        de: s,
                                        en: voteOptions_en[i],
                                        cs: voteOptions_cs[i],
                                        da: voteOptions_da[i],
                                        fr: voteOptions_fr[i],
                                        nl: voteOptions_nl[i],
                                        no: voteOptions_no[i],
                                        pl: voteOptions_pl[i],
                                        pt: voteOptions_pt[i]
                                    },
                                    value: ''
                                };
                            })
                        },
                        {
                            wait: 0,
                            trigger: 'go',
                            type: 'results',
                            text: {},
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
            item.text = {
                de: row.text,
                en: row.text_en,
                cs: row.text_cs,
                da: row.text_da,
                fr: row.text_fr,
                nl: row.text_nl,
                no: row.text_no,
                pl: row.text_pl,
                pt: row.text_pt
            };
        }

        // regieanweisung
        if (row.regie.length > 0) {
            item.comment = row.regie;
        }

        // trigger
        if (row.trigger === 'Follow') {
            item.trigger = 'follow';
        }
        else {
            item.trigger = 'go';
        }

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

    // extract translations from row
    function setTranslations(item, row) {
        _.forEach(langCodes, function(langCode) {
            // text
            var propName = langCode === 'de' ? 'text' : 'text_%s'.format(langCode);
            item.text[langCode] = row[propName];
            // mcnote
            propName = langCode === 'de' ? 'mcnote' : 'mcnote_%s'.format(langCode);
            item.mcnote[langCode] = row[propName];
            // voteOptions
            if (item.type === 'inlineSwitch') {
                var voteItem = item.inlineDecks[0].items[0];
                if (voteItem.type === 'vote') {
                    propName = langCode === 'de' ? 'voteOptions' : 'voteOptions_%s'.format(langCode);
                    var voteOptions = parseVoteOptions(row[propName]);
                    _.each(voteItem.voteOptions, function(option, i) {
                        option.text[langCode] = voteOptions[i];
                    });
                }
            }
        });
        return item;
    }

    // parse data
    var csvParseOpts = {
        delimiter: ',',
        quote: '"',
        trim: true,
        columns: columns
    };
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
                        if (index < 2) {
                            return;
                        }

                        // find item by hash
                        var hash = calcHash(row);
                        var items = db.collection('items');
                        var findOne = Q.nbind(items.findOne, items);
                        var promise = findOne({ _id: hash })
                            // check if this item was already imported earlier
                            .then(function(item) {

                                // cache miss: build new item
                                if (item === null) {
                                    item = buildItemFromRow(row, hash);
                                    ++newCount;
                                }

                                // always update translations
                                item = setTranslations(item, row);

                                return saveItem(db, item)
                                    .then(function() {
                                        ++totalCount;
                                        // finally we just return the
                                        // hashes that are being saved in
                                        // the decks item property (plus
                                        // the index to reconstruct the
                                        // order)
                                        return {
                                            index: index - 1,
                                            hash: hash
                                        };
                                    });
                            });
                        promises.push(promise);
                    });

                    // save deck to db
                    return Q.allSettled(promises).then(function(results) {

                        // make sure all items were built
                        _.forEach(results, function(r) {
                            if (r.state !== 'fulfilled') {
                                throw new Error(r.reason.stack);
                            }
                        });

                        // reorder using index info
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
    https.get(url, function(res) {
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

})();
