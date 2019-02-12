const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const _ = require('lodash');
const router = express.Router();

const {Candidate, validate} = require('../models/candidate');
const {Voter} = require('../models/voter');
const Receipt = require('../models/receipt');

// Get Candidate with LRN
router.get('/:lrn', async (req, res) => {
    const candidate = await Candidate.findOne({lrn: req.params.lrn});

    res.send(candidate);
})

router.get('/', async (req, res) => {
    const candidates = {
        presidents: await Candidate
        .find({position: "President"}),
        vicePresidents: await Candidate
        .find({position: "Vice President"}),
        secretaries: await Candidate
        .find({position: "Secretary"}),
        auditors: await Candidate
        .find({position: "Auditor"}),
        treasurers: await Candidate
        .find({position: "Treasurer"}),
        pios: await Candidate
        .find({position: "PIO"})
    }

    res.send(candidates);
});

// Tally Candidates on Position
router.get('/tally/:position', async (req, res) => {
    const candidates = await Candidate
        .find({position: req.params.position})
        .sort({votes: -1});

    res.send(candidates);
});

// Get all candidates
router.get('/tally', async (req, res) => {
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

    // Checking
    let candidate = await Candidate.findOne(_.pick(req.body, ['lrn']));
    if(candidate)
        return res.status(400).send({message: `Candidate ${candidate.lrn} already nominated.`})

    candidate = await Candidate.findOne(_.pick(req.body, ['position', 'party']));
    if(candidate)
        return res.status(400).send({message: `Someone is already nominated for ${candidate.position} on the ${candidate.party} party.`})

    // Nominate Candidate
    candidate = new Candidate(_.pick(req.body,
        ['lrn','fullName', 'party','section', 'gradeLevel', 'position', 'votes']));

    candidate = await candidate.save()
        .then(result => res.send({result: result, message: 'Candidate nominated.'}))
        .catch(error => res.send(error));
});

// Update candidate
router.put('/updateCandidate/:id', [auth, admin], async (req, res) => {
    // Validate sent data
    const {error} = validate(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);

    // Checking
    let candidate = await Candidate.findOne({_id: {$ne: req.params.id}, lrn: req.body.lrn});
    if(candidate)
        return res.status(400).send({message: `Candidate ${req.body.lrn} already nominated.`})

    candidate = await Candidate.findOne({_id: {$ne: req.params.id}, position: req.body.position,party: req.body.party});
    if(candidate)
        return res.status(400).send({message: `Someone is already nominated for ${candidate.position} on the ${candidate.party} party.`})

    // Find candidate with given id, and Update
    candidate = await Candidate.findOneAndUpdate({_id: req.params.id},_.pick(req.body,
        ['lrn','fullName', 'party','section', 'gradeLevel', 'position', 'votes']),
        {useFindAndModify: false,new: true})

    if(!candidate)
        return res.status(404).send('Candidate with the given id was not found from the database.');

    candidate = await candidate.save()
        .then(result => res.send({result: result, message: 'Candidate updated.'}))
        .catch(error => res.send(error));
});

// Record Voted Candidates
router.put('/voteCandidates', auth, async (req, res) => {
    const votes = req.body.votes;

    const voter = await Voter.findOne({lrn: req.body.voterLRN});
    if (voter.canVote == false)
        return res.status(403).send({message: "Voter cannot vote yet, contact admin for help."});
    
    if (voter.voteReceiptID != null)
        return res.status(403).send({message: 'Access denied, voter has already voted.'});

    // Validation: Look for the candidates first..
    for(i = 0; i < votes.length;i++){
        await Candidate
            .findOneAndUpdate({lrn: votes[i]},{$inc: {votes:1}})
            .catch((error) => {console.log(error)})
    }

    // Creates receipt
    let receipt = new Receipt(_.pick(req.body,
        ['voterLRN', 'votes']));

    await Voter.findOneAndUpdate(
        {lrn:receipt.voterLRN},
        {voteReceiptID: receipt._id});

    receipt = await receipt.save()
        .then(result => res.send(result))
        .catch(error => res.send(error));

    voter.voterReceiptID = receipt._id;
    voter.save();

    res.send({result: receipt, message: 'Votes are succesfully recorded.'});
});

// Remove Candidate
router.delete('/removeCandidate/:id', [auth, admin], async (req, res) => {
    const candidate = await Candidate
        .findByIdAndRemove(req.params.id)
        .catch((error) => {res.send(error)});

    if(!candidate)
        return res.status(404).send({message: "Candidate not found."});

    res.send({result: candidate, message: 'Candidate Removed.'});
});

module.exports = router;