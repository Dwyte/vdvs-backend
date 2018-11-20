const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    id: String,
    name: String,
    position: String,
    votes: Number
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;