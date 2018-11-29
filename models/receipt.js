const mongoose = require('mongoose');

const receiptSchema = mongoose.Schema({
    voterLRN: {
        type: Number,
        require: true
    },
    votedCandidates: [{
        type: Number,
        require: true
    }]
})

const Receipt = mongoose.model('Receipt', receiptSchema);

module.exports = Receipt;