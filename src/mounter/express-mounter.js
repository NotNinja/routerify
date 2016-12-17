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

const Mounter = require('./index')

/**
 * An implementation of {@link Mounter} that is intended to be used for Express applications.
 *
 * @public
 * @extends Mounter
 */
class ExpressMounter extends Mounter {

  /**
   * @override
   * @inheritDoc
   */
  formatParamPath(param) {
    return `:${param}`
  }

  /**
   * @override
   * @inheritDoc
   */
  getDefaultVerbs() {
    return [ 'del', 'get', 'head', 'opts', 'patch', 'post', 'put' ]
  }

  /**
   * @override
   * @inheritDoc
   */
  getPluginName() {
    return 'express'
  }

  /**
   * @override
   * @inheritDoc
   */
  mount(url, verb, handlers, options) {
    handlers = Array.isArray(handlers) ? handlers : [ handlers ]

    options.server[verb](url, ...handlers)
  }

}

module.exports = ExpressMounter
