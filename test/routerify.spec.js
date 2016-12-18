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
const glob = require('glob')
const sinon = require('sinon')

const ExpressMounter = require('../src/mounter/express-mounter')
const IndexRegistrar = require('../src/registrar/index-registrar')
const Mounter = require('../src/mounter')
const { version } = require('../package.json')
const Plugin = require('../src/plugin')
const Registrar = require('../src/registrar')
const RestifyMounter = require('../src/mounter/restify-mounter')
const routerify = require('../src/routerify')
const VerbRegistrar = require('../src/registrar/verb-registrar')

describe('routerify', () => {
  describe('routerify', () => {
    let mounter
    const mounterName = 'routerify-test-mounter'
    let registrar
    const registrarName = 'routerify-test-registrar'

    before(() => {
      mounter = sinon.createStubInstance(Mounter)
      mounter.getPluginName.returns(mounterName)
      registrar = sinon.createStubInstance(Registrar)
      registrar.getPluginName.returns(registrarName)

      routerify.use(mounter)
      routerify.use(registrar)
    })

    beforeEach(() => {
      sinon.stub(glob, 'sync')
    })

    afterEach(() => {
      mounter.getDefaultVerbs.reset()
      registrar.register.reset()

      glob.sync.restore()
    })

    it('should find and register all route modules based on options', () => {
      const files = [
        'file1.coffee',
        'file2.coffee',
        'file3.coffee'
      ]
      const options = {
        dir: 'test',
        ext: '.coffee',
        glob: { foo: 'bar' },
        mounter: mounterName,
        paramPattern: /^\.(.+)/,
        registrar: registrarName,
        server: sinon.spy(),
        verbs: [ 'get', 'head' ]
      }

      glob.sync.withArgs('**/*.coffee', { cwd: 'test', foo: 'bar' }).returns(files)

      routerify(options)

      expect(registrar.register.callCount).to.equal(files.length)
      files.forEach((file) => {
        expect(registrar.register.calledWithExactly(file, options))
      })
    })

    context('when no options are specifed', () => {
      let defaultMounter
      let defaultRegistrar

      beforeEach(() => {
        defaultMounter = routerify.lookup(Mounter, 'express')
        sinon.stub(defaultMounter, 'getDefaultVerbs')
        defaultRegistrar = routerify.lookup(Registrar, 'index')
        sinon.stub(defaultRegistrar, 'register')
      })

      afterEach(() => {
        defaultMounter.getDefaultVerbs.restore()
        defaultRegistrar.register.restore()
      })

      it('should use correct default options', () => {
        const files = [
          'file1.js',
          'file2.js',
          'file3.js'
        ]
        const server = sinon.spy()
        const verbs = [ 'get', 'head' ]
        const options = {
          dir: process.cwd(),
          ext: '.js',
          glob: {},
          mounter: 'express',
          paramPattern: /^_(.+)/,
          registrar: 'index',
          server,
          verbs
        }

        defaultMounter.getDefaultVerbs.returns(verbs)
        glob.sync.withArgs('**/*.js', { cwd: options.dir }).returns(files)

        routerify({ server })

        expect(defaultRegistrar.register.callCount).to.equal(files.length)
        files.forEach((file) => {
          expect(defaultRegistrar.register.calledWithExactly(file, options))
        })
      })
    })

    describe('.lookup', () => {
      context('when only a type is provided', () => {
        it('should return all plugins when Plugin is passed', () => {
          const plugins = routerify.lookup(Plugin)

          expect(plugins).to.have.length.of.at.least(4)
          expect(plugins[0]).to.be.an.instanceOf(ExpressMounter)
          expect(plugins[1]).to.be.an.instanceOf(RestifyMounter)
          expect(plugins[2]).to.be.an.instanceOf(IndexRegistrar)
          expect(plugins[3]).to.be.an.instanceOf(VerbRegistrar)
        })

        it('should return only plugins of a given type when it is passed', () => {
          const mounters = routerify.lookup(Mounter)

          expect(mounters).to.have.length.of.at.least(2)
          expect(mounters[0]).to.be.an.instanceOf(ExpressMounter)
          expect(mounters[1]).to.be.an.instanceOf(RestifyMounter)

          const registrars = routerify.lookup(Registrar)

          expect(registrars[0]).to.be.an.instanceOf(IndexRegistrar)
          expect(registrars[1]).to.be.an.instanceOf(VerbRegistrar)
        })
      })

      context('when an existing name is provided along with type', () => {
        it('should return the specific ', () => {
          class LookupTestPlugin extends Plugin {

            getPluginName() {
              return 'lookup-test-plugin'
            }

          }

          const plugin = routerify.use(new LookupTestPlugin())

          expect(routerify.lookup(Plugin, 'lookup-test-plugin')).to.equal(plugin)
        })
      })

      context('when an unknown name is provided along with type', () => {
        it('should throw an error', () => {
          expect(routerify.lookup.bind(routerify, Plugin, 'foo')).to.throw(Error, 'Unable to lookup Plugin: foo')
        })
      })
    })

    describe('.use', () => {
      it('should register the plugin', () => {
        class UseTestPlugin extends Plugin {

          getPluginName() {
            return 'use-test-plugin'
          }

        }

        const plugin = new UseTestPlugin()

        expect(routerify.use(plugin)).to.equal(plugin)
        expect(routerify.lookup(Plugin, 'use-test-plugin')).to.equal(plugin)
      })

      context('when plugin is null', () => {
        it('should not add a plugin', () => {
          const plugins = routerify.lookup(Object)

          expect(routerify.use(null)).to.be.null
          expect(routerify.lookup(Object)).to.eql(plugins)
        })
      })
    })

    describe('.version', () => {
      it('should match package version', () => {
        expect(routerify.version).to.equal(version)
      })
    })
  })
})
