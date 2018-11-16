const express = require('express');
const router = express.Router();

const candidates  = [
    { id: 1, name: "Mosquida", votes: 0 },
    { id: 2, name: "Valdez", votes: 0 },
    { id: 3, name: "Eleserio", votes: 0 }
]

router.get('/', (req, res) => {
    res.render('../views/vote.pug');
});

router.put('/:id', (req, res) => {
    const candidateVoted = candidates.find(c => c.id === parseInt(req.params.id));

    candidateVoted.votes += 1;

    res.send(String(candidateVoted.votes));
});

module.exports = router;