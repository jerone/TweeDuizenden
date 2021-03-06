﻿'use strict';

var fs = require('fs');

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
    title: 'debug',
    data: [
      'version: ' + fs.readFileSync('./config/version.txt', 'utf8'),
      'process.env.NODE_ENV: ' + process.env.NODE_ENV,
      Game,
      JSON.stringify(GameTypes.toList(), null, '  '),
      GameTypes.toEnum().join(', '),
      GameTypes.getByKey('tweeduizenden').key,
      ''].join('\n---\n')
  });
};
