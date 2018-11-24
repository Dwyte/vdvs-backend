const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const Election = require('../models/election');
const {Candidate, validateCandidate} = require('../models/candidate');

router.post('/createElection', async (req, res) => {
    let election = await Election.findOne();

    if(election)
        return res.status(400).send('There is an on-going election..');
    
    election = new Election();

    res.send(await election.save());
});

router.put('/beginElection', async (req, res) => {
    let election = await Election.findOneAndUpdate({},{hasBegun: true},{useFindAndModify: false, new: true});

    if(!election)
        return res.status(404).send('There is no current election.');

    res.send(election);
});

router.put('/endElection', async (req, res) => {
    const election = await Election.findOneAndUpdate({},
        {
            hasEnded: true,
            winners: {
                President: await Candidate.find({position: "President"}).sort({votes: -1}).limit(1),
                VicePresident: await Candidate.find({position: "Vice President"}).sort({votes: -1}).limit(1),
                Secretary: await Candidate.find({position: "Secretary"}).sort({votes: -1}).limit(1)
            }
        },
        {useFindAndModify: false, new: true});

    if(!election)
        return res.status(404).send('There is no current election.');

    res.send(election);
});

router.delete('/deleteElection', async (req,res) => {
    let election = await Election.findOne();

    if(!election)
        return res.status(404).send('There is no current election.');

    election.db.dropDatabase()
        .then(() => res.send('Database collections has been deleted.'));
});

module.exports = router;