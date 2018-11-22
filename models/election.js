const mongoose = require('mongoose');
const Joi = require('joi');

const electionSchema = new mongoose.Schema({
    schoolYear: {type: String , require: true},
    isNominationClosed: {type: Boolean, default: false},
    isVotingClosed: {type: Boolean, default: false},
    results: {type: [String]}
});

const Election = mongoose.model('Election', electionSchema);

function validateElection(election){
    const schema = {
        schoolYear: Joi.string().required(),
        isNominationClosed: Joi.bool().default(false),
        isVotingClosed: Joi.bool().default(false),
        results: Joi.array()
    }

    return Joi.valid(election, schema);
}

module.exports = {
    Election: Election,
    validateElection: validateElection
};