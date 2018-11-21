const express = require('express');
const router = express.Router();

const Candidate = require('../models/candidate.js');
const Receipt = require('../models/receipt.js');
const Voter = require('../models/voter.js');

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
        if(error){
            res.send(error);
            return;
        }else if(!result){
            res.send('Voter was not found  from the database..');
        }else if(!result.canVote){
            res.send('Voter cannot vote yet, contact admin for activation');
        }else if(result.voteReceiptID != null){
            res.send('Voter has already voted');
        }else{
            RecordVotes(req.body.votes);
            res.send(await CreateReceipt(result, req.body.votes));
        }
    });
});

async function RecordVotes(votes){
    for(i = 0; i < votes.length;i++){
        const candidate = await Candidate.findOneAndUpdate(
            {lrn: votes[i]}, 
            {$inc:{votes: 1}}, 
            {useFindAndModify:false});

        candidate.save();
    }
}

async function CreateReceipt(voter, votesArray){
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