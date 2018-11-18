const SHA256 = require('crypto-js/sha256');
const database = require('./database.js');
const express = require('express');
const router = express.Router();


const voters = database.voters;
var election = database.election;

// Render Admin Dashboard
router.get('/', (req, res) => {
    res.render('../views/admin.pug', {election: election});
});

// Nominate new candidate
router.put('/nominate/:candidate', (req, res) => {
    var position = election.positions.find(e => e.name.replace(/\s/g, '').toLowerCase() === req.body.name.replace(/\s/g, '').toLowerCase());

    if(!position){
        position = { 
            name: req.body.name,
            winnerQty: req.body.winnerQty,
        };
        election.positions.push(position);
    }else{
        console.log("Position Exists");
    }

    var candidate = election.candidates.find(c => c.name.replace(/\s/g, '').toLowerCase() === req.params.candidate.replace(/\s/g, '').toLowerCase());

    if(candidate){
        console.log("Candidate already nominated");
    }else{
        candidate = {
            id: SHA256(req.params.candidate.replace(/\s/g, '').toLowerCase()).toString().substr(0,6),
            name: req.params.candidate,
            position: position,
            votes: 0,
        }

        election.candidates.push(candidate);
    }
});

// Update Candidate Name
router.put('/update/:candidateID', (req, res) => {
    var candidate = election.candidates.find(c => c.id === req.params.candidateID);

    candidate.name = req.body.newName;
    candidate.id = SHA256(candidate.name.replace(/\s/g, '').toLowerCase()).toString().substr(0,6);

    res.send("Updated Candidate Name");
});

// Remove Candidate
router.delete('/remove/:candidateID', (req, res) => {
    var candidate = election.candidates.find(c => c.id === req.params.candidateID);

    election.candidates.splice(election.candidates.indexOf(candidate), 1);

    res.send("Candidate Removed");
});

module.exports = router;