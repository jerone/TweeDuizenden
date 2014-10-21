'use strict';

var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var gameTypesDefault = 'tweeduizenden',
    gameTypes = [gameTypesDefault, 'skipbo'];

var gameSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  //createdAt: { type: Date, default: Date.now },
  //updatedAt: { type: Date, default: Date.now },
  type: { type: String, enum: gameTypes, default: gameTypesDefault },
  players: Array,
  score: {},
  wild: Array
});

gameSchema.path('score').default(function () {
  return {};
});

gameSchema.plugin(timestamps);

module.exports = mongoose.model('Game', gameSchema);

module.exports.gameTypesDefault = gameTypesDefault;
module.exports.getGameTypes = function (i18n) {
  var types = {};
  gameTypes.forEach(function (type) {
    types[type] = i18n.t('game:common.types.' + type);
  });
  return types;
};
