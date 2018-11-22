const express = require('express');
const router = express.Router();

const {Candidate, validateCandidate} = require('../models/candidate.js');

// GET ALL CANDIDATES
router.get('/', async (req, res) => {
    const candidates = await Candidate.find();

    res.send(candidates)
});

// Nominate new candidate
router.post('/nominateCandidate', async (req, res) => {
    // Validate sent data
    const {error} = validateCandidate(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);

    // Look if candidate with lrn already nominated
    let candidate = await Candidate.findOne({lrn: req.body.lrn})
    if(candidate)
        return res.status(403).send(`Candidate was already nominated as ${candidate.position}.`);


    // Nominate Candidate
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
    candidate = await candidate.save();

    res.send(candidate);
});

// Update candidate
router.put('/updateCandidate/:id', async (req, res) => {
    // Validate sent data
    const {error} = validateCandidate(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);

    // find candidate with given id, and Update
    let  candidate = await Candidate.findOneAndUpdate({_id: req.params.id},{
        lrn: req.body.lrn,
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        gradeLevel: req.body.gradeLevel,
        section: req.body.section,
        position: req.body.position,
    })

    if(!candidate)
        return res.status(404).send('Candidate with the given id was not found from the database.');

    candidate = await candidate.save();
    res.send(candidate);
});

// Remove Candidate
router.delete('/removeCandidate/:id', async (req, res) => {
    const candidate = await Candidate.findByIdAndRemove(req.params.id);

    if(!candidate)
        return res.status(404).send('Candidate with the given id was not found.');

    res.send('Candidate removed.');
});

module.exports = router;