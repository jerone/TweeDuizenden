var helmet = require('helmet');

module.exports = function securityHeaders() {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://getfirebug.com'],
        scriptSrc: ["'self'", "'unsafe-eval'", '*.google-analytics.com', 'https://getfirebug.com', function (req, res) {
          return "'nonce-" + res.locals.nonce + "'";
        }],
        imgSrc: ["'self'", '*.google-analytics.com', 'https://getfirebug.com']
      }
    },
    referrerPolicy: {
      policy: 'origin-when-cross-origin'
    }
  });
};