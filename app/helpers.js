require('intl');

/*
 * Work-around to convert date to a locale date, independed of the timezone.
 * Keep in place until one of the following solutions is implemented:
 *  - https://github.com/joyent/node/pull/7719
 *  - https://github.com/andyearnshaw/Intl.js/issues/19
 */
var getLocaleString = function (datetime, lang) {
  var date = new Date(datetime),
      gmt = date.getTimezoneOffset() * 60000,
      timezone = 0;
  switch (lang) {
    case 'nl-NL':
      { timezone = 120; }
  }
  timezone *= 60000;
  return new Date(date.getTime() + gmt + timezone);
};
exports.getLocaleDateString = function (datetime, lang) {
  return getLocaleString(datetime, lang).toLocaleDateString(lang);
};
exports.getLocaleTimeString = function (datetime, lang) {
  return getLocaleString(datetime, lang).toLocaleTimeString(lang);
};
