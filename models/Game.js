var mongoose = require('mongoose');

var gameSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  players: Array
});


module.exports = mongoose.model('Game', gameSchema);
