var debugController = require('./controllers/debug');
var homeController = require('./controllers/home');
var gameController = require('./controllers/game');

module.exports = function (app) {

  app.route('/').get(homeController.index);

  app.route('/game').get(gameController.index);
  app.route('/game/add').get(gameController.add);
  app.route('/game/start').all(gameController.start);
  app.route('/game/api').all(gameController.api);
  app.route('/game/save').all(gameController.save);
  app.route('/game/open/:name').all(gameController.open);
  app.route('/game/delete/:name').all(gameController.delete);

  // debugController.all
};