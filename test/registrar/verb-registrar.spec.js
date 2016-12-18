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

const RegistrarTestCase = require('./registrar-test-case')
const VerbRegistrar = require('../../src/registrar/verb-registrar')

describe('registrar/verb-registrar', () => {
  describe('VerbRegistrar.prototype', () => {
    let registrar
    let testCase

    beforeEach(() => {
      registrar = new VerbRegistrar()
      testCase = new RegistrarTestCase(registrar, 'verb')
    })

    describe('.getPluginName', () => {
      it('should return correct name', () => {
        testCase.testGetPluginName()
      })
    })

    describe('.register', () => {
      it('should register verb file-based routes via mounter', () => {
        testCase.testRegister()
      })
    })
  })
})
