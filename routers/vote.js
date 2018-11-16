const express = require('express');
const router = express.Router();

const election = [
    { position: "President" , candidates: [
        {id: 1, name: "Mosquida", votes: 0 },
        {id: 2, name: "Valdez", votes: 0 },
        {id: 3, name: "Eleserio", votes: 0} 
    ]},
    { position: "Vice President" , candidates: [
        {id: 4, name: "Shandy", votes: 0 },
        {id: 5, name: "Salera", votes: 0 },
        {id: 6, name: "Laiya", votes: 0} 
    ]},
    { position: "Secretary" , candidates: [
        {id: 7, name: "Briones", votes: 0 },
        {id: 8, name: "Ternate", votes: 0 },
        {id: 9, name: "Bengilo", votes: 0 } 
    ]}
]

router.get('/', (req, res) => {
    res.render('../views/vote.pug', {election : election});
});

router.put('/s', (req, res) => {

    var votes = req.body.data;
    var votedCandidates = [];

    election.forEach(element => {
        var candidate = element.candidates.find(c => c.id == votes[0]);

        candidate.votes += 1;

        votedCandidates.push(candidate);
        votes.shift();
    });

    res.send(votedCandidates);
});

module.exports = router;