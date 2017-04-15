'use strict';

//var helpers = require('./../app/helpers');
var Game = require('../models/Game'),
    GameTypes = require('./../models/GameTypes');

exports.all = function (req, res) {
  res.send({
    body: req.body,
    params: req.params,
    query: req.query
  });
};
exports.body = function (req, res) {
  res.send(req.body);
};
exports.params = function (req, res) {
  res.send(req.params);
};
exports.query = function (req, res) {
  res.send(req.query);
};
exports.index = function (req, res) {
  res.render('debug', {
    data: [
      Game,
      JSON.stringify(GameTypes.toList(), null, '  '),
      GameTypes.toEnum().join(', '),
      GameTypes.getByKey('tweeduizenden').key,
      ''].join('\n')
  });
};
