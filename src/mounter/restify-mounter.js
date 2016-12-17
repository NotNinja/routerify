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

const ExpressMounter = require('./express-mounter')

/**
 * An extension of {@link ExpressMounter} which provides further compatibility with Restify by reading
 * <code>options</code> properties on route handlers and passing that to the server when mounting the route. These
 * options can include the content type, name, and version(s).
 *
 * For routes with multiple handlers, only the <code>options</code> property of the first handler with that property
 * will be used, for all handlers, and any <code>options</code> properties on other handlers will be ignored.
 *
 * @public
 * @extends ExpressMounter
 */
class RestifyMounter extends ExpressMounter {

  /**
   * @override
   * @inheritDoc
   */
  getPluginName() {
    return 'restify'
  }

  /**
   * @override
   * @inheritDoc
   */
  mount(url, verb, handlers, options) {
    handlers = Array.isArray(handlers) ? handlers : [ handlers ]

    const handlerWithOptions = handlers.find((handler) => handler.options != null)
    if (handlerWithOptions) {
      url = Object.assign({}, handlerWithOptions.options, {
        method: verb,
        path: url
      })
    }

    super.mount(url, verb, handlers, options)
  }

}

module.exports = RestifyMounter
