const express = require('express');
const router = express.Router();

const Receipt = require('../models/receipt');

// Get Receipt
router.get('/:receiptID', async (req, res) => {
    const receipt = await Receipt.findById(req.params.receiptID)

    res.send(receipt);
});

// Create Receipt
router.post('/createReceipt', async (req, res) => {
    const receipt = new Receipt({
        voterLRN: req.body.voterLRN,
        votedCandidates: req.body.votes
    });

    const createdReceipt = await receipt.save();

    res.send(createdReceipt);
});

module.exports = router;