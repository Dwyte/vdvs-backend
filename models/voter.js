const mongoose = require('mongoose');

const voterSchema = mongoose.Schema({
    lrn: Number,
    fullName: String,
    gradeLevel: Number,
    section: String,
    voteReceiptID: String
})

const Voter = mongoose.model('Voter', voterSchema);

module.exports = Voter;