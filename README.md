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

TODO: Document

## API

TODO: Document

### Options

The following options can be passed to Routerify:

| Option         | Description                                                                                                                                    | Default Value                |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `dir`          | The directory containing the routes to be loaded.                                                                                              | `process.cwd()`              |
| `ext`          | The extension of the source files to be loaded.                                                                                                | `".js"`                      |
| `glob`         | Any options to be passed to the `glob` module when searching for source files within `dir`.                                                    | `{}`                         |
| `mounter`      | The name (or constructor) of the `Mounter` to be used to mount the discovered routes on to the `server`.                                       | `"express"`                  |
| `paramPattern` | The regular expression to be used to match path parameter variables.                                                                           | `/^_(.+)/`                   |
| `registrar`    | The name (or constructor) of the `Registrar` used to load routes from source files in a given structure and then mount them via the `mounter`. | `"verb"`                     |
| `server`       | The server object to which the routes are to be mounted.                                                                                       | N/A                          |
| `verbs`        | The verbs (corresponding to HTTP methods) to be supported. Defaults to those provided by the `mounter` if not specified.                       | `mounter.getDefaultValues()` |

The `server` option is the *only* one that is required.

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
