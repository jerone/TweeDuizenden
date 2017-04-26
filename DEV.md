### Openshift installation

Add Node.js cartridge: https://raw.githubusercontent.com/icflorescu/openshift-cartridge-nodejs/master/metadata/manifest.yml

Add MongoDB cartridge: https://raw.githubusercontent.com/icflorescu/openshift-cartridge-mongodb/master/metadata/manifest.yml

On Windows make sure `.openshift/action_hooks/build` (required for Bower) has correct permissions with:
```
git update-index --chmod=+x .openshift/action_hooks/build
```

### Commit to repo & Openshift

```
git push origin master && git push openshift master
```

### Remaining

ssh into app: `rhc ssh tweeduizenden`<br>
Cd to `cd app-root/runtime/repo`<br>
Install packages `npm install`<br>
Install bower `npm install bower -g` and install packages `HOME=$HOME/app-root/runtime bower install`

---------------------

```
SET NODE_ENV=development && nodemon
export NODE_ENV=development && nodemon
node-inspector & nodemon --debug app.js
export NODE_ENV=development && node-inspector & nodemon --debug app.js
set NODE_ENV=development && nodemon --inspect app.js
nodemon --inspect app.js
```

---------------------

MongoDB:

```
"C:\Program Files\MongoDB\Server\3.4\bin\mongod" --dbpath C:\test\mongodb\data
```

---------------------

* https://openshift.redhat.com/app/console/application/541bffeb4382ec64b60009fb-tweeduizenden
* https://www.mongodb.com/download-center#community
* http://i18next.com/node/
* https://www.npmjs.org/
* http://nodejs.org/api/url.html
* http://jade-lang.com/
* http://mongoosejs.com/docs/guide.html
* http://getbootstrap.com/
* http://scotch.io/bar-talk/expressjs-4-0-new-features-and-upgrading-from-3-0
* https://github.com/icflorescu/openshift-cartridge-mongodb
* https://github.com/mongodb/node-mongodb-native
* https://www.npmjs.org/package/node-inspector