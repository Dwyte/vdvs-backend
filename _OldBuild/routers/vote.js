const express = require('express');
const SHA256 = require('crypto-js/sha256');
const database = require('./database.js');
const router = express.Router();

const mongoose = require('mongoose');
const Candidate = require('../models/candidate.js');
const Position = require('../models/position.js');
const Voter = require('../models/voter.js');
const Receipt = require('../models/receipt.js');

// const voters = database.voters;
// var election = database.election;
// var voteReceipts = database.voteReceipts;

// Render Vote page
router.get('/', async (req, res) => {
    const candidates = await Candidate.find();
    const positions = await Position.find();

    res.render('../views/vote.pug',  {election: {positions: positions, candidates: candidates}});
});

router.get('/receipt/:voterReceiptLRN', async (req, res) => {
    //const voteReceipt = voteReceipts.find(r => r.id === req.params.voteReceiptID);
    const receipt = await Receipt.findOne({lrn:req.params.voterReceiptLRN});

    if(!receipt){
        res.send('Receipt not found');
        return;
    }7

    receipt.votedCandidates.forEach(id => {
        
    });

    res.render('../views/voteReceipt.pug', {voteReceipt: receipt});
})

// Record Vote
router.put('/', async (req, res) => {

    // Check if the Voter is registered in DB, and verify if all info's match.
    const voter = await Voter.findOneAndUpdate({lrn: parseInt(req.body.lrn)});

    if(!voter){
        res.send("Voter was not found from the database");
        return;
    }

    if(!ValidateVoterInformation(req.body.info, voter)){
        res.send("Voter Validation Failed");
        return;
    }

    // If Voter has already voted
    if(await hasVoterAlreadyVoted(voter.lrn)){
        res.send('Voter already Voted');
        return;
    }

    var votes = req.body.votes;
    console.log("VOTES:",JSON.stringify(votes))
    var votedCandidates = [];

    for(i = 0; i < votes.length; i++){
        var votedCandidate = await Candidate.findOneAndUpdate({id:votes[i]});

        if(!votedCandidate)
            console.log("Candidate Not Found!");

        console.log("BEFORE:", JSON.stringify(votedCandidate));

        votedCandidate.votes += 1;

        const result = await votedCandidate.save();

        console.log("BEFORE:", JSON.stringify(result));

        votedCandidates.push(result._id);
    }

    console.log("VOTES:",JSON.stringify(votedCandidates))

    // Create Receipt
    var receipt = new Receipt({
        lrn: voter.lrn ,
        timestamp: new Date, 
        votedCandidates: votedCandidates
    });

    const result = await receipt.save();

    voter.voteReceiptID = receipt._id;

    res.send(String(result.lrn));
});

async function hasVoterAlreadyVoted(voterLRN){
    return await Voter.findOne({lrn: parseInt(voterLRN)}).voteReceiptID != null;
}

async function ValidateVoterInformation(voterInfo, voterFromDataBase){
    //const voterFromDataBase = voters.find(v => v.lrn === parseInt(voterInfo.lrn));

    if(voterInfo.fullName != voterFromDataBase.fullName){
        console.log("Name Doesn't matched");
        return false;
    }
    if(voterInfo.gradeLevel != voterFromDataBase.gradeLevel){
        console.log("Grade Level Doesn't matched");
        return false;
    }

    if(voterInfo.section != voterFromDataBase.section){
        console.log("Section Doesn't matched");
        return false;
    }
    
    return true;
}


module.exports = router;