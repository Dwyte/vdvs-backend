const express = require('express');
const server = express();
const vote = require('./routers/vote.js')
const admin = require('./routers/admin.js')

// Middlewares
server.use(express.json())
server.use(express.static(__dirname));

// View Engine
server.set('view-engine', 'pug');

// Route Handlers
server.use('/vote', vote);
server.use('/admin', admin);

server.get('/', (req, res) => {
    res.render(__dirname + '/views/home.pug');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Listening to port ${PORT}`));