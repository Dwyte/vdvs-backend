const SHA256 = require('crypto-js/sha256');

// Server
const express = require('express');
const router = express.Router();

// Database & Models
const mongoose = require('mongoose');
const Candidate = require('../models/candidate.js');
const Position = require('../models/position.js');


// Render Admin Dashboard
router.get('/', async (req, res) => {
    const candidates = await Candidate.find();
    const positions = await Position.find();

    res.render('../views/admin.pug', {election: {positions: positions, candidates: candidates}});
});

// Nominate new candidate
router.put('/nominate/', async (req, res) => {
    var position = await Position.findOne({name: req.body.positionName.replace(/\s/g, '').toLowerCase()})

    if(!position){
        position = new Position({ 
            name: req.body.positionName.replace(/\s/g, '').toLowerCase(),
            winnerQty: req.body.winnerQty,
        });
        const newPosition = await position.save();
        console.log("New Position:", newPosition);
    }else{
        console.log("Position Exists");
    }

    var candidate = await Candidate.findOne({name: req.body.candidateName.replace(/\s/g, '').toLowerCase()})

    if(candidate){
        console.log(`${req.body.candidateName} is already nominated: ${candidate}`);
    }else{
        candidate = new Candidate({
            id: SHA256(req.body.candidateName + Date.now()).toString().substr(0,6),
            name: req.body.candidateName.replace(/\s/g, '').toLowerCase(),
            position: position.name,
            votes: 0,
        })

        const newCandidate = await candidate.save()
        console.log("Candidate Created:", newCandidate)
    };

    res.send("Candidate Nominated");
});

// Update Candidate Name
router.put('/update/:candidateID', async (req, res) => {
    const result = await Candidate.update({id: req.params.candidateID},{
        $set:{
            name: req.body.newName.replace(/\s/g, '').toLowerCase(),
            id: SHA256(req.body.candidateName + Date.now()).toString().substr(0,6)
        }
    })

    console.log(result);

    res.send("Updated Candidate Name");
});

// Remove Candidate
router.delete('/remove/:candidateID', async (req, res) => {
    const result = await Candidate.deleteOne({id: req.params.candidateID})

    console.log(result);

    res.send("Candidate Removed");
});

module.exports = router;