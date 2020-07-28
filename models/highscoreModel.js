const mongoose = require('mongoose');

// schema
const highscoreSchema = mongoose.Schema({
  name: String,
  time: String
});

const HighscoreModel = module.exports = mongoose.model('highscores', highscoreSchema);
