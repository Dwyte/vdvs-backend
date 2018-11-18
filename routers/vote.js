const express = require('express');
const SHA256 = require('crypto-js/sha256');
const database = require('./database.js');
const router = express.Router();

const voters = database.voters;
var election = database.election;
var voteReceipts = database.voteReceipts;


// Render Vote page
router.get('/', (req, res) => {
    res.render('../views/vote.pug', {election : election});
});

router.get('/receipt/:voteReceiptID',(req, res) => {
    const voteReceipt = voteReceipts.find(r => r.id === req.params.voteReceiptID);

    if(!voteReceipt){
        res.send('Receipt not found');
        return;
    }

    res.render('../views/voteReceipt.pug', {voteReceipt: voteReceipt});
})

// Record Vote
router.put('/', (req, res) => {

    // Check if the Voter is registered in DB, and verify if all info's match.
    const voter = GetVoterFromDB(req.body.info)

    // If not, cancel operation.
    if(voter == null){
        res.send('Voter was not found in the database, pleace double check your info.');
        return;
    }

    // If Voter has already voted
    if(hasVoterAlreadyVoted(voter.lrn)){
        res.send('Voter already Voted');
        return;
    }

    
    var votes = req.body.votes;
    var votedCandidates = [];

    votes.forEach(vote => {
        var votedCandidate = election.candidates.find(c => c.id === vote);

        votedCandidate.votes += 1;

        votedCandidates.push(votedCandidate);
    });

    // Create Receipt
    var receipt = {id: null, voterLRN: voter.lrn ,timestamp: new Date, votedCandidates: votedCandidates}
    voter.voteReceiptID = receipt.id = SHA256(JSON.stringify(receipt)).toString().substr(0,12);
    voteReceipts.push(receipt);

    res.send(receipt.id)
});

function hasVoterAlreadyVoted(voterLRN){
    return voters.find(v => v.lrn === parseInt(voterLRN)).ballotResult != null;
}

function GetVoterFromDB(voterInfo){
    const voterFromDataBase = voters.find(v => v.lrn === parseInt(voterInfo.lrn));

    if(!voterFromDataBase){
        console.log("Voter is not registered onto the database");
        return null;
    }

    if(voterInfo.fullName != voterFromDataBase.fullName){
        console.log("Name Doesn't matched");
        return null;
    }
    if(voterInfo.gradeLevel != voterFromDataBase.gradeLevel){
        console.log("Grade Level Doesn't matched");
        return null;
    }

    if(voterInfo.section != voterFromDataBase.section){
        console.log("Section Doesn't matched");
        return null;
    }
    
    return voterFromDataBase;
}

module.exports = router;