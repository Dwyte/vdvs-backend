const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();

const Election = require('../models/election');

// Get Election
router.get('/', async (req, res) => {
    const election = await Election.findOne();
    
    if(!election)
        return res.status(404).send('Election not found');
    
    res.send(election)
});


// Create Election
router.post('/createElection', [auth, admin], async (req, res) => {
    let election = await Election.findOne();

    if(election)
        return res.status(400).send('There is an on-going election..');
    
    election = new Election();

    res.send(await election.save());
});

// Begin Election
router.put('/beginElection', [auth, admin], async (req, res) => {
    let election = await Election.findOneAndUpdate({},{hasBegun: true},{useFindAndModify: false, new: true});

    if(!election)
        return res.status(404).send('Election not found');

    res.send(election);
});

// End Election
router.put('/endElection', [auth, admin], async (req, res) => {
    const election = await Election.findOneAndUpdate({},
        {hasEnded: true},
        {useFindAndModify: false, new: true});

    if(!election)
        return res.status(404).send('Election not found.');

    res.send(election);
});

// Drop Database
router.delete('/deleteElection', [auth, admin], async (req,res) => {
    let election = await Election.findOne();

    if(!election)
        return res.status(404).send('There is no current election.');

    election.db.dropDatabase()
        .then(() => res.send('Database collections has been deleted.'));
});

module.exports = router;