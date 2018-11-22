// Routers
const candidates = require('./routers/candidates');
const voters = require('./routers/voters');
const election = require('./routers/election');
const ballot = require('./routers/ballot');

// Server
const express = require('express');
const app = express();

// Middlewares
app.use(express.json());

// Database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vdvs-dev', {useNewUrlParser: true})
    .then(() => console.log("Connected to MongoDB..."))
    .catch((error) => console.log('Unable to connect to MongoDB.', error));

// Routes
app.use('/admin/voters', voters)
app.use('/admin/candidates', candidates);
app.use('/admin/election', election);
app.use('/ballot', ballot);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening to port ${PORT}...`));