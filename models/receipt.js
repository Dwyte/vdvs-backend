const mongoose = require('mongoose');
const Joi = require('joi');

const receiptSchema = mongoose.Schema({
    lrn: {
        type: Number,
        require: true
    },
    votedCandidates: {
        type: [Object],
        require: true
    }
})

const Receipt = mongoose.model('Receipt', receiptSchema);

function validateReceipt(receipt){
    const schema = {
        lrn: Joi.number().required(),
        timestamp: Joi.date().required(),
        votedCandidates: Joi.array().required()
    }

    return Joi.validate(receipt, schema)
}

module.exports = {
    Receipt: Receipt,
    validateReceipt: validateReceipt
};