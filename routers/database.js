var votes = []

const voters = [
    {lrn: 108187060250, fullName: "xanderdwightmartinez", gradeLevel: 12, section: "computerprogramminga", ballotResult: null}
]

var positions = [ 
    {name: "Leader", winnerQty: 1},
    {name: "Members", winnerQty: 2}
]

var candidates = [
    // {id: "1", name: "Mosquida", position: positions[0], votes: 0},
    // {id: "2", name: "Valdez", position: positions[0], votes: 0},
    // {id: "3", name: "Eleserio", position: positions[0], votes: 0},
    // {id: "4", name: "Shandy", position: positions[1], votes: 0},
    // {id: "5", name: "Salera", position: positions[1], votes: 0},
    // {id: "6", name: "Laiya", position: positions[1], votes: 0}
]

var election = {
    positions: positions,
    candidates: candidates,
}


module.exports.votes = votes;
module.exports.voters = voters;
module.exports.election = election;