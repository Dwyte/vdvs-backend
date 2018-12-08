const mongoose = require('mongoose');
const Joi = require('joi');

const candidateSchema = new mongoose.Schema({
    lrn: {type:Number, require: true, unique: true},
    fullName: {type: String, require: true},
    gradeLevel: {type: Number, min: 7, max: 12, require: true},
    section: {type: String, require: true},
    position: {type: String, require: true},
    votes: {type: Number, default: 0}
});

const Candidate = mongoose.model('Candidate', candidateSchema);

function validate(candidate){
    const schema = {
        lrn: Joi.number().required(),
        fullName: Joi.string().required(),
        gradeLevel: Joi.number().min(7).max(12).required(),
        section: Joi.string().required(),
        position: Joi.string().required(),
        votes: Joi.number().default(0)
    }

    return Joi.validate(candidate, schema);
}

module.exports = {
    Candidate: Candidate,
    validate: validate
};