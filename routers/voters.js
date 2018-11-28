const express = require('express');
const router = express.Router();
const excelToJson = require('convert-excel-to-json');

// Models
const {Voter, validateVoter} = require('../models/voter');

// Import Voters
router.post('/import', (req, res) => {
    var file = req.files.filename,
        filename = file.name;

    if(req.files){
        file.mv("./uploads/"+filename, (error) => {
            if(error)
                return res.send("Error" + error);
            else
                res.send(ImportExcel(filename));
        });
    }
    else{
        return res.send("No Files");
    }
});

// Get Voter with LRN
router.get('/searchVoter/:lrn', async (req, res) => {
    const voter = await Voter.findOne({lrn: req.params.lrn}).populate('voteReceiptID');

    if(!voter)
        return res.status(404).send('The voter with the given lrn was not found');

    res.send(voter);
});

//Get the total Number of Voters that already Voted
router.get('/totalVoted', async (req, res) => {
    const voters = Voter.count({voteReceiptID: {$ne:null}});

    res.send(voters);
});

//Get the total Number of Voters
router.get('/totalVoters', async(req, res) => {
    const voters = Voter.count();

    res.send(voters);
});

// Activate Voter with Lrn
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

// Validate Voter
router.get('/validateVoter', async (req, res) => {
    Voter.findOne({
        lrn: req.body.lrn,
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        gradeLevel: req.body.gradeLevel,
        section: req.body.section,
    }, async (error, voter) => {
        if(error)
            return res.send(error);
            
        if(!voter)
            return res.status(404).send('Voter was not found  from the database..');

        if(!voter.canVote)
            return res.status(400).send('Voter cannot vote yet, contact admin for activation');

        if(voter.voteReceiptID != null)
            return res.status(401).send('Voter has already voted');

        res.send(voter);
    });
});


function ImportExcel(filename){
    const result = excelToJson({
        sourceFile: './uploads/' + filename,
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
        validateVoter(element);

        const voter = new Voter({
            lrn: element.lrn,
            firstName: element.firstName,
            middleName: element.middleName || null,
            lastName: element.lastName,
            gradeLevel: element.gradeLevel,
            section: element.section
        });

        voter.save();

        console.log("Added Voter");
    });

    return result;
}

module.exports = router;