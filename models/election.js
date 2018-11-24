const mongoose = require('mongoose');
const Joi = require('joi');

const electionSchema = new mongoose.Schema({
    hasBegun: {type: Boolean, default: false},
    hasEnded: {type: Boolean, default: false},
    winners: {type: [Object] , default: []}
});

const Election = mongoose.model('Election', electionSchema);

module.exports = Election;