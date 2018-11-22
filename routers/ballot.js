const express = require('express');
const router = express.Router();

const Candidate = require('../models/candidate').Candidate;
const Receipt = require('../models/receipt').Receipt;
const Voter = require('../models/voter').Voter;

// GET ALL CANDIDATES
router.get('/', async (req, res) => {
    const presidentCandidates = await Candidate
        .find({position: "President"})
        .sort({gradeLevel: -1});

    const vicePresCandidates = await Candidate
        .find({position: "Vice President"})
        .sort({gradeLevel: -1});

    const secretaryCandidates = await Candidate
        .find({position: "Secretary"})
        .sort({gradeLevel: -1});

    const candidates = {
        presidents: presidentCandidates,
        vicePresidents: vicePresCandidates,
        secretaries: secretaryCandidates
    }

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
        
        error = await recordVotes(req.body.votes);
        if(error)
            return res.status(404).send(error);

        res.send(await createReceipt(result, req.body.votes));
    });
});

async function recordVotes(votes){
    candidatesVoted = [];

    // Validation: Look for the candidates first..
    for(i = 0; i < votes.length;i++){
        const candidate = await Candidate.findOne({lrn: votes[i].lrn, position: votes[i].position});

        if(!candidate)
            return `No candidate with the LRN of ${votes[i].lrn} was nominated as ${votes[i].position}`;

        candidatesVoted.push(candidate);
    }

    // If all of them are existing and valid, now record the votes
    candidatesVoted.forEach(candidate => {
        candidate.votes += 1;
        candidate.save();
    });

    return null;
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