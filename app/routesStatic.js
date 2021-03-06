﻿'use strict';

var express = require('express'),
  less = require('less-middleware'),
  uglify = require("uglifyjs-middleware"),
  favicon = require('serve-favicon');

var path = require('path');

module.exports = function routesStatic(app) {

  var staticOptions = { maxAge: app.get('env') === 'development' ? 0 : '30d' };

  app.use(favicon(path.join('.', 'public', 'favicon.ico'), staticOptions));

  app.use('/vendor/:vendor/:file', function (req, res, next) {
    var dir;
    switch (req.params.vendor) {
      case 'bootstrap': {
        dir = path.join('.', 'bower_components', 'bootstrap', 'dist', req.params.file);
        break;
      }
      case 'jquery': {
        dir = path.join('.', 'bower_components', 'jquery', 'dist', req.params.file);
        break;
      }
      case 'jquery.floatThead': {
        dir = path.join('.', 'bower_components', 'jquery.floatThead', 'dist', req.params.file);
        break;
      }
      case 'moment': {
        dir = path.join('.', 'node_modules', 'moment', 'min', req.params.file);
        break;
      }
      case 'cookie': {
        dir = path.join('.', 'bower_components', 'js-cookie', 'src', req.params.file);
        break;
      }
      case 'cheet': {
        dir = path.join('.', 'bower_components', 'cheet.js', req.params.file);
        break;
      }
      default: return next();
    }
    return express.static(dir, staticOptions).apply(this, arguments);
  });

  // Needs to be before Express static on public folder.
  app.use(less(path.join('.', 'public')));

  app.use(uglify(path.join('.', 'public'), {
    generateSourceMap: app.get('env') === 'development'
  }));

  app.use(express.static(path.join('.', 'public'), staticOptions));

  app.use(express.static(path.join('.', 'locales'), staticOptions));

};
