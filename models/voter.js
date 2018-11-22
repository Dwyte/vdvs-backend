const mongoose = require('mongoose');
const Joi = require('joi');

const voterSchema = mongoose.Schema({
    lrn: {type: Number, require: true},
    firstName: {type: String, require: true},
    middleName: String,
    lastName: {type: String, require: true},
    gradeLevel: {type: Number, min: 7, max: 12, require: true},
    section: {type: String, require: true},
    canVote: {type: Boolean, default: false},
    voteReceiptID: {type: String, default: null}
});

const Voter = mongoose.model('Voter', voterSchema);

function validateVoter(voter){
    const schema = {
        lrn: Joi.number().required(),
        firstName: Joi.string().required(),
        middleName: Joi.string(),
        lastName: Joi.string().required(),
        gradeLevel: Joi.number().min(7).max(12).required(),
        section: Joi.string().required(),
        canVote: Joi.bool().default(false),
        voteReceiptID: Joi.string().default(null)
    }

    return Joi.validate(voter, schema);
}

module.exports = {
    Voter: Voter,
    validateVoter: validateVoter
};