var homeController = require('./controllers/home');
var gameController = require('./controllers/game');

module.exports = function (app) {
	
	app.route('/').get(homeController.index);
	
	app.route('/game').get(gameController.index);
	app.route('/game/add').get(gameController.add);
	app.route('/game/start').all(gameController.start);

};