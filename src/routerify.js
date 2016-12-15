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

const mounters = require('./mounters')
const pkg = require('../package.json')
const registrars = require('./registrars')

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

  const MounterImpl = typeof options.mounter === 'string' ? mounters[options.mounter] : options.mounter
  if (typeof MounterImpl !== 'function') {
    throw new Error(`Invalid mounter: ${options.mounter}`)
  }

  const RegistrarImpl = typeof options.registrar === 'string' ? registrars[options.registrar] : options.registrar
  if (typeof RegistrarImpl !== 'function') {
    throw new Error(`Invalid registrar: ${options.registrar}`)
  }

  const mounter = options.mounter = new MounterImpl()
  const registrar = options.registrar = new RegistrarImpl(mounter)

  if (!options.verbs) {
    options.verbs = mounter.getDefaultVerbs()
  }

  const globOptions = Object.assign({ cwd: options.dir }, options.glob)
  const files = glob.sync(`**/*${options.ext}`, globOptions)

  files.forEach((file) => registrar.register(file, options))
}

/**
 * A map of {@link Mounter} names to their constructors.
 *
 * @public
 * @static
 * @type {Object.<string, Function>}
 */
routerify.mounters = mounters

/**
 * A map of {@link Registrar} names to their constructors.
 *
 * @public
 * @static
 * @type {Object.<string, Function>}
 */
routerify.registrars = registrars

/**
 * The current version of routerify.
 *
 * @public
 * @static
 * @type {string}
 */
routerify.version = pkg.version

module.exports = routerify

/**
 * The options that can be passed to routerify.
 *
 * @typedef {Object} routerify~options
 * @property {string} [dir] - The directory containing the routes to be loaded.
 * @property {string} [ext=".js"] - The extension of the source files to be loaded.
 * @property {Object} [glob] - Any options to be passed to the <code>glob</code> module when searching for source files
 * within <code>dir</code>.
 * @property {string|Function} [mounter="express"] - The name (or constructor) of the {@link Mounter} to be used to
 * mount the discovered routes on to the <code>server</code>.
 * @property {RegExp} [paramPattern=/^_(.+)/] - The regular expression to be used to match path parameter variables.
 * @property {string|Function} [registrar="verb"] - The name (or constructor) of the {@link Registrar} used to load
 * routes from source files in a given structure and then mount them via the <code>mounter</code>.
 * @property {Object} server - The server object (e.g. <code>express()</code>) to which the routes are to be mounted.
 * @property {string[]} [verbs] - The verbs (corresponding to HTTP methods) to be supported. Defaults to those provided
 * by the <code>mounter</code> if not specified.
 */
