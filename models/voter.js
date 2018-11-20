const mongoose = require('mongoose');

const voterSchema = mongoose.Schema({
    lrn: {type: Number, required: true},
    firstName: String,
    middleName: String,
    lastName: String,
    gradeLevel: Number,
    section: String,
    canVote: Boolean,
    voteReceiptID: String
})

const Voter = mongoose.model('Voter', voterSchema);

module.exports = Voter;