var url = require('url');
require('intl');

function helpers(name) {
  return function (req, res, next) {

    /*
     * Work-around to convert date to a locale date, independed of the timezone.
     * Keep in place until one of the following solutions is implemented:
     *  - https://github.com/joyent/node/pull/7719
     *  - https://github.com/andyearnshaw/Intl.js/issues/19
     */
    var getLocaleString = function (datetime) {
      var date = new Date(datetime),
          gmt = date.getTimezoneOffset() * 60000,
          timezone = 0;
      switch (req.i18n.lng()) {
        case 'nl-NL':
          { timezone = 120; }
      }
      timezone *= 60000;
      return new Date(date.getTime() + gmt + timezone);
    };
    function getLocaleDateString(datetime) {
      return getLocaleString(datetime).toLocaleDateString(req.i18n.lng());
    }
    function getLocaleTimeString(datetime) {
      return getLocaleString(datetime).toLocaleTimeString(req.i18n.lng());
    }

    function isActiveMenu() {
      var menuParts = url.parse(req.url).pathname.substring(1).toLowerCase().split('/');
      return Array.prototype.slice.call(arguments, 0).every(function (menuPart) {
        var inverse = menuPart.indexOf('!') === 0;
        inverse && (menuPart = menuPart.replace('!', ''));
        var index = menuParts.indexOf(menuPart);
        return inverse ? index === -1 : index >= 0;
      });
    }

    res.locals.helpers = {
      getLocaleDateString : getLocaleDateString,
      getLocaleTimeString : getLocaleTimeString,
      isActiveMenu : isActiveMenu
    };

    next();
  };
}
module.exports = helpers
