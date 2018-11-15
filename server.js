const express = require('express');
const server = express();
// const home = require('./routers/home.js')
const login = require('./routers/login.js');

server.use(express.json())
server.use(express.static(__dirname));

// server.use('/', home);
server.use('/login', login);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Listening to port ${PORT}`));