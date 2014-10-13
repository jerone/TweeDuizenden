var Game = require('../models/Game'),
    Flash = require('../models/Flash'),
    helpers = require('./../lib/helpers'),
    EOL = require('os').EOL;

exports.api = function (req, res) {
  Game.find({}, function (err, games) {
    if (err) return console.error(err);

    var gamesList = {};
    games.forEach(function (game) {
      gamesList[game._id] = game;
    });
    res.send(gamesList);
  });
};

exports.index = function (req, res) {
  Game.find({}, function (err, games) {
    if (err) return console.error(err);

    var gamesList = {};
    games.forEach(function (game) {
      gamesList[game._id] = game;
    });
    res.render('game/index', {
      title: req.i18n.t('game:index.title'),
      admin: typeof req.query.admin !== 'undefined',
      games: gamesList
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
    body.isAdd = true;
    body.playersCount = parseInt(body.playersCount) + 1;
    body.players.push(req.i18n.t('game:edit.players.default', { '#': body.playersCount }));
    res.render('game/edit', body);
  } else {
    var timestamp = new Date(),
        lang = req.i18n.lng();
    res.render('game/edit', {
      title: req.i18n.t('game:add.title'),
      isAdd: true,
      name: req.i18n.t('game:edit.name.default', {
        date: helpers.getLocaleDateString(timestamp, lang),
        time: helpers.getLocaleTimeString(timestamp, lang)
      }),
      playersCount: 3,
      players: [req.i18n.t('game:edit.players.default', { '#': 1 }),
                req.i18n.t('game:edit.players.default', { '#': 2 }),
                req.i18n.t('game:edit.players.default', { '#': 3 })]
    });
  }
};

exports.edit = function (req, res) {
  if (req.body.addPlayer === 'addPlayer') {
    var body = req.body;
    body.title = req.i18n.t('game:edit.title', { name: req.body.name });
    body.isAdd = false;
    body.playersCount = parseInt(body.playersCount) + 1;
    body.players.push(req.i18n.t('game:edit.players.default', { '#': body.playersCount }));
    res.render('game/edit', body);
  } else if (req.params.name) {
    Game.findOne({ name: req.params.name }, function (err, game) {
      if (err) return console.error(err);

      if (game) {
        res.render('game/edit', {
          title: req.i18n.t('game:edit.title', { name: game.name }),
          isAdd: false,
          name: game.name,
          playersCount: game.players.length,
          players: game.players
        });
      } else {
        // TODO;
        res.send('no game!!!');
      }
    });
  } else {
    res.redirect('/game');
  }
};

exports.save = function (req, res) {
  if (req.body.addPlayer === 'addPlayer') {
    // Coming from `/game/add` or `/game/edit/:name`;
    res.redirect(307, req.header('referrer'));
  } else {
    var name = req.body.name && req.body.name.trim(),
        players = req.body.players.map(function (player) {
          return player.trim();
        }).filter(function (player) {
          return player;
        });
    if (name && players.length) {
      Game.findOne({ name: name }, function (err, game) {
        if (err) return console.error(err);

        if (!game) {
          game = new Game();
        }

        game.name = name;
        game.players = players;

        game.save(function (err) {
          if (err) return console.error(err);

          req.flash(Flash.info, {
            message: req.i18n.t('game:view.info.saved'),
            fadeout: true
          });

          res.redirect('/game/view/' + encodeURIComponent(game.name));
        });
      });
    } else {
      if (!name) {
        req.flash(Flash.warning, {
          message: req.i18n.t('game:edit.warning.no_name')
        });
      }
      if (!players.length) {
        req.flash(Flash.warning, {
          message: req.i18n.t('game:edit.warning.no_players')
        });
      }

      res.redirect('/game/add');
    }
  }
};

exports.update = function (req, res) {
  if (req.body.name && req.body.players) {
    var name = req.body.name,
        players = req.body.players.split(','),
        wild = req.body.wild;

    Game.findOne({ name: name }, function (err, game) {
      if (err) return console.error(err);

      if (game) {
        game.wild = wild;

        game.score = {};  // Resetting is required to save the score;
        for (var i = 0; i < players.length; i++) {
          game.score[players[i]] = req.body['player-' + i];
        }

        game.save(function (err) {
          if (err) return console.error(err);

          req.flash(Flash.info, {
            message: req.i18n.t('game:view.info.saved'),
            fadeout: true
          });

          res.redirect('/game/view/' + encodeURIComponent(game.name));
        });
      } else {
        req.flash(Flash.error, {
          message: req.i18n.t('game:index.error.missing')
        });

        res.redirect('/game');
      }
    });
  } else {
    res.redirect('/game');
  }
};

exports.view = function (req, res) {
  if (req.params.name) {
    Game.findOne({ name: req.params.name }, function (err, game) {
      if (err) return console.error(err);

      if (game) {
        res.render('game/view', {
          title: req.i18n.t('game:view.title', { name: game.name }),
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
