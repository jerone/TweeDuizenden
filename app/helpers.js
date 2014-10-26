'use strict';

var qs = require('querystring'),
    url = require('url');
require('intl');

function helpers() {
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

    // `originalUrl` usually is `req.header('referrer')` or `req.url`;
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
      if (queryParamsString) path = path + '?' + queryParamsString;
      res.redirect(path);
    }

    var helpers = {
      getLocaleDateString : getLocaleDateString,
      getLocaleTimeString : getLocaleTimeString,
      isActiveMenu : isActiveMenu,
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
