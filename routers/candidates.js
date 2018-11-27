const express = require('express');
const router = express.Router();

const {Candidate, validateCandidate} = require('../models/candidate');

// Get all candidates
router.get('/', async (req, res) => {
    const presidentCandidates = await Candidate
    .find({position: "President"})
    .sort({gradeLevel: -1});

    const vicePresCandidates = await Candidate
        .find({position: "Vice President"})
        .sort({gradeLevel: -1});

    const secretaryCandidates = await Candidate
        .find({position: "Secretary"})
        .sort({gradeLevel: -1});

    const candidates = {
        presidents: presidentCandidates,
        vicePresidents: vicePresCandidates,
        secretaries: secretaryCandidates
    }

    res.send(candidates);
});

// Nominate new candidate
router.post('/nominateCandidate', async (req, res) => {
    // Validate sent data
    const {error} = validateCandidate(req.body);

    // Nominate Candidate
    let candidate = new Candidate({
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
    let candidate = await Candidate.findOneAndUpdate({_id: req.params.id},{
        lrn: req.body.lrn,
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        gradeLevel: req.body.gradeLevel,
        section: req.body.section,
        position: req.body.position,
    },{useFindAndModify: false,new: true})

    if(!candidate)
        return res.status(404).send('Candidate with the given id was not found from the database.');

    candidate = await candidate.save();
    res.send(candidate);
});

// Record Voted Candidates
router.put('/recordVotedCandidates', (req, res) => {
    var candidatesVoted = [];

    // Validation: Look for the candidates first..
    for(i = 0; i < votes.length;i++){
        const candidate = await Candidate.findOne({lrn: votes[i]});

        if(!candidate)
            return res.status(404).send(`No candidate found with the LRN of ${votes[i]}`);

        candidatesVoted.push(candidate);
    }

    // If all of them are existing and valid, now record the votes
    candidatesVoted.forEach(candidate => {
        candidate.votes += 1;
        candidate.save();
    });

    res.send(candidatesVoted);
});

// Remove Candidate
router.delete('/removeCandidate/:id', async (req, res) => {
    const candidate = await Candidate.findByIdAndRemove(req.params.id);

    if(!candidate)
        return res.status(404).send('Candidate with the given id was not found.');

    res.send(candidate);
});

module.exports = router;