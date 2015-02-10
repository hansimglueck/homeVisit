/**
 * Created by jeanbluer on 07.02.15.
 */
var mongoose = require('mongoose');

var typeMapSchema   = new mongoose.Schema({
    type: String,
    devices: [String]
});

var GameConfSchema   = new mongoose.Schema({
    role: {type: String, unique: true, required: true, dropDups: true},
    startDeckId: mongoose.Schema.Types.ObjectId,
    autostart: Boolean,
    playerCnt: Number,
    typeMapping: [typeMapSchema]
});

// Export the Mongoose model
module.exports = mongoose.model('gameConf', GameConfSchema);