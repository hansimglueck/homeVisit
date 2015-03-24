/**
 * Created by jeanbluer on 18.01.15.
 */
var mongoose = require('mongoose');

var VoteOptionSchema = new mongoose.Schema({
    text: String,
    value: String,
    followUp: String,
    score: Number,
    flags: [Boolean],
    checked: Boolean
});

var SequenceItemSchema   = new mongoose.Schema({
//    _deck: { type: mongoose.Schema.Types.ObjectId, ref: 'deck' },
//    _deck: { DeckSchema },
    sid: Number,
    trigger: String,
    wait: Number,
    text: String,
    type: String,
    time: Number,
    file: String,
    flags: [Boolean],
    opts: [String],
    voteOptions: [VoteOptionSchema],
    comments: [String],
    voteMulti: Number,
    device: String
});

var DeckSchema   = new mongoose.Schema({
    sid: Number,
    title: String,
    description: String,
    items: [SequenceItemSchema]
//    items: [{type: mongoose.Schema.Types.ObjectId, ref: 'sequenceItem'}]
});


// Export the Mongoose model
module.exports = mongoose.model('deck', DeckSchema);