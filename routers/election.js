const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();

const Election = require('../models/election');
const {Candidate} = require('../models/candidate');

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
    const presidentTally = await Candidate.find({position: 'President'}).sort({votes: -1});
    const vicePresidentTally = await Candidate.find({position: 'Vice President'}).sort({votes: -1});
    const secretaryTally = await Candidate.find({position: 'Secretary'}).sort({votes: -1});
    const auditorTally = await Candidate.find({position: 'Auditor'}).sort({votes: -1});
    const treasurerTally = await Candidate.find({position: 'Treasurer'}).sort({votes: -1});
    const pioTally = await Candidate.find({position: 'PIO'}).sort({votes: -1});
    
    const election = await Election.findOneAndUpdate({},
        {hasEnded: true,
        results: {
            President: presidentTally[0],
            VicePresident: vicePresidentTally[0],
            Secretary: secretaryTally[0],
            Auditor: auditorTally[0],
            Treasurer: treasurerTally[0],
            PIO: pioTally[0]
        }},
        {useFindAndModify: false, new: true});

    if(!election)
        return res.status(404).send('Election not found.');

    res.send(election);
});

// Export Results
var jexcel=require('json2excel');
router.get('/exportResults', async (req, res) => {
    const election = await Election.findOne();

    var data = {
        sheets: [{
            header: {
                'a': 'Name',
                'b': 'Position',
                'c': 'Votes'
            },
            items: [
             {
                a:'john',
                b:'how to use this'
             },
             {
                a:'Bob',
                b:'so Easy'
             }
            ],
            sheetName: 'sheet1',
        }],
        filepath: 'j2x.xlsx'
    } 
     
    jexcel.j2e(data,function(err){ 
        console.log('finish')
    });

    res.send("pop");
});

// Drop Database
router.delete('/deleteElection', [auth, admin], async (req,res) => {
    let election = await Election.findOne();

    if(!election)
        return res.status(404).send('There is no current election.');

    election.db.dropDatabase()
        .then(() => res.send({message: 'Database collections has been deleted.'}));
});

module.exports = router;
