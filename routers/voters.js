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
        var file = req.files.file0,
            filename = req.files.file0.name;

        file.mv("./uploads/"+filename, (error) => {
            if(error)
                return res.send("Error" + error);
            else
                return res.send({result:ImportExcel(filename), success:"ok"});
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
router.get('/totalVoted/:gradeLevel', async (req, res) => {
    let totalVoters = 0;
    
    if(req.params.gradeLevel == "all"){
        totalVoters = await Voter.countDocuments({voteReceiptID: {$ne:null}});
    }else{
        totalVoters = await Voter.countDocuments(
            {voteReceiptID: {$ne:null},
            gradeLevel: req.params.gradeLevel},
        );
    }

    res.send({totalVoters: totalVoters});
});

//Get the total Number of Voters
router.get('/totalVoters/:gradeLevel', async(req, res) => {
    let totalVoters = 0;
    
    if(req.params.gradeLevel == "all"){
        totalVoters = await Voter.countDocuments();
    }else{
        totalVoters = await Voter.countDocuments({gradeLevel: req.params.gradeLevel});
    }

    res.send({totalVoters: totalVoters});
});

// Activate Voter with Lrn
router.put('/activateVoter/:lrn', [auth, admin], async (req, res) => {
    let voter = await Voter.findOneAndUpdate(
        {lrn: parseInt(req.params.lrn)}, 
        {canVote: true}, 
        {useFindAndModify: false,new: true});

    if(!voter)
        return res.status(404).send('Voter was not found from the database...');

    voter = await voter.save()
        .then(result => res.send(result))
        .catch(error => res.send(error));
});

// Auth Voter
router.post('/auth', async(req,res) => {
    const { error } = validate(req.body);
    if (error) res.status(400).send(error);

    let voter = await Voter.findOne(_.pick(req.body, ['lrn','fullName', 'gradeLevel', 'section']));
    
    if(!voter) return res.status(400).send('Invalid Voter Details.');

    const token = generateToken();
    res.send({authToken: token});
});

function ImportExcel(filename){
    const result = excelToJson({
        sourceFile: './uploads/' + filename,
        header: {
            rows: 1
        },
        columnToKey:{
            A: 'lrn',
            B: 'fullName',
            C: 'gradeLevel',
            D: 'section'
        }
    });

    result.Sheet1.forEach(element => {
        validate(element);

        const voter = new Voter(_.pick(element,
            ['lrn', 'fullName', 'gradeLevel', 'section']));

        voter.save();

        console.log("Added Voter");
    });

    return result;
}

module.exports = router;
