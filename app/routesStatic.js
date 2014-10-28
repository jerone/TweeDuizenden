'use strict';

var express = require('express'),
    less = require('less-middleware'),
    favicon = require('serve-favicon');

var path = require('path');

module.exports = function routesStatic(app) {

  app.use(favicon(path.join('.', 'public', 'favicon.ico'), { maxAge: '7d' }));

  app.use(less(path.join('.', 'public')));

  app.use(express.static(path.join('.', 'public'), { maxAge: '7d' }));

  app.use(express.static(path.join('.', 'locales'), { maxAge: '7d' }));

};
