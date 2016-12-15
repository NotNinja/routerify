    8888888b.                   888                    d8b  .d888
    888   Y88b                  888                    Y8P d88P"
    888    888                  888                        888
    888   d88P .d88b.  888  888 888888 .d88b.  888d888 888 888888 888  888
    8888888P" d88""88b 888  888 888   d8P  Y8b 888P"   888 888    888  888
    888 T88b  888  888 888  888 888   88888888 888     888 888    888  888
    888  T88b Y88..88P Y88b 888 Y88b. Y8b.     888     888 888    Y88b 888
    888   T88b "Y88P"   "Y88888  "Y888 "Y8888  888     888 888     "Y88888
                                                                       888
                                                                  Y8b d88P
                                                                   "Y88P"

[Routerify](https://github.com/Skelp/routerify) is an opinionated router loader for Express-like applications.

[![Build](https://img.shields.io/travis/Skelp/routerify/develop.svg?style=flat-square)](https://travis-ci.org/Skelp/routerify)
[![Dependencies](https://img.shields.io/david/Skelp/routerify.svg?style=flat-square)](https://david-dm.org/Skelp/routerify)
[![Dev Dependencies](https://img.shields.io/david/dev/Skelp/routerify.svg?style=flat-square)](https://david-dm.org/Skelp/routerify#info=devDependencies)
[![License](https://img.shields.io/npm/l/routerify.svg?style=flat-square)](https://github.com/Skelp/routerify/blob/master/LICENSE.md)
[![Release](https://img.shields.io/npm/v/routerify.svg?style=flat-square)](https://www.npmjs.com/package/routerify)

* [Install](#install)
* [Configurations](#configurations)
* [API](#api)
* [Bugs](#bugs)
* [Contributors](#contributors)
* [License](#license)

## Install

``` bash
$ npm install --save routerify
```

You'll need to have at least [Node.js](https://nodejs.org) 6 or newer.

## Configurations

Routerify is opinionated. Routerify is also configurable and extensible. The two core concepts that Routerify has are
*Registrars* and *Mounters*. Through these, Routerify can be configured to load routes from modules in any pattern and
mount them onto any server.
 
### Registrars

Registrars are responsible for picking which source files within the directory should be loaded as modules and how the
routes are extracted from the modules. These routes are then passed to the mounter.

Routerify includes some opinionated registrars. If you don't like our opinion, you can either not use Routerify **or**
you can simply [create your own](#create-your-own-registrar) and, optionally,
[create a pull request](https://github.com/Skelp/routerify/compare) to share it with everyone, provided our opinions
match :) If not, you can always release it as a plugin.

#### `VerbRegistrar`

**Name:** `"verb"`  
**Default:** Yes  
**How it works:**

It expects the following file structure under the target directory:

```
- /
  - users/
    - _userId/
      - sessions/
        - get.js
      - del.js
      - get.js
      - put.js
    - get.js
    - helper.js
    - post.js
```

Only files whose base name matches that of a supported verb will be loaded (e.g. `helper.js` in the above example would
be ignored) and it expects each one of those modules to export either a single handler method or an array of handler
methods. 

In the example above, the following routes would be registered:

* `GET /users`
* `POST /users`
* `DELETE /users/:userId`
* `GET /users/:userId`
* `PUT /users/:userId`
* `GET /users/:userId/sessions`

#### `IndexRegistrar`

**Name:** `"index"`  
**Default:** No  
**How it works:**

It expects the following file structure under the target directory:

```
- /
  - users/
    - _userId/
      - sessions/
        - index.js
      - index.js
    - helper.js
    - index.js
```

Only files whose base name is `index` will be loaded (e.g. `helper.js` in the above example would be ignored) and it
expects each one of those modules to export an object whose values are either a single handler method or an array of
handler methods. Only handlers associated with properties on the object whose name matches that of a supported verb will
be registered.

If we were to build on the example above and say that the `/users/index.js` file looked something like this:

``` javascript
module.exports = {
  del(req, res, next) {
    ...
  }
  get(req, res, next) {
    ...
  },
  put(req, res, next) {
    ...
  },
  fetchUser(userId) {
    ...
  }
}
```

Then we could say that at least (we're ignoring routes defined in the other files for the purpose of this example) the
following routes would be registered:

* `DELETE /users/:userId`
* `GET /users/:userId`
* `PUT /users/:userId`

The `fetchUser` method is ignored because it does not match a supported verb.

#### Create your own Registrar

In order to create your own registrar you simply need to extend the `Registrar` class and tell Routerify about it:

``` javascript
const routerify = require('routerify')
const Registrar = require('routerify/src/registrar')

class CustomRegistrar extends Registrar {

  static getName() {
    return 'custom'
  }
  
  register(file, options) {
    // Load the module, extract the routes, and mount them via this.mounter
    ...
  }
}

module.exports = Registrar.define(CustomRegistrar)
```

Now your new registrar can be used by simply specifying its name in the options:

``` javascript
routerify({
  dir: path.join(__dirname, 'routes'),
  registrar: 'custom',
  server: app
})
```

You probably want to take a look at the relevant
[source code](https://github.com/Skelp/routerify/tree/master/src/registrar) before trying to create your own registrar.

### Mounters

Mounters are primarily responsible for taking the routes and mounting them onto the server. However, they also provide
the default verbs (methods supported by the framework to make route requests for specific HTTP methods) when no `verbs`
option is specified, and they determine how parameter path variables are formatted.

Routerify includes some mounters for common server frameworks. If your favorite framework is not supported, you can
[create your own](#create-your-own-mounter) and, optionally,
[create a pull request](https://github.com/Skelp/routerify/compare) to share it with everyone.

#### `ExpressMounter`

**Name:** `"express"`  
**Default:** Yes  
**Description:**

Supports all [Express](http://expressjs.com)-like frameworks.

#### `RestifyMounter`

**Name:** `"restify"`  
**Default:** No  
**Description:**

Supports the [Restify](http://restify.com) framework. Since Restify is an Express-like framework itself, the
`ExpressMounter` will work well for the most part, however, this extension of `ExpressMounter` provides additional
benefits for Restify applications by allowing extra optional information (e.g. `version`/`versions`) to be used when
mounting routes.

This can be done by simply adding an `options` property containing the additional information to one of the route
handlers and it will be passed in. 

#### Create your own Mounter

In order to create your own mounter you simply need to extend the `Mounter` class and tell Routerify about it:

``` javascript
const routerify = require('routerify')
const Mounter = require('routerify/src/mounter')

class CustomMounter extends Mounter {

  static getName() {
    return 'custom'
  }
  
  formatParamPath(param) {
    // Format param for insertion into the route URL
    return ...
  }

  getDefaultVerbs() {
    // Specify the supported verbs
    return [...]
  }

  mount(url, verb, handlers, options) {
    // Mount the route onto options.server
    ...
  }
}

module.exports = Mounter.define(CustomMounter)
```

Now your new mounter can be used by simply specifying its name in the options:

``` javascript
routerify({
  dir: path.join(__dirname, 'routes'),
  mounter: 'custom',
  server: app
})
```

You probably want to take a look at the relevant
[source code](https://github.com/Skelp/routerify/tree/master/src/mounter) before trying to create your own mounter.

## API

Routerify exposes its API primarily through a single method.

### `routerify(options)`

This is the primary method for Routerify and it will go through the target directory, find all routes using the
[registrar](#registrars), and finally mounts them onto the server using the [mounter](#mounter).

``` javascript
const express = require('express')
const path = require('path')
const routerify = require('routerify')
const app = express()

routerify({
  dir: path.join(__dirname, 'routes'),
  server: app
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})
```

#### Options

The following options can be passed to Routerify:

| Option         | Description                                                                                                                   | Default Value                |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `dir`          | The directory containing the routes to be loaded.                                                                             | `process.cwd()`              |
| `ext`          | The extension of the source files to be loaded.                                                                               | `".js"`                      |
| `glob`         | Any options to be passed to the `glob` module when searching for source files within `dir`.                                   | `{}`                         |
| `mounter`      | The name of the `Mounter` to be used to mount the discovered routes on to the `server`.                                       | `"express"`                  |
| `paramPattern` | The regular expression to be used to match path parameter variables.                                                          | `/^_(.+)/`                   |
| `registrar`    | The name of the `Registrar` used to load routes from source files in a given structure and then mount them via the `mounter`. | `"verb"`                     |
| `server`       | The server object (e.g. `express()`) to which the routes are to be mounted.                                                   | N/A                          |
| `verbs`        | The verbs (corresponding to HTTP methods) to be supported. Defaults to those provided by the `mounter` if not specified.      | `mounter.getDefaultValues()` |

Only the `server` option is required. All others have defaults.

### `routerify.version`

The current version of Routerify.

``` javascript
routerify.version
=> "0.1.0"
```

## Bugs

If you have any problems with Routerify or would like to see changes currently in development you can do so
[here](https://github.com/Skelp/routerify/issues).

## Contributors

If you want to contribute, you're a legend! Information on how you can do so can be found in
[CONTRIBUTING.md](https://github.com/Skelp/routerify/blob/master/CONTRIBUTING.md). We want your suggestions and pull
requests!

A list of Routerify contributors can be found in
[AUTHORS.md](https://github.com/Skelp/routerify/blob/master/AUTHORS.md).

## License

See [LICENSE.md](https://github.com/Skelp/routerify/raw/master/LICENSE.md) for more information on our MIT license.

© 2016 [Skelp](https://skelp.io)
<img align="right" width="16" height="16" src="https://cdn.rawgit.com/Skelp/skelp-branding/master/assets/logo/base/skelp-logo-16x16.png">
