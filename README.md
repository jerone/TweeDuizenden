#TweeDuizenden

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/jerone/TweeDuizenden)
[![Dependency Status](http://img.shields.io/david/jerone/TweeDuizenden.svg)](https://david-dm.org/jerone/TweeDuizenden)
[![Build Status](http://img.shields.io/travis/jerone/TweeDuizenden.svg)](https://travis-ci.org/jerone/TweeDuizenden)
[![Github Issues](http://img.shields.io/github/issues/jerone/TweeDuizenden.svg)](https://github.com/jerone/TweeDuizenden/issues)

Tool to help record statistics for the game called TweeDuizenden.


## Prerequisites

- [Node.js](http://nodejs.org)
- [MongoDB](http://www.mongodb.org)
- [Bower](http://bower.io) (`npm install -g bower`)


## Getting Started

1. Check out or download the source from https://github.com/jerone/TweeDuizenden.
2. Install NPM dependencies `npm install`.
3. Install bower dependencies `bower install`.
4. Start app `node app.js`.
5. Open browser with url [`http://localhost:3000/`](http://localhost:3000/).

:exclamation: **Note:** I highly recommend installing [nodemon](https://github.com/remy/nodemon).
It watches for any changes in your node.js app and automatically restarts the server.
Once installed, instead of `node app.js` use `nodemon app.js`.
It will save you a lot of time in the long run, because you won't need to manually restart the server each time you make a small change in code.
To install, run `npm install -g nodemon`.

:exclamation: **Note:** Another recommendation is [node-inspector](https://www.npmjs.org/package/node-inspector).
This will help you debug all server-side code as it were client-side.
Once installed, instead of `node app.js` use `node-inspector app.js`.
It requires you to debug in Google Chrome as it doesn't work in any other browser.
To install, run `npm install -g node-inspector`.


## Contributing

Please review the [guidelines for contributing](https://github.com/jerone/TweeDuizenden/blob/master/CONTRIBUTING.md) to this repository.


## License

This [project](https://github.com/jerone/TweeDuizenden) is [licensed under MIT](https://github.com/jerone/TweeDuizenden/blob/master/LICENSE).


## NPM Dependencies

* [body-parser](https://www.npmjs.org/package/body-parser)
* [connect-flash](https://www.npmjs.org/package/connect-flash)
* [errorhandler](https://www.npmjs.org/package/errorhandler)
* [express](https://www.npmjs.org/package/express)
* [express-session](https://www.npmjs.org/package/express-session)
* [i18next](https://www.npmjs.org/package/i18next)
* [intl](https://www.npmjs.org/package/intl)
* [jade](https://www.npmjs.org/package/jade)
* [less-middleware](https://www.npmjs.org/package/less-middleware)
* [method-override](https://www.npmjs.org/package/method-override)
* [moment](https://www.npmjs.org/package/moment)
* [mongoose](https://www.npmjs.org/package/mongoose)
* [mongoose-timestamp](https://www.npmjs.org/package/mongoose-timestamp)
* [morgan](https://www.npmjs.org/package/morgan)
* [serve-favicon](https://www.npmjs.org/package/serve-favicon)


## Bower Dependencies

* [bootstrap](http://getbootstrap.com)
* [jquery](http://jquery.com)
* [jquery.floatThead](http://mkoryak.github.io/floatThead/)
