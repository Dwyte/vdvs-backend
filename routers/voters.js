const express = require('express');
const router = express.Router();
const excelToJson = require('convert-excel-to-json');

// Models
const {Voter, validateVoter} = require('../models/voter');

router.post('/import', (req, res) => {
    const result = excelToJson({
        sourceFile: req.body.sourceFile,
        header: {
            rows: 1
        },
        columnToKey:{
            A: 'lrn',
            B: 'firstName',
            C: 'middleName',
            D: 'lastName',
            E: 'gradeLevel',
            F: 'section'
        }
    });

    result.Sheet1.forEach(element => {
        const voter = new Voter({
            lrn: element.lrn,
            firstName: element.firstName,
            middleName: element.middleName || null,
            lastName: element.lastName,
            gradeLevel: element.gradeLevel,
            section: element.section
        });

        voter.save();
    });

    res.send(result);
});


// Get voter of lrn
router.get('/searchVoter/:lrn', async (req, res) => {
    const voter = await Voter.findOne({lrn: req.params.lrn}).populate('voteReceiptID');

    if(!voter)
        return res.status(404).send('The voter with the given lrn was not found');

    res.send(voter);
});

// Activate voter of lrn
router.put('/activateVoter/:lrn', async (req, res) => {
    const voter = await Voter.findOneAndUpdate(
        {lrn: parseInt(req.params.lrn)}, 
        {canVote: true}, 
        {useFindAndModify: false,new: true});

    if(!voter)
        return res.status(404).send('Voter was not found from the database...');

    const activatedVoter = await voter.save();
    res.send(activatedVoter);
});

module.exports = router;