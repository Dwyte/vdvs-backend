const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const excelToJson = require('convert-excel-to-json');

// Models
const {Voter, validate, generateToken} = require('../models/voter');

// Import Voters
router.post('/import', [auth, admin], async (req, res) => {
    if(req.files){
        var file = req.files.file,
            filename = file.name;

        file.mv("./uploads/"+filename, (error) => {
            if(error)
                return res.send("Error" + error);
            else
                return res.send(ImportExcel(filename));
        });
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
    const voters = await Voter.count({voteReceiptID: {$ne:null}});

    res.send(String(voters));
});

//Get the total Number of Voters
router.get('/totalVoters', async(req, res) => {
    const voters = await Voter.countDocuments();
    res.send(String(voters));
});

// Activate Voter with Lrn
router.put('/activateVoter/:lrn', [auth, admin], async (req, res) => {
    const voter = await Voter.findOneAndUpdate(
        {lrn: parseInt(req.params.lrn)}, 
        {canVote: true}, 
        {useFindAndModify: false,new: true});

    if(!voter)
        return res.status(404).send('Voter was not found from the database...');

    const activatedVoter = await voter.save();
    res.send(activatedVoter);
});

// Auth Voter
router.post('/auth', async(req,res) => {
    const { error } = validate(req.body);
    if (error) res.status(400).send(error);

    let voter = await Voter.findOne(_.pick(req.body, ['lrn','firsName', 'middleName', 'lastName', 'gradeLevel', 'section']));
    if(!voter) return res.status(400).send('Invalid Voter Details.');

    const token = generateToken();
    res.send(token);
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
        validate(element);

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