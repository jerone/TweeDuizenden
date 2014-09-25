var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var gameSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  //createdAt: { type: Date, default: Date.now },
  //updatedAt: { type: Date, default: Date.now },
  players: Array,
  score: {},
  wild: Array
});

gameSchema.path('score').default(function () {
  return {};
});

gameSchema.plugin(timestamps);

module.exports = mongoose.model('Game', gameSchema);
/*
new Game({
  name: String,
  score: { id: [Number] }
});
*/