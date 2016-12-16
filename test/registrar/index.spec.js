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
const sinon = require('sinon')

const Mounter = require('../../src/mounter')
const Registrar = require('../../src/registrar')

describe('registrar/index', () => {
  describe('Registrar', () => {
    const testName = 'test'

    class TestRegistrar extends Registrar {

      static getName() {
        return testName
      }

    }

    describe('.define', () => {
      it('should map type based on its name', () => {
        expect(Registrar.define(TestRegistrar)).to.equal(TestRegistrar)
        expect(Registrar.lookup(testName)).to.equal(TestRegistrar)
      })
    })

    describe('.lookup', () => {
      it('should return type based with name', () => {
        expect(Registrar.define(TestRegistrar)).to.equal(TestRegistrar)
        expect(Registrar.lookup(testName)).to.equal(TestRegistrar)
      })

      it('should be case sensitive', () => {
        expect(Registrar.define(TestRegistrar)).to.equal(TestRegistrar)
        expect(Registrar.lookup(testName)).to.equal(TestRegistrar)
        expect(Registrar.lookup(testName.toUpperCase())).to.be.undefined
      })

      context('when there is not matching type', () => {
        it('should return nothing', () => {
          expect(Registrar.lookup('foo')).to.be.undefined
        })
      })
    })
  })

  describe('Registrar.prototype', () => {
    let mounter
    let registrar

    beforeEach(() => {
      mounter = sinon.createStubInstance(Mounter)
      registrar = new Registrar(mounter)
    })

    describe('.buildUrl', () => {
      // TODO: Complete
    })

    describe('.mounter', () => {
      it('should be the mounter passed to the constructor', () => {
        expect(registrar.mounter).to.equal(mounter)
      })
    })

    describe('.loadRouter', () => {
      // TODO: Complete
    })
  })
})
