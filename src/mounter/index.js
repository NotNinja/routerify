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

/**
 * The available {@link Mounter} implementation constructors mapped against their name.
 *
 * @private
 * @type {Map.<string, Function>}
 */
const types = new Map()

/**
 * Responsible for mounting a route, whose information is provided by a {@link Registrar}, onto the server.
 *
 * @public
 */
class Mounter {

  /**
   * Defines the specified <code>type</code> of {@link Mounter} so that it can be looked up using its name.
   *
   * @param {Function} type - the constructor of the {@link Mounter} implementation to be defined
   * @return {Function} A reference to <code>type</code>.
   * @public
   * @static
   */
  static define(type) {
    types.set(type.getName(), type)

    return type
  }

  /**
   * Returns the name of the {@link Mounter} which can be used to lookup constructors.
   *
   * @return {string} The name.
   * @public
   * @static
   * @abstract
   */
  static getName() {
  }

  /**
   * Looks up the type of {@link Mounter} associated with the specified <code>name</code>.
   *
   * @param {string} name - the name associated with the {@link Mounter} implementation to be looked up
   * @return {Function} The constructor of the {@link Mounter} implementation associated with <code>name</code>.
   * @public
   * @static
   */
  static lookup(name) {
    return types.get(name)
  }

  /**
   * Formats the given <code>param</code> so that it can be inserted into the route URL and interpreted by the server.
   *
   * @param {string} param - the parameter name to be formatted
   * @return {string} The formatted parameter path variable.
   * @public
   * @abstract
   */
  formatParamPath(param) {
  }

  /**
   * Returns the list of verbs, corresponding to HTTP methods, to which routes can be mounted by this {@link Mounter}.
   *
   * @return {string[]} The default supported verbs.
   * @public
   * @abstract
   */
  getDefaultVerbs() {
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
  }

}

module.exports = Mounter
