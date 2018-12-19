const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const _ = require('lodash');
const router = express.Router();

const {Candidate, validate} = require('../models/candidate');

// Get Candidate with LRN
router.get('/:lrn', async (req, res) => {
    const candidate = await Candidate.findOne({lrn: req.params.lrn});

    res.send(candidate);
})

// Tally Candidates on Position
router.get('/tally/:position', async (req, res) => {
    const candidates = await Candidate
        .find({position: req.params.position})
        .sort({votes: -1});

    res.send(candidates);
});

// Get all candidates
router.get('/', async (req, res) => {
    const candidates = {
        presidents: await Candidate
        .find({position: "President"})
        .sort({votes: -1}),
        vicePresidents: await Candidate
        .find({position: "Vice President"})
        .sort({votes: -1}),
        secretaries: await Candidate
        .find({position: "Secretary"})
        .sort({votes: -1}),
        auditors: await Candidate
        .find({position: "Auditor"})
        .sort({votes: -1}),
        treasurers: await Candidate
        .find({position: "Treasurer"})
        .sort({votes: -1}),
        pios: await Candidate
        .find({position: "PIO"})
        .sort({votes: -1})
    }

    res.send(candidates);
});

// Nominate new candidate
router.post('/nominateCandidate', [auth, admin], async (req, res) => {
    // Validate sent data
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error);

    // Nominate Candidate
    let candidate = new Candidate(_.pick(req.body,
        ['lrn','fullName', 'party','section', 'gradeLevel', 'position', 'votes']));

    candidate = await candidate.save()
        .then(result => res.send(result))
        .catch(error => res.send(error));
});

// Update candidate
router.put('/updateCandidate/:id', [auth, admin], async (req, res) => {
    // Validate sent data
    const {error} = validate(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);

    // find candidate with given id, and Update
    let candidate = await Candidate.findOneAndUpdate({_id: req.params.id},_.pick(req.body,
        ['lrn','fullName', 'party','section', 'gradeLevel', 'position', 'votes']),
        {useFindAndModify: false,new: true})

    if(!candidate)
        return res.status(404).send('Candidate with the given id was not found from the database.');

    candidate = await candidate.save()
        .then(result => res.send(result))
        .catch(error => res.send(error));
});

// Record Voted Candidates
router.put('/voteCandidates', auth, async (req, res) => {
    const votes = req.body.votes;
    var candidatesVoted = [];

    // Validation: Look for the candidates first..
    for(i = 0; i < votes.length;i++){
        const candidate = await Candidate.findById(votes[i]);

        if(!candidate)
            return res.status(404).send(`No candidate found with the ID of ${votes[i]}`);

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
router.delete('/removeCandidate/:id', [auth, admin], async (req, res) => {
    const candidate = await Candidate.findByIdAndRemove(req.params.id);

    if(!candidate)
        return res.status(404).send('Candidate with the given id was not found.');

    res.send(candidate);
});

module.exports = router;