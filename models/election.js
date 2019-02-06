const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
    hasBegun: {type: Boolean, default: false},
    hasEnded: {type: Boolean, default: false},
    results: {
        type: Object, 
        default : {
            President: null,
            VicePresident: null,
            Secretary: null,
            Auditor: null,
            Treasurer: null,
            PIO: null,
            g7Rep: null,
            g8Rep: null,
            g9Rep: null,
            g10Rep: null,
            g11Rep: null,
            g12Rep: null
        }
    },
});

const Election = mongoose.model('Election', electionSchema);

module.exports = Election;