var n = require('nonce')();

module.exports = function nonce() {
  return function (req, res, next) {
    res.locals.nonce = n();
    next();
  };
};