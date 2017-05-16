'use strict';

var Game = require('../models/Game'),
  GameTypes = require('../models/GameTypes'),
  Flash = require('../models/Flash'),
  PlayerEdit = require('../models/PlayerEdit'),
  qs = require('querystring'),
  moment = require('moment'),
  url = require('url');

exports.index = function (req, res, next) {
  Game.find({}, function (err, games) {
    if (err) { return next(err); }

    var queryParams = qs.parse(url.parse(req.url).query),
      orderByDefault = 'createdAt',
      orderByQuery = decodeURIComponent(req.query.orderBy),
      orderDirQuery = decodeURIComponent(req.query.orderDir),
      orderDirSort = orderDirQuery !== 'desc' ? 1 : -1,
      orderDirFn = function (orderBy) {
        queryParams.orderBy = orderBy;
        if ((!orderByQuery && orderBy === orderByDefault) || (orderByQuery === orderBy && orderDirQuery !== 'desc')) {
          queryParams.orderDir = 'desc';
        } else {
          queryParams.orderDir = 'asc';
        }

        var icon = '';
        if ((!orderByQuery && orderBy === orderByDefault) || (orderByQuery === orderBy)) {
          if (orderDirQuery !== 'desc') {
            icon = 'glyphicon-arrow-down';
          } else {
            icon = 'glyphicon-arrow-up';
          }
        }

        return {
          href: '/game?' + qs.stringify(queryParams),
          icon: icon
        };
      },
      orderDirs = {
        _id: orderDirFn('_id'),
        name: orderDirFn('name'),
        type: orderDirFn('type'),
        createdAt: orderDirFn('createdAt'),
        updatedAt: orderDirFn('updatedAt')
      };

    games.sort(function (a, b) {
      if (typeof a[orderByQuery] === 'string') {
        // `localeCompare` doesn't work.
        if (a[orderByQuery].toLowerCase() < b[orderByQuery].toLowerCase()) { return orderDirSort * -1; }
        if (a[orderByQuery].toLowerCase() > b[orderByQuery].toLowerCase()) { return orderDirSort * 1; }
      } else {
        if (a[orderByQuery] < b[orderByQuery]) { return orderDirSort * -1; }
        if (a[orderByQuery] > b[orderByQuery]) { return orderDirSort * 1; }
      }
      if (orderByQuery !== orderByDefault) {
        if (a[orderByDefault] < b[orderByDefault]) { return -1; }
        if (a[orderByDefault] > b[orderByDefault]) { return 1; }
      }
      return 0;
    });

    res.render('game/index', {
      title: req.i18n.t('game:index.title'),
      admin: typeof req.query.admin !== 'undefined',
      orderDir: orderDirs,
      games: games,
      gameTypes: GameTypes.toI18n(req.i18n)
    });
  });
};

exports.rules = function (req, res) {
  res.render('game/rules', { title: req.i18n.t('game:rules.title') });
};

