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

const Registrar = require('./index')

/**
 * An implementation of {@link Registrar} where the name of the files in each directory is checked and, if it's a
 * supported verb, it's loaded as a module and the result should be one or more handlers which are then mounted against
 * that verb.
 *
 * @public
 * @extends Registrar
 */
class VerbRegistrar extends Registrar {

  /**
   * @inheritDoc
   * @override
   */
  getPluginName() {
    return 'verb'
  }

  /**
   * @inheritDoc
   * @override
   */
  register(file, options) {
    const name = path.basename(file, options.ext)
    if (!options.verbs.includes(name)) {
      return
    }

    const handlers = this.loadRouter(file, options)
    const url = this.buildUrl(file, options)

    options.mounter.mount(url, name, handlers, options)
  }

}

module.exports = VerbRegistrar
