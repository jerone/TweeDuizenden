var Game = require('../models/Game');


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
  Game.find({}, function (err, games) {
    if (err) return console.error(err);
    
    var gamesMap = {};
    
    games.forEach(function (game) {
      gamesMap[game._id] = game;
    });
    
    res.render('game/index', {
      title: 'Games',
      games: gamesMap
    });
  });
};

exports.add = function (req, res) {
  res.render('game/add', {
    title: 'Add Game',
    name: new Date().getTime(),
    players: 'Player 1\nPlayer 2\nPlayer 3'
  });
};

exports.start = function (req, res) {
  if (req.body.name && req.body.players) {
    var name = req.body.name,
        players = req.body.players.split('\r\n');
    
    res.render('game/start', {
      title: 'Start Game ' + name,
      name: name,
      players: players,
      wild: ["-"],
      score: {}
    });
  } else {
    res.redirect('/game/add');
  }
};

// TODO: check for duplicates;
exports.save = function (req, res) {
  if (req.body.name && req.body.players) {
    var name = req.body.name,
        players = req.body.players.split(','),
        wild = req.body['g2000n-wild'];
    
    var game = new Game({ name: name });
    game.players = players;
    game.wild = wild;
    for (var i = 0; i < players.length; i++) {
      game.score[players[i]] = req.body['g2000n-player-' + i];
    }
    game.save(function (err) {
      if (err) return console.error(err);
      res.render('game/start', {
        title: 'Start Game ' + game.name,
        name: game.name,
        players: game.players,
        wild: game.wild,
        score: game.score
      });
    });
  } else {
    res.redirect('/game/add');
  }
};

exports.open = function (req, res) {
  if (req.params.name) {
    Game.findOne({ name: req.params.name.toString() }, function (err, game) {
      if (err) return console.error(err);
      
      if (game) {
        
        res.render('game/start', {
          title: 'Start Game ' + game.name,
          name: game.name,
          players: game.players,
          wild: game.wild || ["-"],
          score: game.score || {}
        });
      } else {
        res.send("no game!!!");
        return;
      }
    });
  } else {
    res.redirect('/game');
  }
};

exports.delete = function (req, res) {
  if (req.params.name) {
    Game.findOneAndRemove({ name: req.params.name.toString() }, function (err, game) {
      if (err) return console.error(err);
      
      res.redirect('/game');
    });
  } else {
    res.redirect('/game');
  }
};
