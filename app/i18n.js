'use strict';

var i18next = require('i18next'),
  i18nextMiddleware = require('i18next-express-middleware'),
  i18nextBackend = require('i18next-node-fs-backend'),
  jade = jade = require('jade'),
  marked = require('marked');;

var path = require('path'),
  EOL = require('os').EOL,
  fs = require('fs');

function readMarkDownResource(language) {
  const folder = path.join(__dirname, `/../locales/${language}/changelog.md`);
  const contents = fs.readFileSync(folder, 'utf8');
  return contents;
}

module.exports = function i18n(app) {
  i18next
    .use(i18nextMiddleware.LanguageDetector)
    .use(i18nextBackend)
    .use({
      type: 'postProcessor',
      name: 'multi-line-jade',
      process: function (value, key, options, translator) {
        return jade.render('p ' + value.replace(/\r?\n\r?\n/g, EOL + '&nbsp;' + EOL).replace(/\r?\n/g, EOL + 'p '),
          { pretty: app.get('env') === 'development' });
      }
    })
    .use({
      type: 'postProcessor',
      name: 'markdown',
      process: function (value, key, options, translator) {
        return marked(value);
      }
    })
    .init({
      debug: app.get('env') === 'development',
      lngs: ['en-US', 'en-CA', 'nl-NL'],
      fallbackLng: ['en-US', 'en-CA', 'nl-NL'],
      ns: ['_changelog', '_flash', '_footer', '_navbar', 'app', 'error', 'game', 'home'],
      defaultNs: 'app',
      joinArrays: EOL,
      saveMissing: app.get('env') === 'development',
      backend: {
        loadPath: path.join(__dirname, '/../locales/{{lng}}/{{ns}}.json'),
        addPath: path.join(__dirname, '/../locales/{{lng}}/{{ns}}.json')
      },
      detection: {
        caches: ['cookie'],
        lookupCookie: 'lang',
        order: ['querystring', 'cookie', 'header']
      }
    }, function (err, t) {
      i18next.addResource('en-US', '_changelog', 'modal.body.text', readMarkDownResource('en-US'), { silent: true });
      i18next.addResource('en-CA', '_changelog', 'modal.body.text', readMarkDownResource('en-CA'), { silent: true });
      i18next.addResource('nl-NL', '_changelog', 'modal.body.text', readMarkDownResource('nl-NL'), { silent: true });
    });

  return i18nextMiddleware.handle(i18next, {
    ignoreRoutes: ['vendor/', 'images/', 'css/', 'js/', 'favicon.ico', 'flag.gif']
  });
};
