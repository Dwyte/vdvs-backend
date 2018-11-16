const express = require('express');
const server = express();
const vote = require('./routers/vote.js')

server.use(express.json())
server.use(express.static(__dirname));

// View Engine
server.set('view-engine', 'pug');

server.use('/vote', vote);


server.get('/', (req, res) => {
    res.render(__dirname + '/views/home.pug');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Listening to port ${PORT}`));