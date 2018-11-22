const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
    name: String,
    winnerQty: Number,
});

const Position = mongoose.model('Position', positionSchema);

module.exports = Position;