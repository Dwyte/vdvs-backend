const express = require('express');
const router = express.Router();

const Candidate = require('../models/candidate.js');

router.get('/', async (req, res) => {
    const candidates = await Candidate.find();

    res.send(candidates)
});

router.put('/submitVote', async (req, res) => {

    for(i = 0; i < req.body.votes.length;i++){
        const candidate = await Candidate.findOneAndUpdate({lrn: req.body.votes[i]}, {$inc:{votes: 1}}, {useFindAndModify:false})

        candidate.save();
    }

    res.send(".");
});

module.exports = router;