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
  var tag = 'unknown';
  try {
    tag = require('child_process')
      .execSync('git describe --abbrev=0 --tags')
      .toString().trim();
  }
  catch (e) {
    tag = 'error: ' + e;
  }
  res.render('debug', {
    data: [
      'tag: ' + tag,
      'process.env.NODE_ENV: ' + process.env.NODE_ENV,
      Game,
      JSON.stringify(GameTypes.toList(), null, '  '),
      GameTypes.toEnum().join(', '),
      GameTypes.getByKey('tweeduizenden').key,
      ''].join('\n')
  });
};
