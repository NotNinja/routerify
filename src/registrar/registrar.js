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

const path = require('path')

/**
 * Responsible for loading routes from a specific structure of modules and mounting them onto the server using a given
 * {@link Mounter}.
 *
 * @public
 */
class Registrar {

  /**
   * Returns the name of the {@link Registrar} which can be used to lookup constructors.
   *
   * @return {string} The name.
   * @public
   * @static
   * @abstract
   */
  static name() {
  }

  /**
   * Creates an instance of {@link Registrar} with the specified <code>mounter</code>.
   *
   * @param {Mounter} mounter - the {@link Mounter} to be used
   * @public
   */
  constructor(mounter) {
    /**
     * The {@link Mounter} to be used by this {@link Registrar} to mount discovered routes onto the server.
     *
     * @protected
     * @type {Mounter}
     */
    this.mounter = mounter
  }

  /**
   * Builds the route URL from the <code>file</code> path provided.
   *
   * This includes detecting files/directories that represent parameter path variables and inserting the names into the
   * route URL correctly based on the {@link Mounter}.
   *
   * By default, this method simply concatenates the <code>file</code> path segments into the URL while dropping the
   * last path segment.
   *
   * @param {string} file - the file path of the module from which the routes are being loaded
   * @param {routerify~options} options - the options to be used
   * @return {string} The route URL built from the <code>file</code> path.
   * @protected
   */
  buildUrl(file, options) {
    return file.split(path.sep)
      .slice(0, -1)
      .reduce((memo, segment) => {
        const match = segment.match(options.paramPattern)
        if (match) {
          segment = this.mounter.formatParamPath(match[1])
        }

        return `${memo}/${segment}`
      }, '')
  }

  /**
   * Loads the router(s) from the module at the specified <code>file</code> path.
   *
   * @param {string} file - the file path of the module from which the routes are being loaded
   * @param {routerify~options} options - the options to be used
   * @return {*} The router loaded from the module at the <code>file</code> path.
   * @protected
   */
  loadRouter(file, options) {
    return require(path.resolve(options.dir, file))
  }

  /**
   * Loads routes from the module at the specified <code>file</code> path and then mounts them onto the server.
   *
   * @param {string} file - the file path of the module from which the routes are to be loaded
   * @param {routerify~options} options - the options to be used
   * @return {void}
   * @public
   * @abstract
   */
  register(file, options) {
  }

}

module.exports = Registrar
