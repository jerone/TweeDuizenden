var express = require('express'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    MongoStore = require('connect-mongo')({ session: session }),
    flash = require('connect-flash'),
    path = require('path'),
    mongoose = require('mongoose'),
    less = require('less-middleware'),
    favicon = require('serve-favicon'),
    methodOverride = require('method-override');

var app = /*module.exports =*/ express();
var secrets = require('./config/secrets');

mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000);
app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || process.env.OPENSHIFT_INTERNAL_IP || 'localhost');
app.set('env', (process.env.NODE_ENV || 'development').trim());  // Fix issue with trailing space;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

if (app.get('env') === 'development') {
  app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secrets.sessionSecret,
  store: new MongoStore({
    url: secrets.db,
    auto_reconnect: true
  })
}));
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use(flash());

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(less(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 1000 * 60 * 60 * 24 * 7 }));

require('./app/routes.js')(app);

app.listen(app.get('port'), app.get('ipaddr'), function () {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;