/**
 * GET /
 * Home page.
 */

exports.index = function (req, res) {
	res.render('game/index', { title: 'Game Index' });
};

exports.add = function (req, res) {
	res.render('game/add', {
		title: 'Game Add',
		players: "Player 1\nPlayer 2\nPlayer 3"
	});
};

exports.start = function (req, res) {
	if (typeof req.body.players !== "undefined") {
		var players = req.body.players.split("\n");
		res.render('game/start', {
			title: 'Game Start',
			players: players
		});
	} else {
		res.redirect('/game/add');
	}
};
