const SHA256 = require('crypto-js/sha256');
const database = require('./database.js');
const express = require('express');
const router = express.Router();


const voters = database.voters;
var election = database.election;

router.get('/', (req, res) => {
    res.render('../views/admin.pug', {election: election});
});

router.put('/:position', (req, res) => {
    var position = election.find(e => e.position.replace(/\s/g, '').toLowerCase() === req.params.position.replace(/\s/g, '').toLowerCase());
    
    if(!position){
        election.push({
            position: req.params.position,
            candidates: [],
            quantity: req.body.quantity,
        });

        position = election.find(e => e.position.replace(/\s/g, '').toLowerCase() === req.params.position.replace(/\s/g, '').toLowerCase());
    }else{
        console.log("Position Exists");
    }

    var candidate = position.candidates.find(c => c.name.replace(/\s/g, '').toLowerCase() === req.body.candidate.replace(/\s/g, '').toLowerCase());

    if(candidate){
        console.log("Candidate already nominated");
    }else{
        candidate = {
            id: SHA256(req.body.candidate.replace(/\s/g, '').toLowerCase()).toString().substr(0,6),
            name: req.body.candidate,
            votes: 0
        }

        position.candidates.push(candidate);
    }
    
    console.log(JSON.stringify(election));
});

router.put('/update/:candidateID', (req, res) => {
    var position = election.find(e => e.position.replace(/\s/g, '').toLowerCase() === req.body.position.replace(/\s/g, '').toLowerCase());
    var candidate = position.candidates.find(c => c.id === req.params.candidateID);

    candidate.name = req.body.newName;
    candidate.id = SHA256(candidate.name.replace(/\s/g, '').toLowerCase()).toString().substr(0,6);

    res.send("Updated Candidate Name");
});

router.delete('/remove/:candidateID', (req, res) => {
    var position = election.find(e => e.position.replace(/\s/g, '').toLowerCase() === req.body.position.replace(/\s/g, '').toLowerCase());
    var candidate = position.candidates.find(c => c.id === req.params.candidateID);

    position.candidates.splice(position.candidates.indexOf(candidate), 1);

    res.send("Candidate Removed");
});

module.exports = router;