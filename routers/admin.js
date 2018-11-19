const SHA256 = require('crypto-js/sha256');
const database = require('./database.js');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// const voters = database.voters;
// var election = database.election;

const positionSchema = new mongoose.Schema({
    name: String,
    winnerQty: Number,
});

const Position = mongoose.model('Position', positionSchema);

const candidateSchema = new mongoose.Schema({
    id: String,
    name: String,
    position: String,
    votes: Number
});

const Candidate = mongoose.model('Candidate', candidateSchema);

// Render Admin Dashboard
router.get('/', async (req, res) => {
    const candidates = Candidate.find();
    const positions = Position.find();

    res.render('../views/admin.pug', {election: {positions: positions, candidates: candidates}});
});

// Nominate new candidate
router.put('/nominate/', async (req, res) => {
    //var position = election.positions.find(e => e.name.replace(/\s/g, '').toLowerCase() === req.body.name.replace(/\s/g, '').toLowerCase());
    var position = await Position.findOneAndUpdate({name: req.body.positionName.replace(/\s/g, '').toLowerCase()})

    if(!position){
        position = new Position({ 
            name: req.body.positionName.replace(/\s/g, '').toLowerCase(),
            winnerQty: req.body.winnerQty,
        });
        //election.positions.push(position);
        const newPosition = await position.save();
        console.log("New Position:", newPosition);
    }else{
        console.log("Position Exists");
    }

    //var candidate = election.candidates.find(c => c.name.replace(/\s/g, '').toLowerCase() === req.params.candidate.replace(/\s/g, '').toLowerCase());
    var candidate = await Candidate.findOneAndUpdate({name: req.body.candidateName.replace(/\s/g, '').toLowerCase()})

    if(candidate){
        console.log("Candidate already nominated");
    }else{
        candidate = new Candidate({
            id: SHA256(req.body.candidateName + Date.now()).toString().substr(0,6),
            name: req.body.candidateName,
            position: position,
            votes: 0,
        })

        //election.candidates.push(candidate);
        const newCandidate = await candidate.save()
        console.log("Candidate Created:", newCandidate)
    };

    res.send("Candidate Nominated");
});

// Update Candidate Name
router.put('/update/:candidateID', async (req, res) => {
    //var candidate = election.candidates.find(c => c.id === req.params.candidateID);
        // var candidate = await Candidate.findOneAndUpdate({id: req.params.candidateID})

        // candidate.name = req.body.newName;

        // candidate.id = SHA256(req.body.candidateName + Date.now()).toString().substr(0,6);

    const result = await Candidate.update({id: req.params.candidateID},{
        
    })

    console.log(result);

    res.send("Updated Candidate Name");
});

// Remove Candidate
router.delete('/remove/:candidateID', async (req, res) => {
    //var candidate = election.candidates.find(c => c.id === req.params.candidateID);
    const result = await Candidate.deleteOne({id: req.params.candidateID})

    //election.candidates.splice(election.candidates.indexOf(candidate), 1);

    console.log(result);

    res.send("Candidate Removed");
});

module.exports = router;