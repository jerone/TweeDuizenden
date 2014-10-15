var url = require('url');

var homeController = require('./../controllers/home');
var gameController = require('./../controllers/game');
var debugController = require('./../controllers/debug');

module.exports = function routes(app) {

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

  // Handel debug;
  app.route('/debug').get(debugController.index);

  // Handle game pages;
  app.route('/game').get(gameController.index);
  app.route('/game/rules').get(gameController.rules);
  app.route('/game/add').get(gameController.add).post(gameController.add);
  app.route('/game/save').post(gameController.save);
  app.route('/game/view/:name').get(gameController.view);
  app.route('/game/update').post(gameController.update);
  app.route('/game/delete').delete(gameController.delete);
  app.route('/game/delete/:name').delete(gameController.delete);
  app.route('/game/edit/:name').get(gameController.edit).post(gameController.edit);
  app.route('/game/api').get(gameController.api);

  // Handle 404;
  app.use(function (req, res) {
    res.status(400).render('error', {
      title: req.i18n.t('error:404.title'),
      code: 404,
      message: req.i18n.t('error:404.message')
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
