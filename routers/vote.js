const express = require('express');
const database = require('./database.js');
const router = express.Router();

const voters = database.voters;
var election = database.election;

router.get('/', (req, res) => {
    res.render('../views/vote.pug', {election : election});
});

router.put('/:lrn', (req, res) => {

    const voter = GetVoterFromDB(req.params.lrn, req.body.info)

    if(voter == null)
        return;

    if(hasVoterAlreadyVoted(req.params.lrn)){
        console.log('Voter Already Voted');
        return;
    }

    var votes = req.body.votes;
    var votedCandidates = [];

    election.forEach(element => {
        if(element.quantity > 1){
            for(i = 0; i < element.quantity && votes.length != 0; i++){
                var candidate = element.candidates.find(c => c.id == votes[0])
                candidate.votes += 1;
                votedCandidates.push(candidate);
                votes.shift();
            }
        }
        else{
            var candidate = element.candidates.find(c => c.id == votes[0])
                candidate.votes += 1;
                votedCandidates.push(candidate);
                votes.shift();
        }
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