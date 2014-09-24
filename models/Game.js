var mongoose = require('mongoose');

var gameSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  players: Array,
  score: {},
  wild: Array
});

gameSchema.path('score').default(function () {
  return {};
});

module.exports = mongoose.model('Game', gameSchema);
/*
new Game({
  name: String,
  score: { id: [Number] }
});
*/