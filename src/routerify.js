/*
 * Copyright (C) 2016 Alasdair Mercer, Skelp
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict'

const defaultsDeep = require('lodash.defaultsdeep')
const glob = require('glob')

const ExpressMounter = require('./mounter/express-mounter')
const IndexRegistrar = require('./registrar/index-registrar')
const Mounter = require('./mounter')
const { version } = require('../package.json')
const Registrar = require('./registrar')
const RestifyMounter = require('./mounter/restify-mounter')
const VerbRegistrar = require('./registrar/verb-registrar')

/**
 * A set containing all registered {@link Plugin} instances.
 *
 * @private
 * @type {Set.<Plugin>}
 */
const plugins = new Set()

/**
 * Mounts routes onto a given server by loading modules within a specific directory.
 *
 * The way in which the routes are loaded and resolved from the modules is dictated by the {@link Registrar} and the way
 * in which those routes are mounted onto the server is dictated by the {@link Mounter}.
 *
 * @param {routerify~options} options - the options to be used
 * @return {void}
 * @public
 */
function routerify(options) {
  options = defaultsDeep({}, options, {
    dir: process.cwd(),
    ext: '.js',
    glob: {},
    mounter: 'express',
    paramPattern: /^_(.+)/,
    registrar: 'verb',
    server: null,
    verbs: null
  })

  const mounter = options.mounter = routerify.lookup(Mounter, options.mounter)
  const registrar = options.registrar = routerify.lookup(Registrar, options.registrar)

  if (!options.verbs) {
    options.verbs = mounter.getDefaultVerbs()
  }

  const globOptions = Object.assign({ cwd: options.dir }, options.glob)
  const files = glob.sync(`**/*${options.ext}`, globOptions)

  files.forEach((file) => registrar.register(file, options))
}

Object.assign(routerify, {

  /**
   * Looks up all registered {@link Plugin} instances that inherit from a given <code>type</code>.
   *
   * Optionally, <code>name</code> can be provided so that only the {@link Plugin} with that name is returned, by
   * itself. If <code>name</code> is provided and {@link Plugin} is found with that name that also inherits from
   * <code>type</code>, then this method will throw an error.
   *
   * @param {Function} type - the type of {@link Plugin} to be looked up
   * @param {string} [name] - the name of the specific {@link Plugin} to be looked up (all instances of
   * <code>type</code> will be returned if omitted)
   * @return {Plugin|Plugins[]} All plugins that inherit from <code>type</code> if no <code>name</code> is specified or,
   * if it is specified, the {@link Plugin} with <code>name</code> of the given <code>type</code>.
   * @throws {Error} If <code>name</code> is provided but no matching {@link Plugin} could be found.
   * @public
   * @static
   */
  lookup(type, name) {
    if (typeof name === 'undefined') {
      return Array.from(plugins)
        .filter((plugin) => plugin instanceof type)
    }

    const match = Array.from(plugins)
      .find((plugin) => plugin instanceof type && plugin.getPluginName() === name)
    if (match == null) {
      throw new Error(`Unable to lookup ${type.name}: ${name}`)
    }

    return match
  },

  /**
   * Registers the specified <code>plugin</code> so that it can be looked up later.
   *
   * Nothing happens if <code>plugin</code> is <code>null</code>.
   *
   * @param {Plugin} plugin - the {@link Plugin} to be registered
   * @return {Plugin} A reference to <code>plugin</code>.
   * @public
   * @static
   */
  use(plugin) {
    if (plugin) {
      plugins.add(plugin)
    }

    return plugin
  },

  /**
   * The current version of routerify.
   *
   * @public
   * @static
   * @type {string}
   */
  version

})

routerify.use(new ExpressMounter())
routerify.use(new RestifyMounter())
routerify.use(new IndexRegistrar())
routerify.use(new VerbRegistrar())

module.exports = routerify

/**
 * The options that can be passed to routerify.
 *
 * @typedef {Object} routerify~options
 * @property {string} [dir] - The directory containing the routes to be loaded.
 * @property {string} [ext=".js"] - The extension of the source files to be loaded.
 * @property {Object} [glob] - Any options to be passed to the <code>glob</code> module when searching for source files
 * within <code>dir</code>.
 * @property {string} [mounter="express"] - The name of the {@link Mounter} to be used to mount the discovered routes on
 * to the <code>server</code>.
 * @property {RegExp} [paramPattern=/^_(.+)/] - The regular expression to be used to match path parameter variables.
 * @property {string} [registrar="verb"] - The name of the {@link Registrar} used to load routes from source files in a
 * given structure and then mount them via the <code>mounter</code>.
 * @property {Object} server - The server object (e.g. <code>express()</code>) to which the routes are to be mounted.
 * @property {string[]} [verbs] - The verbs (corresponding to HTTP methods) to be supported. Defaults to those provided
 * by the <code>mounter</code> if not specified.
 */
