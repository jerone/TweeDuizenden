var homeController = require('./controllers/home');
var gameController = require('./controllers/game');
//var debugController = require('./controllers/debug');

module.exports = function (app) {
  
  // Handle current menu item;
  app.use(function (req, res, next) {
    res.locals.menuParts = require('url').parse(req.url).pathname.substring(1).toLowerCase().split('/');
    next();
  });
  
  // Handle home;
  app.route('/').get(homeController.index);
  
  // Handle game pages;
  app.route('/game').get(gameController.index);
  app.route('/game/rules').get(gameController.rules);
  app.route('/game/add').get(gameController.add);
  app.route('/game/start').all(gameController.start);
  app.route('/game/api').all(gameController.api);
  app.route('/game/save').all(gameController.save);
  app.route('/game/open/:name').all(gameController.open);
  app.route('/game/delete/:name').all(gameController.delete);
  app.route('/game/deleteAll').all(gameController.deleteAll);
  
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
