const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    lrn: {type:Number, required: true},
    firstName: {type: String, required: true},
    middleName: {type: String, required: true},
    lastName: {type: String, required: true},
    gradeLevel: {type: Number, required: true},
    section: {type: String, required: true},
    position: {type: String, required: true},
    votes: Number
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;