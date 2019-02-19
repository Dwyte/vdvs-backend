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
            filename = file.name;
        
        const path = require('path');
        if(path.extname(filename) != '.xlsx' && path.extname(filename) != '.csv')
            return res.status(400).send({message: 'Invalid file type. Please use a .xlsx file.'})

        file.mv("./uploads/"+filename, (error) => {
            if(error)
                return res.status(400).send({message: error});
            else
                return res.send({result: ImportExcel(filename), message: "File Upload Success."});
        });
    }
});

// Get Voter with LRN
router.post('/searchVoter/', async (req, res) => {
    const voter = await Voter.find(req.body.param).populate('voteReceiptID')
        .catch((error) => {
            return res.send(error.message);
        });

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
    
    if(req.params.gradeLevel == "all")
        totalVoters = await Voter.countDocuments();
    else
        totalVoters = await Voter.countDocuments({gradeLevel: req.params.gradeLevel});

    res.send({totalVoters: totalVoters});
});

// Activate Voter with Lrn
router.put('/activateVoter/:lrn', [auth, admin], async (req, res) => {
    let voter = await Voter.findOne({lrn: parseInt(req.params.lrn)});

    if(voter.voteReceiptID)
        return res.status(400).send('Voter has already voted. Sorry...');
        
    if(!voter)
        return res.status(404).send('Voter was not found from the database...');

    voter.canVote = !voter.canVote;

    voter = await voter.save()
        .then(result => res.send(result))
        .catch(error => res.send(error));
});

// Auth Voter
router.post('/auth', async(req,res) => {
    const { error } = validate(req.body);
    if (error) res.status(400).send(error);

    let voter = await Voter.findOne(_.pick(req.body, ['lrn']));
    
    if(!voter) 
        return res.status(404).send({message: `Voter not found.`});
    
    if(!voter.canVote)
        return res.status(403).send({message: 'Sorry, voter cannot vote yet. Contact admin for more info.'});

    if(voter.voteReceiptID)
        return res.status(403).send({message: 'Voter has already voted.'});
    
    voterFromDB = _.pick(voter, ['fullName', 'gradeLevel','lrn','section']);
    voterFromDB.fullName = voterFromDB.fullName.replace(/ /g,'').toLowerCase();
    voterFromDB.section = voterFromDB.section.replace(/ /g,'').toLowerCase();
    console.log(voterFromDB);

    if(!_.isEqual(req.body, voterFromDB))
        return res.status(400).send('Invalid Voter Details.');

    const token = generateToken();
    res.send({authToken: token});
});

function ImportExcel(filename){
    const excelToJsonResult = excelToJson({
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

    excelToJsonResult.Sheet1.forEach(async (element) => {
        console.log(element);
        if(!validate(element))
            return console.error(`Voter Schema invalid.`);
        
        let voter = await Voter.findOne({lrn: element.lrn});

        if(voter != null){
            console.log(`Skipped - Voter already in the database: ${voter.lrn}`);
            return;
        }

        voter = new Voter(_.pick(element,
            ['lrn', 'fullName', 'gradeLevel', 'section']));

        await voter.save();

        console.log(`Success - Voter was added to the database: ${voter.lrn}`);
    });

    return excelToJsonResult;
}

module.exports = router;
