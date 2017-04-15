'use strict';

var i18next = require('i18next'),
    i18nextMiddleware = require('i18next-express-middleware'),
    i18nextBackend = require('i18next-node-fs-backend'),
    jade = jade = require('jade');

var path = require('path'),
    EOL = require('os').EOL;

module.exports = function i18n(app) {
  i18next
    .use(i18nextMiddleware.LanguageDetector)
    .use(i18nextBackend)
    .use({
      type: 'postProcessor',
      name: 'multi-line-jade',
      process: function (val) {
        return jade.render('p ' + val.replace(/\r?\n\r?\n/g, EOL + '&nbsp;' + EOL).replace(/\r?\n/g, EOL + 'p '), { pretty: app.get('env') === 'development' });
      }
    })
    .init({
      debug: app.get('env') === 'development',
      lngs: ['en-US', 'en-CA', 'nl-NL'],
      fallbackLng: ['en-US', 'en-CA', 'nl-NL'],
      ns: ['_flash', '_footer', '_navbar', 'app', 'error', 'game', 'home'],
      defaultNs: 'app',
      joinArrays: EOL,
      saveMissing: app.get('env') === 'development',
      backend: {
        loadPath: path.join(__dirname, '/../locales/{{lng}}/{{ns}}.json'),
        addPath: path.join(__dirname, '/../locales/{{lng}}/{{ns}}.missing.json')
      },
      detection: {
        caches: ['cookie'],
        lookupCookie: 'lang',
        order: ['querystring', 'cookie', 'header']
      }
    });

  return i18nextMiddleware.handle(i18next, {
    ignoreRoutes: ['vendor/', 'images/', 'css/', 'js/', 'favicon.ico', 'flag.gif']
  });
};
