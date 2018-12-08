const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

const Receipt = require('../models/receipt');

// Get Receipt
router.get('/:receiptID', async (req, res) => {
    const receipt = await Receipt.findById(req.params.receiptID)

    res.send(receipt);
});

// Create Receipt
router.post('/createReceipt',auth ,async (req, res) => {
    let receipt = new Receipt(_.pick(req.body,
        ['voterLRN', 'votedCandidates']));

    receipt = await receipt.save()
        .then(result => res.send(result))
        .catch(error => res.send(error));
});

module.exports = router;