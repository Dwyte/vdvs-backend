const express = require('express');
const router = express.Router();

const Receipt = require('../models/receipt').Receipt;

// Get Receipt
router.get('/showReceipt/:receiptID', async (req, res) => {
    const receipt = await Receipt.findById(req.params.receiptID);

    res.send(receipt);
});

// Create Receipt
router.post('createReceipt', async (req, res) => {
    const receipt = new Receipt({
        lrn: req.body.voter.lrn,
        votedCandidate: req.body.votedCandidates
    });

    const createdReceipt = await receipt.save();

    req.body.voteReceiptID = createdReceipt._id;
    voter.save();

    res.send(createdReceipt);
});

module.exports = router;