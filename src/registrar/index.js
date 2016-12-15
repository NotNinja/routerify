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

const Registrar = require('./registrar')

/**
 * An implementation of {@link Registrar} where the index files in each directory is loaded as a module and the result
 * should be an object and containing properties whose names are mapped to supported verbs and whose values are one or
 * more handlers which are then mounted against that verb.
 *
 * @public
 * @extends Registrar
 */
class IndexRegistrar extends Registrar {

  /**
   * @inheritDoc
   * @override
   */
  static name() {
    return 'index'
  }

  /**
   * @inheritDoc
   * @override
   */
  register(file, options) {
    const name = path.basename(file, options.ext)
    if (name !== 'index') {
      return
    }

    const router = this.loadRouter(file, options)
    const url = this.buildUrl(file, options)

    options.verbs.forEach((verb) => {
      const handlers = router[verb]
      if (handlers) {
        this.mounter.mount(url, verb, handlers, options)
      }
    })
  }

}

module.exports = IndexRegistrar
