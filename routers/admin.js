const express = require('express');
const router = express.Router();

// Models
const Voter = require('../models/voter.js');
const Candidate = require('../models/candidate.js');

// Get voter of lrn
router.get('/searchVoter/:lrn', async (req, res) => {
    const voter = await Voter.findOne({lrn: req.params.lrn});

    if(!voter)
        res.send('Voter not found.');

    res.send(voter);
});

// Activate voter of lrn
router.put('/activateVoter/:lrn', async (req, res) => {
    const voter = await Voter.findOneAndUpdate({lrn: parseInt(req.params.lrn)}, {canVote: true}, {new: true});

    if(!voter){
        res.send('Voter was not found from the database...');
    }else{
        const activatedVoter = await voter.save();
        res.send(activatedVoter);
    }
});

// Nominate new candidate
router.post('/nominateCandidate', async (req, res) => {
    var candidate = await Candidate.findOne({lrn: req.body.lrn})

    if(candidate){
        res.send(`Candidate was already nominated as ${candidate.position}.`);
        return;
    }

    candidate = new Candidate({
        lrn: req.body.lrn,
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        gradeLevel: req.body.gradeLevel,
        section: req.body.section,
        position: req.body.position,
        votes: 0
    });

    const nomindatedCandidate = await candidate.save()
        .then(product => res.send(product))
        .catch(error => res.send(error.message));
});

module.exports = router;