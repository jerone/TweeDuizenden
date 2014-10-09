var Game = require('../models/Game'),
    Flash = require('../models/Flash'),
    helpers = require('./../lib/helpers'),
    EOL = require('os').EOL;

exports.api = function (req, res) {
  Game.find({}, function (err, games) {
    var gamesMap = {};

    games.forEach(function (game) {
      gamesMap[game._id] = game;
    });

    res.send(gamesMap);
  });
};

exports.index = function (req, res) {
  var admin = typeof req.query.admin !== 'undefined';
  Game.find({}, function (err, games) {
    if (err) return console.error(err);

    var gamesMap = {};

    games.forEach(function (game) {
      gamesMap[game._id] = game;
    });

    res.render('game/index', {
      title: req.i18n.t('game:index.title'),
      admin: admin,
      games: gamesMap
    });
  });
};

exports.rules = function (req, res) {
  res.render('game/rules', { title: req.i18n.t('game:rules.title') });
};

exports.add = function (req, res) {
  if (req.body.addPlayer === 'addPlayer') {
    var body = req.body;
    body.title = req.i18n.t('game:add.title');
    body.playersCount = parseInt(body.playersCount) + 1;
    body.players.push(req.i18n.t('game:add.players.default', { '#': body.playersCount }));
    res.render('game/add', body);
  } else {
    var timestamp = new Date(),
        lang = req.i18n.lng();
    res.render('game/add', {
      title: req.i18n.t('game:add.title'),
      name: req.i18n.t('game:add.name.default', {
        date: helpers.getLocaleDateString(timestamp, lang),
        time: helpers.getLocaleTimeString(timestamp, lang)
      }),
      playersCount: 3,
      players: [req.i18n.t('game:add.players.default', { '#': 1 }),
                req.i18n.t('game:add.players.default', { '#': 2 }),
                req.i18n.t('game:add.players.default', { '#': 3 })]
    });
  }
};

exports.start = function (req, res) {
  // coming from /game/add
  if (req.body.addPlayer === 'addPlayer') {
    res.redirect(307, '/game/add');
  } else if (req.body.name && req.body.players.length) {
    Game.find({ name: req.body.name }, function (err, games) {
      if (err) return console.error(err);

      if (games.length === 0) {
        res.render('game/start', {
          title: req.i18n.t('game:start.title', { name: req.body.name }),
          name: req.body.name.trim(),
          players: req.body.players.map(function (player) {
            return player.trim();
          }),
          wild: ['-'],
          score: {}
        });
      } else {
        req.flash(Flash.error, {
          message: req.i18n.t('game:start.error.exists')
        });

        res.redirect('/game/add');
      }
    });
  } else {
    if (!req.body.name) {
      req.flash(Flash.warning, {
        message: req.i18n.t('game:start.warning.no_name')
      });
    }
    if (!req.body.players || !req.body.players.length) {
      req.flash(Flash.warning, {
        message: req.i18n.t('game:start.warning.no_players')
      });
    }

    res.redirect('/game/add');
  }
};

exports.save = function (req, res) {
  if (req.body.name && req.body.players) {
    var name = req.body.name,
        players = req.body.players.split(','),
        wild = req.body.wild;

    Game.findOne({ name: name }, function (err, game) {
      if (err) return console.error(err);

      if (!game) {
        game = new Game({
          name: name,
          players: players
        });
      }

      game.wild = wild;

      game.score = {};  // Resetting is required to save the score;
      for (var i = 0; i < players.length; i++) {
        game.score[players[i]] = req.body['player-' + i];
      }

      game.save(function (err) {
        if (err) return console.error(err);

        req.flash(Flash.info, {
          message: req.i18n.t('game:save.info.saved'),
          fadeout: true
        });

        res.redirect('/game/open/' + encodeURIComponent(game.name));
      });
    });
  } else {
    res.redirect('/game/add');
  }
};

exports.open = function (req, res) {
  if (req.params.name) {
    Game.findOne({ name: req.params.name }, function (err, game) {
      if (err) return console.error(err);

      if (game) {
        res.render('game/start', {
          title: req.i18n.t('game:open.title', { name: game.name }),
          name: game.name,
          players: game.players,
          wild: game.wild || ['-'],
          score: game.score || {}
        });
      } else {
        // TODO
        res.send('no game!!!');
      }
    });
  } else {
    res.redirect('/game');
  }
};

exports.delete = function (req, res) {
  if (req.params.name) {
    Game.findOneAndRemove({ name: req.params.name }, function (err, game) {
      if (err) return console.error(err);

      if (req.xhr) {
        res.send({ error: false });
      } else {
        res.redirect('/game?admin');
      }
    });
  } else {
    Game.remove({}, function (err) {
      if (err) return console.error(err);

      if (req.xhr) {
        res.send({ error: false });
      } else {
        res.redirect('/game?admin');
      }
    });
  }
};
