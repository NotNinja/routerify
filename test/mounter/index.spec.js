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

const Mounter = require('../../src/mounter')

describe('mounter/index', () => {
  describe('Mounter.prototype', () => {
    let mounter

    beforeEach(() => {
      mounter = new Mounter()
    })

    describe('.formatParamPath', () => {
      it('should be abstract', () => {
        expect(mounter.formatParamPath.bind(mounter)).to.throw('Mounter#formatParamPath has not been implemented')
      })
    })

    describe('.getDefaultVerbs', () => {
      it('should be abstract', () => {
        expect(mounter.getDefaultVerbs.bind(mounter)).to.throw('Mounter#getDefaultVerbs has not been implemented')
      })
    })

    describe('.mount', () => {
      it('should be abstract', () => {
        expect(mounter.mount.bind(mounter)).to.throw('Mounter#mount has not been implemented')
      })
    })
  })
})
