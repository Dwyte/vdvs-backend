const auth = require('../middleware/auth');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

const Receipt = require('../models/receipt');
const {Voter} = require('../models/voter');

// Get Receipt
router.get('/:receiptID', async (req, res) => {
    const receipt = await Receipt.findById(req.params.receiptID)

    res.send(receipt);
});

// Create Receipt
router.post('/createReceipt',auth ,async (req, res) => {
    let receipt = new Receipt(_.pick(req.body,
        ['voterLRN', 'votes']));

    await Voter.findOneAndUpdate(
        {lrn:receipt.voterLRN},
        {voteReceiptID: receipt._id});

    receipt = await receipt.save()
        .then(result => res.send(result))
        .catch(error => res.send(error));
});

module.exports = router;