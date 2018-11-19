const mongoose = require('mongoose');
const express = require('express');
const server = express();
const vote = require('./routers/vote.js')
const admin = require('./routers/admin.js')

// Connect to MongoDB
mongoose.connect('mongodb://localhost/vdvs-dev', {useNewUrlParser: true})
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log("Unable to connect to MongoDB", error));

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