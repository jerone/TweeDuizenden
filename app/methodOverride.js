var methodOverride = require('method-override');

module.exports = function methodOverrideCustom() {
  return methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  });
};
