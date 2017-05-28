var helmet = require('helmet');

module.exports = function securityHeaders() {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'getfirebug.com'],
        scriptSrc: ["'self'", '*.google-analytics.com', 'getfirebug.com', "'unsafe-eval'", function (req, res) {
          return "'nonce-" + res.locals.nonce + "'";
        }],
        imgSrc: ["'self'", '*.google-analytics.com', 'getfirebug.com']
      }
    },
    referrerPolicy: {
      policy: 'origin-when-cross-origin'
    }
  });
};