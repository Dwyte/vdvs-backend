const express = require('express');
const router = express.Router();

const voters = [
    {lrn: 108187060250, fullName: "xanderdwightmartinez", gradeLevel: 12, section: "computerprogramminga", ballotResult: null}
]

var election = [
    { position: "President" , candidates: [
        {id: 1, name: "Mosquida", votes: 0 },
        {id: 2, name: "Valdez", votes: 0 },
        {id: 3, name: "Eleserio", votes: 0} 
    ], quantity: 1},
    { position: "Vice President" , candidates: [
        {id: 4, name: "Shandy", votes: 0 },
        {id: 5, name: "Salera", votes: 0 },
        {id: 6, name: "Laiya", votes: 0} 
    ], quantity: 1},
    { position: "Secretary" , candidates: [
        {id: 7, name: "Briones", votes: 0 },
        {id: 8, name: "Ternate", votes: 0 },
        {id: 9, name: "Bengilo", votes: 0 } 
    ], quantity: 1},
    { position: "Srgnt & Arms" , candidates: [
        {id: 10, name: "Cruz", votes: 0 },
        {id: 11, name: "De Jesus", votes: 0 },
        {id: 12, name: "Mendoza", votes: 0 } 
    ], quantity: 2}
]

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