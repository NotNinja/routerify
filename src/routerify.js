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
const registrars = require('./registrars')

/**
 * TODO: Document
 *
 * @param {routerify~options} options -
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
 * TODO: Document
 *
 * @public
 * @type {Object.<string, Function>}
 */
routerify.mounters = mounters

/**
 * TODO: Document
 *
 * @public
 * @type {Object.<string, Function>}
 */
routerify.registrars = registrars

module.exports = routerify

/**
 * TODO: Document
 *
 * @typedef {Object} routerify~options
 * @property {string} [dir] -
 * @property {string} [ext=".js"] -
 * @property {Object} [glob] -
 * @property {string|Function} [mounter="express"] -
 * @property {RegExp} [paramPattern=/^_(.+)/] -
 * @property {string|Function} [registrar="verb"] -
 * @property {Object} server -
 * @property {string[]} [verbs] -
 */
