const express = require('express');
const database = require('./database.js');
const router = express.Router();

const voters = database.voters;
var election = database.election;


// Render Vote page
router.get('/', (req, res) => {
    res.render('../views/vote.pug', {election : election});
});

// Record Vote
router.put('/:lrn', (req, res) => {

    // Check if the Voter is registered in DB, and verify if all info's match.
    const voter = GetVoterFromDB(req.params.lrn, req.body.info)

    // If not, cancel operation.
    if(voter == null){
        res.send('Voter was not found in the database, pleace double check your info.');
        return;
    }

    // If Voter has already voted
    if(hasVoterAlreadyVoted(req.params.lrn)){
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

    voter.ballotResult = votedCandidates;
    res.send(votedCandidates);
});

function hasVoterAlreadyVoted(voterLRN){
    return voters.find(v => v.lrn === parseInt(voterLRN)).ballotResult != null;
}

function GetVoterFromDB(voterLRN, voterInfoObject){
    const voterFromDataBase = voters.find(v => v.lrn === parseInt(voterLRN));

    if(!voterFromDataBase){
        console.log("Voter is not registered onto the database");
        return null;
    }

    if(voterInfoObject.fullName != voterFromDataBase.fullName){
        console.log("Name Doesn't matched");
        return null;
    }
    if(voterInfoObject.gradeLevel != voterFromDataBase.gradeLevel){
        console.log("Grade Level Doesn't matched");
        return null;
    }

    if(voterInfoObject.section != voterFromDataBase.section){
        console.log("Section Doesn't matched");
        return null;
    }
    
    return voterFromDataBase;
}

module.exports = router;