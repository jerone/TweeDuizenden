var url = require('url');

var homeController = require('./../controllers/home');
var gameController = require('./../controllers/game');
//var debugController = require('./../controllers/debug');

module.exports = function (app) {
  
  // Handle flash;
  app.use(function (req, res, next) {
    res.locals.flash = req.flash();
    next();
  });
  
  // Handle current menu item;
  app.use(function (req, res, next) {
    res.locals.menuParts = url.parse(req.url).pathname.substring(1).toLowerCase().split('/');
    next();
  });
  
  // Handle i18n;
  app.use(function (req, res, next) {
    if (req.query.lang) {
      res.redirect('back');
    } else {
      next();
    }
  });
  
  // Handle home;
  app.route('/').get(homeController.index);
  
  // Handle game pages;
  app.route('/game').get(gameController.index);
  app.route('/game/rules').get(gameController.rules);
  app.route('/game/add').get(gameController.add);
  app.route('/game/start').get(gameController.start).post(gameController.start);
  app.route('/game/api').get(gameController.api);
  app.route('/game/save').get(gameController.save).post(gameController.save);
  app.route('/game/open/:name').get(gameController.open);
  app.route('/game/delete').delete(gameController.delete);
  app.route('/game/delete/:name').delete(gameController.delete);
  
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