exports.add = function (req, res) {
  if (req.body.addPlayer !== undefined) {
    req.body.title = req.i18n.t('game:add.title');
    req.body.isAdd = true;
    req.body.isPlayerAction = 1;
    req.body.gameTypes = GameTypes.toI18n(req.i18n);
    req.body.players.push(new PlayerEdit('', req.body.players.length));
    res.render('game/edit', req.body);
  } else if (req.body.removePlayer !== undefined) {
    var index = parseInt(req.body.removePlayer, 10);
    req.body.title = req.i18n.t('game:add.title');
    req.body.isAdd = true;
    req.body.isPlayerAction = -1;
    req.body.gameTypes = GameTypes.toI18n(req.i18n);
    req.body.players.splice(index, 1);
    res.render('game/edit', req.body);
  } else if (req.body.upPlayer !== undefined) {
    var index = parseInt(req.body.upPlayer, 10);
    req.body.title = req.i18n.t('game:add.title');
    req.body.isAdd = true;
    req.body.isPlayerAction = -1;
    req.body.gameTypes = GameTypes.toI18n(req.i18n);
    req.body.players[index] = req.body.players.splice(index - 1, 1, req.body.players[index])[0];
    res.render('game/edit', req.body);
  } else if (req.body.downPlayer !== undefined) {
    var index = parseInt(req.body.downPlayer, 10);
    req.body.title = req.i18n.t('game:add.title');
    req.body.isAdd = true;
    req.body.isPlayerAction = -1;
    req.body.gameTypes = GameTypes.toI18n(req.i18n);
    req.body.players[index] = req.body.players.splice(index + 1, 1, req.body.players[index])[0];
    res.render('game/edit', req.body);
  } else {
    if (req.body.name !== undefined) {
      req.body.title = req.i18n.t('game:add.title');
      req.body.isAdd = true;
      req.body.isPlayerAction = 2;
      req.body.gameTypes = GameTypes.toI18n(req.i18n);
      res.render('game/edit', req.body);
    } else {
      var isPlayerAction = 0,
        timestamp = new Date(),
        name = req.i18n.t('game:edit.name.default', {
          date: encodeURIComponent(encodeURIComponent(res.locals.helpers.getLocaleDateString(timestamp))),
          time: encodeURIComponent(encodeURIComponent(res.locals.helpers.getLocaleTimeString(timestamp)))
        }),
        type = GameTypes.getDefault().key,
        players = [new PlayerEdit('', 0), new PlayerEdit('', 1)];

      if (req.query.name) {
        name = decodeURIComponent(req.query.name);
        isPlayerAction = 2;
      }
      if (req.query.type) {
        type = decodeURIComponent(req.query.type);
      }
      if (req.query.players) {
        players = [];
        req.query.players.split(',').forEach(function (player, index) {
          players.push(new PlayerEdit(decodeURIComponent(player), index));
        });
      }

      res.render('game/edit', {
        title: req.i18n.t('game:add.title'),
        isAdd: true,
        isPlayerAction: isPlayerAction,
        previousName: '',
        name: decodeURIComponent(decodeURIComponent(name)),
        type: type,
        gameTypes: GameTypes.toI18n(req.i18n),
        players: players
      });
    }
  }
};

exports.clone = function (req, res, next) {
  if (req.params.name) {
    Game.findOne({ name: decodeURIComponent(req.params.name) }, function (err, game) {
      if (err) { return next(err); }

      if (game) {
        res.locals.helpers.redirect('/game/add', {
          name: encodeURIComponent(game.name),
          type: encodeURIComponent(game.type),
          players: game.players.map(function (player) { return encodeURIComponent(player); }).join(',')
        });
      } else {
        req.flash(Flash.error, {
          message: req.i18n.t('game:common.error.missing')
        });

        res.redirect('/game/add');
      }
    });
  } else {
    res.redirect('/game/add');
  }
}

exports.edit = function (req, res, next) {
  if (req.body.addPlayer !== undefined) {
    req.body.title = req.i18n.t('game:edit.title', { name: req.params.name });
    req.body.isAdd = false;
    req.body.isPlayerAction = 1;
    req.body.gameTypes = GameTypes.toI18n(req.i18n);
    req.body.players.push(new PlayerEdit('', req.body.players.length));
    res.render('game/edit', req.body);
  } else if (req.body.removePlayer !== undefined) {
    var index = parseInt(req.body.removePlayer, 10);
    req.body.title = req.i18n.t('game:edit.title', { name: req.params.name });
    req.body.isAdd = false;
    req.body.isPlayerAction = -1;
    req.body.gameTypes = GameTypes.toI18n(req.i18n);
    req.body.players.splice(index, 1);
    res.render('game/edit', req.body);
  } else if (req.body.upPlayer !== undefined) {
    var index = parseInt(req.body.upPlayer, 10);
    req.body.title = req.i18n.t('game:edit.title', { name: req.params.name });
    req.body.isAdd = false;
    req.body.isPlayerAction = -1;
    req.body.gameTypes = GameTypes.toI18n(req.i18n);
    req.body.players[index] = req.body.players.splice(index - 1, 1, req.body.players[index])[0];
    res.render('game/edit', req.body);
  } else if (req.body.downPlayer !== undefined) {
    var index = parseInt(req.body.downPlayer, 10);
    req.body.title = req.i18n.t('game:edit.title', { name: req.params.name });
    req.body.isAdd = false;
    req.body.isPlayerAction = -1;
    req.body.gameTypes = GameTypes.toI18n(req.i18n);
    req.body.players[index] = req.body.players.splice(index + 1, 1, req.body.players[index])[0];
    res.render('game/edit', req.body);
  } else if (req.params.name) {
    Game.findOne({ name: decodeURIComponent(req.params.name) }, function (err, game) {
      if (err) { return next(err); }

      if (game) {
        if (req.body.name !== undefined && req.body.previousName !== undefined &&
          req.body.name !== req.body.previousName) {
          req.body.title = req.i18n.t('game:edit.title', { name: req.params.name });
          req.body.isAdd = false;
          req.body.isPlayerAction = 0;
          req.body.gameTypes = GameTypes.toI18n(req.i18n);
          res.render('game/edit', req.body);
        } else {
          var players = [];
          game.players.forEach(function (player, index) {
            players.push(new PlayerEdit(player, index));
          });

          res.render('game/edit', {
            title: req.i18n.t('game:edit.title', { name: game.name }),
            isAdd: false,
            isPlayerAction: 0,
            previousName: game.name,
            name: game.name,
            type: game.type,
            gameTypes: GameTypes.toI18n(req.i18n),
            players: players
          });
        }
      } else {
        req.flash(Flash.error, {
          message: req.i18n.t('game:common.error.missing')
        });

        res.redirect('/game');
      }
    });
  } else {
    res.redirect('/game');
  }
};

