const express = require('express');
const router = express.Router();

// Models
const {Voter, validateVoter} = require('../models/voter');

router.get('/', (req, res) => {
    res.send('Testing');
});

// Get voter of lrn
router.get('/searchVoter/:lrn', async (req, res) => {
    const voter = await Voter.findOne({lrn: req.params.lrn}).populate('voteReceiptID');

    if(!voter)
        return res.status(404).send('The voter with the given lrn was not found');

    res.send(voter);
});

// Activate voter of lrn
router.put('/activateVoter/:lrn', async (req, res) => {
    const voter = await Voter.findOneAndUpdate(
        {lrn: parseInt(req.params.lrn)}, 
        {canVote: true}, 
        {useFindAndModify: false,new: true});

    if(!voter)
        return res.status(404).send('Voter was not found from the database...');

    const activatedVoter = await voter.save();
    res.send(activatedVoter);
});

module.exports = router;