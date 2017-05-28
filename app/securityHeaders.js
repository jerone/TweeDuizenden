var helmet = require('helmet');

module.exports = function securityHeaders() {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", '*.google-analytics.com', function (req, res) {
          return "'nonce-" + res.locals.nonce + "'";
        }],
        imgSrc: ["'self'", '*.google-analytics.com']
      }
    },
    referrerPolicy: {
      policy: 'origin-when-cross-origin'
    }
  });
};