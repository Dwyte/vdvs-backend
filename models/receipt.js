const mongoose = require('mongoose');

const receiptSchema = mongoose.Schema({
    lrn: {
        type: Number,
        require: true
    },
    votedCandidates: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'candidate',
        require: true
    }
})

const Receipt = mongoose.model('Receipt', receiptSchema);

module.exports = Receipt;