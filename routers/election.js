const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const path = require('path');

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
    const poTally = await Candidate.find({position: 'PO'}).sort({votes: -1});
    const g9Chairman = await Candidate.find({position: 'G9 Chairman'}).sort({votes: -1});
    const g10Chairman = await Candidate.find({position: 'G10 Chairman'}).sort({votes: -1});
    
    const election = await Election.findOneAndUpdate({},
        {hasEnded: true,
        results: {
            President: presidentTally[0],
            VicePresident: vicePresidentTally[0],
            Secretary: secretaryTally[0],
            Auditor: auditorTally[0],
            Treasurer: treasurerTally[0],
            PIO: pioTally[0],
            PO: poTally[0],
            G9Chairman: g9Chairman[0],
            G10Chairman: g10Chairman[0]
        }},
        {useFindAndModify: false, new: true});

    if(!election)
        return res.status(404).send('Election not found.');

    res.send(election);
});

// Export
var jexcel=require('json2excel');
router.get('/electionTally', async (req, res) => {
    const candidates = {
        presidents: await Candidate
        .find({position: "President"})
        .sort({votes: -1}),
        vicePresidents: await Candidate
        .find({position: "Vice President"})
        .sort({votes: -1}),
        secretaries: await Candidate
        .find({position: "Secretary"})
        .sort({votes: -1}),
        auditors: await Candidate
        .find({position: "Auditor"})
        .sort({votes: -1}),
        treasurers: await Candidate
        .find({position: "Treasurer"})
        .sort({votes: -1}),
        pios: await Candidate
        .find({position: "PIO"})
        .sort({votes: -1}),
        pos: await Candidate
        .find({position: "PO"})
        .sort({votes: -1}), 
        g9Chairmans: await Candidate
        .find({position: "G9 Chairman"})
        .sort({votes: -1}),
        g10Chairmans: await Candidate
        .find({position: "G10 Chairman"})
        .sort({votes: -1})
        
    }

    var data = {
        sheets: [{
            header: {
                position: 'Position',
                fullName: 'Name',
                votes: 'Votes'
            },
            items: candidates.presidents.concat(candidates.vicePresidents).concat(candidates.secretaries)
                .concat(candidates.treasurers).concat(candidates.auditors).concat(candidates.pios)
                .concat(candidates.pos).concat(candidates.g10Chairmans).concat(candidates.g9Chairmans),
            sheetName: 'sheet1',
        }],
        filepath: 'election-tally.xlsx'
    } 
     
    jexcel.j2e(data,function(err){ 
        res.sendFile(path.join(__dirname, '../election-tally.xlsx'));
    });
});

router.get('/electionResults', async (req, res) => {
    const candidates = {
        presidents: await Candidate
        .find({position: "President"})
        .sort({votes: -1}),
        vicePresidents: await Candidate
        .find({position: "Vice President"})
        .sort({votes: -1}),
        secretaries: await Candidate
        .find({position: "Secretary"})
        .sort({votes: -1}),
        auditors: await Candidate
        .find({position: "Auditor"})
        .sort({votes: -1}),
        treasurers: await Candidate
        .find({position: "Treasurer"})
        .sort({votes: -1}),
        pios: await Candidate
        .find({position: "PIO"})
        .sort({votes: -1}),
        pos: await Candidate
        .find({position: "PO"})
        .sort({votes: -1}), 
        g9Chairmans: await Candidate
        .find({position: "G9 Chairman"})
        .sort({votes: -1}),
        g10Chairmans: await Candidate
        .find({position: "G10 Chairman"})
        .sort({votes: -1})
        
    }

    var items = []

    for(var key in candidates){
        if(candidates[key][0] != null){
            items.push(candidates[key][0]);
        }
    }

    var data = {
        sheets: [{
            header: {
                position: 'Position',
                fullName: 'Name',
                votes: 'Votes'
            },
            items: items,
            sheetName: 'sheet1',
        }],
        filepath: 'election-results.xlsx'
    } 
     
    jexcel.j2e(data,function(err){ 
        res.sendFile(path.join(__dirname, '../election-results.xlsx'));
    });

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
