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

const ExpressMounter = require('../../src/mounter/express-mounter')
const RestifyMounter = require('../../src/mounter/restify-mounter')

describe('mounter/restify-mounter', () => {
  describe('RestifyMounter', () => {
    it('should extend ExpressMounter', () => {
      expect(new RestifyMounter()).to.be.an.instanceof(ExpressMounter)
    })

    describe('.getName', () => {
      it('should return correct name', () => {
        expect(RestifyMounter.getName()).to.equal('restify')
      })
    })
  })

  describe('RestifyMounter.prototype', () => {
    let mounter

    beforeEach(() => {
      mounter = new RestifyMounter()
    })

    describe('.formatParamPath', () => {
      it('should prefix the parameter with a colon', () => {
        expect(mounter.formatParamPath('foo')).to.equal(':foo')
      })
    })

    describe('.getDefaultVerbs', () => {
      it('should contain all verbs supported by Restify', () => {
        expect(mounter.getDefaultVerbs()).to.eql([ 'del', 'get', 'head', 'opts', 'patch', 'post', 'put' ])
      })
    })

    describe('.mount', () => {
      context('when a single handler is provided', () => {
        it('should mount the handler onto the server', () => {
          const url = '/foo'
          const handler = function a() {}
          const server = sinon.stub({ get() {} })

          mounter.mount(url, 'get', handler, { server })

          expect(server.get.calledOnce).to.be.true
          expect(server.get.args[0]).to.eql([ url, handler ])
        })
      })

      context('when multiple handlers are provided in an array', () => {
        it('should mount all handlers onto the server', () => {
          const url = '/foo'
          const handlers = [ function a() {}, function b() {} ]
          const server = sinon.stub({ get() {} })

          mounter.mount(url, 'get', handlers, { server })

          expect(server.get.calledOnce).to.be.true
          expect(server.get.args[0]).to.eql([ url ].concat(handlers))
        })
      })

      context('when any handler has a options attached', () => {
        it('should mount the handlers to the server with those options', () => {
          const url = '/foo'
          const verb = 'get'
          const handlers = [ function a() {}, function b() {} ]
          const server = sinon.stub({ get() {} })
          const version = '1.0.0'

          handlers[0].options = { version }

          mounter.mount(url, verb, handlers, { server })

          expect(server.get.calledOnce).to.be.true
          expect(server.get.args[0]).to.eql([ {
            method: verb,
            path: url,
            version
          } ].concat(handlers))
        })
      })
    })
  })
})
