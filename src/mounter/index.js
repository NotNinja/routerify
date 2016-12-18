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

const Plugin = require('../plugin')
const Utilities = require('../utilities')

/**
 * Responsible for mounting a route, whose information is provided by a {@link Registrar}, onto the server.
 *
 * @public
 * @extends Plugin
 */
class Mounter extends Plugin {

  /**
   * Formats the given <code>param</code> so that it can be inserted into the route URL and interpreted by the server.
   *
   * @param {string} param - the parameter name to be formatted
   * @return {string} The formatted parameter path variable.
   * @public
   * @abstract
   */
  formatParamPath(param) {
    Utilities.abstracted(Mounter, 'formatParamPath')
  }

  /**
   * Returns the list of verbs, corresponding to HTTP methods, to which routes can be mounted by this {@link Mounter}.
   *
   * @return {string[]} The default supported verbs.
   * @public
   * @abstract
   */
  getDefaultVerbs() {
    Utilities.abstracted(Mounter, 'getDefaultVerbs')
  }

  /**
   * Mounts the specified <code>handlers</code> onto the route <code>url</code> and <code>verb</code> provided.
   *
   * @param {string} url - the route URL onto which the <code>handlers</code> are to be mounted
   * @param {string} verb - the route verb for which <code>handlers</code> are to be mounted
   * @param {Function|Function[]} handlers - the handler(s) to be mounted
   * @param {routerify~options} options - the options to be used
   * @return {void}
   * @public
   * @abstract
   */
  mount(url, verb, handlers, options) {
    Utilities.abstracted(Mounter, 'mount')
  }

}

module.exports = Mounter
