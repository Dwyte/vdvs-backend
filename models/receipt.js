const mongoose = require('mongoose');

const receiptSchema = mongoose.Schema({
    lrn: Number,
    timestamp: Date,
    votedCandidates: [String]
})

const Receipt = mongoose.model('Receipt', receiptSchema);

module.exports = Receipt;