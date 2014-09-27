var Game = require('../models/Game'),
    Flash = require('../models/Flash');
require('intl');

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
      title: 'Games',
      admin: admin,
      games: gamesMap
    });
  });
};

exports.rules = function (req, res) {
  res.render('game/rules', { title: 'Game Rules' });
};

exports.add = function (req, res) {
  res.render('game/add', {
    title: 'Add Game',
    name: new Date().toLocaleDateString('nl-NL') + ' ' + new Date().toLocaleTimeString('nl-NL'),
    players: 'Player 1\nPlayer 2\nPlayer 3'
  });
};

exports.start = function (req, res) {
  if (req.body.name && req.body.players) {
    var name = req.body.name,
        players = req.body.players.split('\r\n');
    
    Game.find({ name: name }, function (err, games) {
      if (err) return console.error(err);
      
      if (games.length === 0) {
        res.render('game/start', {
          title: 'Start Game ' + name,
          name: name,
          players: players,
          wild: ['-'],
          score: {}
        });
      } else {
        req.flash(Flash.error, {
          message: 'The name for this game already exists! Please define another name.'
        });
        
        res.redirect('/game/add');
      }
    });
  } else {
    if (!req.body.name) {
      req.flash(Flash.warning, {
        message: 'No name defined!'
      });
    }
    if (!req.body.players) {
      req.flash(Flash.warning, {
        message: 'No players defined!'
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
          message: 'Game is saved.',
          fadeout: true
        });
        
        res.redirect('/game/open/' + game.name);
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
          title: 'Start Game ' + game.name,
          name: game.name,
          players: game.players,
          wild: game.wild || ['-'],
          score: game.score || {}
        });
      } else {
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
      
      res.redirect('/game?admin');
    });
  } else {
    Game.remove({}, function (err) {
      if (err) return console.error(err);
      
      res.redirect('/game?admin');
    });
  }
};
