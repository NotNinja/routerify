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

const glob = require('glob')
const path = require('path')

/**
 * TODO: Document
 *
 * @public
 */
class Registrar {

  /**
   * TODO: Document
   *
   * @return {string}
   * @public
   * @static
   * @abstract
   */
  static name() {
  }

  /**
   * TODO: Document
   *
   * @param {Mounter} mounter -
   */
  constructor(mounter) {
    /**
     * TODO: Document
     *
     * @protected
     * @type {Mounter}
     */
    this.mounter = mounter
  }

  /**
   * TODO: Document
   *
   * @param {string} file -
   * @param {routerify~options} options -
   * @return {string}
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
   * TODO: Document
   *
   * @param {string} file -
   * @param {routerify~options} options -
   * @return {*}
   * @protected
   */
  loadRouter(file, options) {
    return require(path.resolve(options.dir, file))
  }

  /**
   * TODO: Document
   *
   * @param {string} file -
   * @param {routerify~options} options -
   * @return {void}
   * @public
   * @abstract
   */
  register(file, options) {
  }

}

module.exports = Registrar
