'use strict';

// Require dependency modules.
var bodyParser = require('body-parser'),
  errorHandler = require('errorhandler'),
  express = require('express'),
  flash = require('connect-flash'),
  logger = require('morgan'),
  mongoose = require('mongoose'),
  session = require('express-session'),
  cookieParser = require('cookie-parser'),
  MongoStore = require('connect-mongo')(session);

// Require core modules.
var path = require('path'),
  fs = require('fs');

// Require file modules.
var secrets = require('./config/secrets'),
  helpers = require('./app/helpers.js'),
  nonce = require('./app/nonce.js'),
  securityHeaders = require('./app/securityHeaders.js'),
  i18n = require('./app/i18n.js'),
  methodOverride = require('./app/methodOverride.js'),
  routesStatic = require('./app/routesStatic.js'),
  routes = require('./app/routes.js');

// Init server.
var app = express();

// Settings.
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000);
app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || process.env.OPENSHIFT_INTERNAL_IP || '127.0.0.1');
app.set('env', (process.env.NODE_ENV || 'development').trim());  // Fix issue with trailing spaces.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.locals.pretty = app.get('env') === 'development';
app.locals.deployVersion = (new Date).getTime();
app.locals.version = fs.readFileSync('./config/version.txt', 'utf8');

// Database.
mongoose.connect(secrets.db);
mongoose.connection.on('error', function () {
  console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

// Middleware.
if (app.get('env') === 'development') {
  app.use(logger('dev'));
  app.use(errorHandler());
}
app.use(nonce());
app.use(securityHeaders());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ resave: true, saveUninitialized: true, secret: secrets.sessionSecret, store: new MongoStore({ mongooseConnection: mongoose.connection }) }));
app.use(methodOverride());
app.use(flash());
app.use(i18n(app));
app.use(helpers());

// Static routes.
routesStatic(app);

// Routes.
routes(app);

// Start.
app.listen(app.get('port'), app.get('ipaddr'), function () {
  console.log('Express server listening in %s mode, on http://%s:%d', app.get('env'), app.get('ipaddr'), app.get('port'));
});
