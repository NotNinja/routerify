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

const { expect } = require('chai')
const path = require('path')
const sinon = require('sinon')

const Mounter = require('../../src/mounter')
const Registrar = require('../../src/registrar')
const routerify = require('../../src/routerify')

describe('registrar/index', () => {
  describe('Registrar.prototype', () => {
    let mounter
    let registrar

    beforeEach(() => {
      mounter = sinon.createStubInstance(Mounter)
      registrar = new Registrar()
    })

    describe('.buildUrl', () => {
      it('should build the URL correctly', () => {
        mounter.formatParamPath.withArgs('id').returns('{id}')

        const file = path.join('test', 'fixtures', 'registrar', 'verb', 'level1', '_id', 'level2', 'get.js')
        const url = registrar.buildUrl(file, {
          mounter,
          paramPattern: /^_(.+)/
        })

        expect(url).to.equal('/test/fixtures/registrar/verb/level1/{id}/level2')
      })
    })

    describe('.loadRouter', () => {
      it('should load file as module based on "dir" option', () => {
        expect(registrar.loadRouter('routerify.js', { dir: 'src' })).to.equal(routerify)
      })
    })

    describe('.register', () => {
      it('should be abstract', () => {
        expect(registrar.register.bind(registrar)).to.throw('Registrar#register has not been implemented')
      })
    })
  })
})
