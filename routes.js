var debugController = require('./controllers/debug');
var homeController = require('./controllers/home');
var gameController = require('./controllers/game');

module.exports = function (app) {
  
  app.route('/').get(homeController.index);
  
  app.route('/game').get(gameController.index);
  app.route('/game/rules').get(gameController.rules);
  app.route('/game/add').get(gameController.add);
  app.route('/game/start').all(gameController.start);
  app.route('/game/api').all(gameController.api);
  app.route('/game/save').all(gameController.save);
  app.route('/game/open/:name').all(gameController.open);
  app.route('/game/delete/:name').all(gameController.delete);
  
  // debugController.all
  
  // Handle 404;
  app.use(function (req, res) {
    res.status(400).render('error', {
      title: '404: File Not Found',
      code: 404,
      message: 'This is not the page you\'re looking for!'
    });
  });
  
  // Handle 500;
  app.use(function (error, req, res, next) {
    res.status(500).render('error', {
      title: '500: Internal Server Error',
      code: 505,
      message: error
    });
  });
};