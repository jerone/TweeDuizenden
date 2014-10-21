'use strict';

require('intl');
var helpers = require('./../app/helpers');

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
  //var date = "2014-10-07T10:30:00.000Z";
  var date = new Date();
  res.render('debug', {
    date: [
    date,
    new Date(date),
    new Date(date).toLocaleTimeString(),
    new Date(date).toLocaleString(),
    new Date(date).toLocaleString('nl'),
    new Date(date).toLocaleTimeString('nl'),
    new Date(date).toUTCString(),
    new Date(new Date(date).toUTCString()),
    new Date(new Date(date).toUTCString()).toLocaleString('nl'),
    new Date(date).getTimezoneOffset() + " -> " + new Date(date).getTimezoneOffset() / 60,
    new Date(new Date(date).getTime() + (new Date(date).getTimezoneOffset() * 60000)),
    new Date(new Date(date).getTime() + (new Date(date).getTimezoneOffset() * 60000)).toLocaleString('nl'),
    new Date(new Date(date).getTime() + (new Date(date).getTimezoneOffset() * 60000) + (60000 * 120)).toLocaleString('nl'),
    new Date(new Date(date).getTime() + (new Date(date).getTimezoneOffset() * 60000) + (60000 * 120)).toLocaleTimeString('nl'),
    helpers.getLocaleDateString(date, 'nl') + " " + helpers.getLocaleTimeString(date, 'nl'),
    ""].join('\n')
  });
};
