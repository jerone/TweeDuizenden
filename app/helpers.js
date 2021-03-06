'use strict';

var qs = require('querystring'),
  url = require('url');


var areIntlLocalesSupported = require('intl-locales-supported');

var localesMyAppSupports = ['en-US', 'en-CA', 'nl-NL'];

if (global.Intl) {
  // Determine if the built-in `Intl` has the locale data we need.
  if (!areIntlLocalesSupported(localesMyAppSupports)) {
    // `Intl` exists, but it doesn't have the data we need, so load the
    // polyfill and patch the constructors we need with the polyfill's.
    var IntlPolyfill = require('intl');
    Intl.NumberFormat = IntlPolyfill.NumberFormat;
    Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
  }
} else {
  // No `Intl`, so use and load the polyfill.
  global.Intl = require('intl');
}

if (Intl.__disableRegExpRestore) {
  Intl.__disableRegExpRestore();
}

function helpers() {
  return function (req, res, next) {

    /*
     * Work-around to convert date to a locale date, independent of the timezone.
     * Keep in place until one of the following solutions is implemented:
     *  - https://github.com/joyent/node/pull/7719
     *  - https://github.com/andyearnshaw/Intl.js/issues/19
     */
    var getLocaleDateTimeWithTimeZone = function (datetime) {
      var date = new Date(datetime),
        gmt = date.getTimezoneOffset() * 60000,
        timezone = 0;
      switch (req.language) {
        case 'nl-NL':
          {
            timezone = 2 * 60;
            break;
          }
        case 'en-CA':
          {
            timezone = -4 * 60;
            break;
          }
        case 'en-US':
        default: {
          // Use UTC time.
          break;
        }
      }
      timezone *= 60000;
      return new Date(date.getTime() + gmt + timezone);
    };
    function getLocaleDateString(datetime) {
      var dateTimeWithTimeZone = getLocaleDateTimeWithTimeZone(datetime);
      console.log("-------- getLocaleDateString", datetime, dateTimeWithTimeZone, req.language);
      return new Intl.DateTimeFormat(req.language, { year: 'numeric', month: 'numeric', day: 'numeric' }).format(dateTimeWithTimeZone);
    }
    function getLocaleTimeString(datetime) {
      var dateTimeWithTimeZone = getLocaleDateTimeWithTimeZone(datetime);
      console.log("-------- getLocaleTimeString", datetime, dateTimeWithTimeZone, req.language);
      return new Intl.DateTimeFormat(req.language, { hour: 'numeric', minute: 'numeric' }).format(dateTimeWithTimeZone);
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

    // `originalUrl` usually is `req.header('referrer')` or `req.url`.
    function redirect(status, path, query, originalUrl) {
      if (isNaN(status)) {
        originalUrl = query;
        query = path;
        path = status;
      }
      var queryParams = {};
      if (originalUrl) {
        queryParams = qs.parse(url.parse(originalUrl).query);
      }
      Object.keys(query).forEach(function (key) {
        queryParams[key] = query[key];
      });
      var queryParamsString = qs.stringify(queryParams);
      if (queryParamsString) { path = path + '?' + queryParamsString; }
      res.redirect(path);
    }

    var helpers = {
      getLocaleDateString: getLocaleDateString,
      getLocaleTimeString: getLocaleTimeString,
      isActiveMenu: isActiveMenu,
      redirect: redirect
    };
    if (res) {
      res.locals.helpers = helpers;
      next && next();
    } else {
      return helpers;
    }
  };
}
module.exports = helpers;
