const express = require('express');
const server = express();
const login = require('./routers/login.js');
const vote = require('./routers/vote.js')

server.use(express.json())
server.use(express.static(__dirname));

server.use('/login', login);
server.use('/vote', vote);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Listening to port ${PORT}`));