'use strict';

var GameTypes = require('../models/GameTypes'),
    mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp');

var gameSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  //createdAt: { type: Date, default: Date.now },
  //updatedAt: { type: Date, default: Date.now },
  type: { type: String, enum: GameTypes.toEnum(), default: GameTypes.getDefault().key },
  players: Array,
  score: {},
  wild: Array
});

gameSchema.path('score').default(function () {
  return {};
});

gameSchema.plugin(timestamps);

module.exports = mongoose.model('Game', gameSchema);
