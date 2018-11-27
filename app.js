// Routers
const candidates = require('./routers/candidates');
const voters = require('./routers/voters');
const election = require('./routers/election');
const receipt = require('./routers/receipt');

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
app.use('/api/voters', voters)
app.use('/api/candidates', candidates);
app.use('/api/election', election);
app.use('/api/receipt', receipt);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening to port ${PORT}...`));