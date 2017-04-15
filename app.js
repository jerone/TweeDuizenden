'use strict';

// Require dependency modules;
var bodyParser = require('body-parser'),
    errorHandler = require('errorhandler'),
    express = require('express'),
    flash = require('connect-flash'),
    logger = require('morgan'),
    mongoose = require('mongoose'),
    session = require('express-session');

// Require core modules;
var path = require('path');

// Require file modules;
var secrets = require('./config/secrets'),
    helpers = require('./app/helpers.js'),
    i18n = require('./app/i18n.js'),
    methodOverride = require('./app/methodOverride.js'),
    routesStatic = require('./app/routesStatic.js'),
    routes = require('./app/routes.js');

// Init;
var app = express();

// Settings;
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000);
app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || process.env.OPENSHIFT_INTERNAL_IP || '0.0.0.0');
app.set('env', (process.env.NODE_ENV || 'development').trim());  // Fix issue with trailing spaces;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.locals.pretty = app.get('env') === 'development';

// Database;
mongoose.connect(secrets.db);
mongoose.connection.on('error', function () {
  console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

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
app.use(i18n(app));
app.use(helpers());

// Static routes;
routesStatic(app);

// Routes;
routes(app);

// Start;
app.listen(app.get('port'), app.get('ipaddr'), function () {
  console.log('Express server listening on port %d in %s mode...', app.get('port'), app.get('env'));
});

// Export;
//module.exports = app;
