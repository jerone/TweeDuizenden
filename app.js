var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var MongoStore = require('connect-mongo')({ session: session });
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var less = require('less-middleware');
var secrets = require('./config/secrets');
var app = express();

mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000);
app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || process.env.OPENSHIFT_INTERNAL_IP || 'localhost');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
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
app.use(flash());

app.use(less(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 1000 * 60 * 60 * 24 * 7 }));

require('./routes.js')(app);

app.listen(app.get('port'), app.get('ipaddr'), function () {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;