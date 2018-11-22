const express = require('express');
const router = express.Router();

const Candidate = require('../models/candidate.js').Candidate;
const Receipt = require('../models/receipt.js').Receipt;
const Voter = require('../models/voter.js').Voter;

// GET ALL CANDIDATES
router.get('/', async (req, res) => {
    const candidates = await Candidate.find();

    res.send(candidates)
});

// RECORD VOTES
router.put('/submitVote', async (req, res) => {
    Voter.findOne({
        lrn: req.body.lrn,
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        gradeLevel: req.body.gradeLevel,
        section: req.body.section,
    }, async (error, result) => {
        if(error)
            return res.send(error);
            
        if(!result)
            return res.status(404).send('Voter was not found  from the database..');

        if(!result.canVote)
            return res.status(400).send('Voter cannot vote yet, contact admin for activation');

        if(result.voteReceiptID != null)
            return res.status(401).send('Voter has already voted');
        
        recordVotes(req.body.votes);
        res.send(await createReceipt(result, req.body.votes));
    });
});

async function recordVotes(votes){
    for(i = 0; i < votes.length;i++){
        const candidate = await Candidate.findOneAndUpdate(
            {lrn: votes[i]}, 
            {$inc:{votes: 1}}, 
            {useFindAndModify:false});

        candidate.save();
    }
}

async function createReceipt(voter, votesArray){
    const receipt = new Receipt({
        lrn: voter.lrn,
        timestamp: new Date,
        votedCandidates: votesArray
    });

    const createdReceipt = await receipt.save();

    voter.voteReceiptID = createdReceipt._id;
    voter.save();

    return createdReceipt;
}

module.exports = router;