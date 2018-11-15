const express = require('express');
const router = express.Router();

const accounts  = [
    { lrn: "108187060250", pass: "1234", isAdmin: false},
    { lrn: "admin", pass: "admin123", isAdmin: true }
]

router.get('/', (req, res) => {
    res.sendFile('/home/dwyte/projects/voting-system/login.html');
})

router.get('/:lrn', (req, res) => {
    const account = accounts.find(a => a.lrn === req.params.lrn)
    res.send(req.body.pass == account.pass);
})

module.exports = router;