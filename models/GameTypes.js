'use strict';

function GameType(key, rows, direction, step, winDirection, winStart, winEnd, wild) {
  this.key = key;
  this.rows = rows;
  this.direction = direction;
  this.step = step;
  this.win = {
    direction: winDirection,
    start: winStart,
    end: winEnd
  };
  this.wild = wild || false;
}

var skipbo = new GameType('skipbo', 9, '+', 1, 'lowest', 0, null, false);
var tweeduizenden = new GameType('tweeduizenden', Infinity, '+', 5, 'highest', 0, 2000, true);
//var rummy = new GameType('rummy', Infinity, '+', 5, 'highest', 0, 5000, true);

function GameTypes() {
  this.types = [skipbo, tweeduizenden/*, rummy*/];
}
GameTypes.prototype.getByKey = function (key) {
  return this.types.find(function (type) {
    return type.key === key;
  });
};
GameTypes.prototype.getDefault = function () {
  return tweeduizenden;
};
GameTypes.prototype.toList = function () {
  return this.types;
};
GameTypes.prototype.toEnum = function () {
  return this.types.map(function (type) {
    return type.key;
  });
};
GameTypes.prototype.toI18n = function (i18n) {
  var types = {};
  this.types.forEach(function (type) {
    types[type.key] = i18n.t('game:common.types.' + type.key);
  });
  return types;
};

module.exports = new GameTypes();