exports.save = function (req, res, next) {
  if (req.body.addPlayer !== undefined || req.body.removePlayer !== undefined || req.body.upPlayer !== undefined || req.body.downPlayer !== undefined) {
    res.redirect(307, req.header('referrer'));
  } else {
    var name = req.body.name && req.body.name.trim(),
      previousName = req.body.previousName,
      players = req.body.players.map(function (player) {
        player.name = player.name.trim();
        return player;
      }).filter(function (player) { return player.name; });

    if (name && players.length) {
      if (previousName) {
        Game.findOne({ name: previousName }, function (err, game) {
          if (err) { return next(err); }

          if (game) {
            Game.findOne({ name: name }, function (err, gameExisting) {
              if (err) { return next(err); }

              if (gameExisting && previousName !== name) {
                req.flash(Flash.warning, {
                  message: req.i18n.t('game:edit.warning.name')
                });

                res.redirect(307, req.header('referrer'));
                return;
              }

              game.name = name;

              game.type = req.body.type;

              if (Object.keys(game.score).length) {
                var score = {};
                players.forEach(function (player) {
                  var name = player.name !== player.previousName ? player.previousName : player.name;
                  score[player.name] = game.score[name];
                });
                game.score = score;
              }

              game.players = players.map(function (player) { return player.name; });

              game.save(function (err) {
                if (err) { return next(err); }

                req.flash(Flash.info, {
                  message: req.i18n.t('game:view.info.saved'),
                  fadeout: true
                });

                res.redirect('/game/view/' + encodeURIComponent(encodeURIComponent(game.name)));
              });
            });
          } else {
            req.flash(Flash.error, {
              message: req.i18n.t('game:common.error.missing')
            });

            res.redirect('/game/add');
          }
        });
      } else {
        Game.findOne({ name: name }, function (err, gameExisting) {
          if (err) { return next(err); }

          if (gameExisting) {
            req.flash(Flash.warning, {
              message: req.i18n.t('game:edit.warning.name')
            });

            res.redirect(307, req.header('referrer'));
            return;
          }

          var game = new Game();

          game.name = name;

          game.type = req.body.type;

          game.players = players.map(function (player) { return player.name; });

          game.save(function (err) {
            if (err) { return next(err); }

            req.flash(Flash.info, {
              message: req.i18n.t('game:view.info.saved'),
              fadeout: true
            });

            res.redirect('/game/view/' + encodeURIComponent(encodeURIComponent(game.name)));
          });
        });
      }
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

exports.view = function (req, res, next) {
  if (req.params.name) {
    Game.findOne({ name: decodeURIComponent(req.params.name) }, function (err, game) {
      if (err) { return next(err); }

      if (game) {
        res.render('game/view', {
          title: req.i18n.t('game:view.title', { name: game.name }),
          navbarNotFixed: true,
          created: {
            datetime: res.locals.helpers.getLocaleDateString(game.createdAt) + ' ' +
            res.locals.helpers.getLocaleTimeString(game.createdAt),
            timestamp: game.createdAt.getTime(),
            ago: moment(game.createdAt).locale(req.language).fromNow()
          },
          updated: {
            datetime: res.locals.helpers.getLocaleDateString(game.updatedAt) + ' ' +
            res.locals.helpers.getLocaleTimeString(game.updatedAt),
            timestamp: game.updatedAt.getTime(),
            ago: moment(game.updatedAt).locale(req.language).fromNow()
          },
          name: game.name,
          type: GameTypes.getByKey(game.type),
          players: game.players,
          wild: game.wild || ['-'],
          score: game.score || {}
        });
      } else {
        req.flash(Flash.error, {
          message: req.i18n.t('game:common.error.missing')
        });

        res.redirect('/game');
      }
    });
  } else {
    res.redirect('/game');
  }
};

exports.update = function (req, res, next) {
  if (req.body.close !== undefined) {
    res.redirect('/game');
  } else if (req.body.clone !== undefined) {
    if (req.body.name) {
      Game.findOne({ name: req.body.name }, function (err, game) {
        if (err) { return next(err); }

        if (game) {
          res.locals.helpers.redirect('/game/add', {
            name: encodeURIComponent(game.name),
            type: encodeURIComponent(game.type),
            players: game.players.map(function (player) { return encodeURIComponent(player); }).join(',')
          });
        } else {
          req.flash(Flash.error, {
            message: req.i18n.t('game:common.error.missing')
          });

          res.redirect('/game/add');
        }
      });
    } else {
      res.redirect('/game/add');
    }
  } else {
    if (req.body.name) {
      Game.findOne({ name: req.body.name }, function (err, game) {
        if (err) { return req.xhr ? res.send({ error: err }) : next(err); }

        if (game) {
          game.wild = GameTypes.getByKey(game.type).wild ? req.body.wild : [];

          var score = {};
          for (var i = 0; i < game.players.length; i++) {
            score[game.players[i]] = req.body['player-' + i];
          }
          game.score = score;

          game.save(function (err) {
            if (err) { return req.xhr ? res.send({ error: err }) : next(err); }

            if (req.xhr) {
              res.send({
                error: false,
                updated: {
                  datetime: res.locals.helpers.getLocaleDateString(game.updatedAt) + ' ' +
                  res.locals.helpers.getLocaleTimeString(game.updatedAt),
                  timestamp: game.updatedAt.getTime(),
                  ago: moment(game.updatedAt).locale(req.language).fromNow()
                }
              });
            } else {
              if (req.body.saveAndClose !== undefined) {
                res.redirect('/game');
              } else {
                req.flash(Flash.info, {
                  message: req.i18n.t('game:view.info.saved'),
                  fadeout: true
                });

                res.locals.helpers.redirect('/game/view/' + encodeURIComponent(encodeURIComponent(game.name)), {}, req.header('referrer'));
              }
            }
          });
        } else {
          req.flash(Flash.error, {
            message: req.i18n.t('game:common.error.missing')
          });

          res.redirect('/game');
        }
      });
    } else {
      res.redirect('/game');
    }
  }
};

exports.delete = function (req, res, next) {
  if (req.params.name) {
    Game.findOneAndRemove({ name: decodeURIComponent(req.params.name) }, function (err) {
      if (req.xhr) {
        res.send({ error: (err || false) });
      } else if (err) {
        return next(err);
      } else {
        res.locals.helpers.redirect('/game', { admin: true }, req.header('referrer'));
      }
    });
  } else {
    Game.remove({}, function (err) {
      if (req.xhr) {
        res.send({ error: (err || false) });
      } else if (err) {
        return next(err);
      } else {
        res.locals.helpers.redirect('/game', { admin: true }, req.header('referrer'));
      }
    });
  }
};

exports.api = function (req, res, next) {
  Game.find({}, function (err, games) {
    if (err) { return next(err); }
    res.jsonp(games);
  });
};
