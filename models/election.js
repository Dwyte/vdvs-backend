const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
    hasBegun: {type: Boolean, default: false},
    hasEnded: {type: Boolean, default: false}
});

const Election = mongoose.model('Election', electionSchema);

module.exports = Election;