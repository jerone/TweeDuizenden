// Require dependency modules;
var bodyParser = require('body-parser'),
    errorHandler = require('errorhandler'),
    express = require('express'),
    favicon = require('serve-favicon'),
    flash = require('connect-flash'),
    i18n = require('i18next'),
    jade = require('jade'),
    less = require('less-middleware'),
    logger = require('morgan'),
    mongoose = require('mongoose'),
    session = require('express-session');

// Require core modules;
var EOL = require('os').EOL,
    path = require('path');

// Require file modules;
var secrets = require('./config/secrets'),
    helpers = require('./app/helpers.js'),
    methodOverride = require('./app/methodOverride.js'),
    routes = require('./app/routes.js');

// Init;
var app = express();

// Settings;
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000);
app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || process.env.OPENSHIFT_INTERNAL_IP || 'localhost');
app.set('env', (process.env.NODE_ENV || 'development').trim());  // Fix issue with trailing spaces;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.locals.helpers = helpers;
app.locals.pretty = app.get('env') === 'development';

// Database;
mongoose.connect(secrets.db);
mongoose.connection.on('error', function () {
  console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

// i18n;
i18n.init({
  resSetPath: 'locales/__lng__/new.__ns__.json',
  saveMissing: app.get('env') === 'development',
  debug: app.get('env') === 'development',
  sendMissingTo: 'fallback',
  jsonIntend: 2,
  ignoreRoutes: ['images/', 'public/', 'css/', 'js/', 'favicon.ico'],
  cookieName: 'lang',
  detectLngQS: 'lang',
  supportedLngs: ['en-US', 'nl-NL'],
  fallbackLng: ['en-US', 'nl-NL'],
  ns: {
    namespaces: ['_flash', '_footer', '_navbar', 'app', 'error', 'game', 'home'],
    defaultNs: 'app'
  }
});
i18n.addPostProcessor('multi-line-jade', function (val, key, opts) {
  // NOTE: i18next is using \n as fixed new-lines;
  return jade.render('p ' + val.replace(/\n\n/g, '\n&nbsp;\n').replace(/\n/g, EOL + 'p '));
});
i18n.registerAppHelper(app);

// Middleware;
if (app.get('env') === 'development') {
  app.use(logger('dev'));
  app.use(errorHandler());
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ resave: true, saveUninitialized: true, secret: secrets.sessionSecret }));
app.use(methodOverride());
app.use(flash());
app.use(i18n.handle);

// Dir based middleware;
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(less(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 1000 * 60 * 60 * 24 * 7 }));
app.use(express.static(path.join(__dirname, 'locales'), { maxAge: 1000 * 60 * 60 * 24 * 7 }));

// Routes;
routes(app);

// Start;
app.listen(app.get('port'), app.get('ipaddr'), function () {
  console.log('Express server listening on port %d in %s mode...', app.get('port'), app.get('env'));
});

// Export;
//module.exports = app;
