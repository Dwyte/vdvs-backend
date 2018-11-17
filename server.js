const express = require('express');
const server = express();
const vote = require('./routers/vote.js')

server.use(express.json())
server.use(express.static(__dirname));

// View Engine
server.set('view-engine', 'pug');

server.use('/vote', vote);


var election = [
    { position: "President" , candidates: [
        {id: 1, name: "Mosquida", votes: 0 },
        {id: 2, name: "Valdez", votes: 0 },
        {id: 3, name: "Eleserio", votes: 0} 
    ], quantity: 1},
    { position: "Vice President" , candidates: [
        {id: 4, name: "Shandy", votes: 0 },
        {id: 5, name: "Salera", votes: 0 },
        {id: 6, name: "Laiya", votes: 0} 
    ], quantity: 1},
    { position: "Secretary" , candidates: [
        {id: 7, name: "Briones", votes: 0 },
        {id: 8, name: "Ternate", votes: 0 },
        {id: 9, name: "Bengilo", votes: 0 } 
    ], quantity: 1},
    { position: "Srgnt & Arms" , candidates: [
        {id: 10, name: "Cruz", votes: 0 },
        {id: 11, name: "De Jesus", votes: 0 },
        {id: 12, name: "Mendoza", votes: 0 } 
    ], quantity: 2}
]

server.get('/', (req, res) => {
    res.render(__dirname + '/views/home.pug', {election: election});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Listening to port ${PORT}`));