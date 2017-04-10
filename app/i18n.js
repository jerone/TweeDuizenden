'use strict';

var i18next = require('i18next'),
    jade = require('jade'),
    EOL = require('os').EOL;

module.exports = function i18n(app) {
  i18next.init({
    resSetPath: 'locales/__lng__/new.__ns__.json',
    saveMissing: app.get('env') === 'development',
    debug: app.get('env') === 'development',
    sendMissingTo: 'fallback',
    jsonIntend: 2,
    ignoreRoutes: ['vendor/', 'images/', 'css/', 'js/', 'favicon.ico'],
    cookieName: 'lang',
    detectLngQS: 'lang',
    supportedLngs: ['en-US', 'en-CA', 'nl-NL'],
    fallbackLng: ['en-US', 'en-CA', 'nl-NL'],
    ns: {
      namespaces: ['_flash', '_footer', '_navbar', 'app', 'error', 'game', 'home'],
      defaultNs: 'app'
    }
  });

  i18next.addPostProcessor('multi-line-jade', function (val/*, key, opts*/) {
    // NOTE: i18next is using \n as fixed new-lines;
    return jade.render('p ' + val.replace(/\n\n/g, '\n&nbsp;\n').replace(/\n/g, EOL + 'p '));
  });

  i18next.registerAppHelper(app);

  return i18next;
};
