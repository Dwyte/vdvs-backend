// Routers
const candidates = require('./routers/candidates');
const voters = require('./routers/voters')
const ballot = require('./routers/ballot');

// Server
const express = require('express');
const server = express();

// Middlewares
server.use(express.json());

// Database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vdvs-dev', {useNewUrlParser: true})
    .then(() => console.log("Connected to MongoDB..."))
    .catch((error) => console.log('Unable to connect to MongoDB.', error));

// Routes
server.use('/admin/voters', voters)
server.use('/admin/candidates', candidates);
server.use('/ballot', ballot);


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Listening to port ${PORT}...`));