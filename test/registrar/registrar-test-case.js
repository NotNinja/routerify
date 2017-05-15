/*
 * Copyright (C) 2017 Alasdair Mercer, !ninja
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

'use strict';

/* eslint "arrow-body-style": "off" */

const { expect } = require('chai');
const glob = require('glob');
const path = require('path');
const sinon = require('sinon');

const Mounter = require('../../src/mounter/index');

class Route {

  constructor(url, verb, handlers = 1) {
    this.url = url;
    this.verb = verb;
    this.handlers = handlers;
  }

}

class RegistrarTestCase {

  constructor(registrar, name) {
    this.registrar = registrar;
    this.name = name;
    this.directory = `test/fixtures/registrar/${name}`;
    this.mounter = sinon.createStubInstance(Mounter);
    this.mounter.formatParamPath.withArgs('id').returns('{id}');
    this.expected = [
      new Route('/', 'get'),
      new Route('/', 'head', 2),
      new Route('/level1', 'get'),
      new Route('/level1', 'post'),
      new Route('/level1/{id}', 'del'),
      new Route('/level1/{id}', 'get'),
      new Route('/level1/{id}', 'put'),
      new Route('/level1/{id}/level2', 'get')
    ];
  }

  testGetPluginName() {
    expect(this.registrar.getPluginName()).to.equal(this.name);
  }

  testRegister() {
    const directory = this.directory.replace(/\\|\//g, path.sep);
    const fixtures = glob.sync('**/*.js', { cwd: directory });
    const options = {
      dir: directory,
      ext: '.js',
      mounter: this.mounter,
      paramPattern: /^_(.+)/,
      registrar: this.registrar,
      verbs: [ 'del', 'get', 'head', 'opts', 'patch', 'post', 'put' ]
    };

    fixtures.forEach((fixture) => {
      this.registrar.register(fixture, options);
    });

    expect(this.mounter.mount.callCount).to.equal(this.expected.length);

    this.expected.forEach((route) => {
      this.mounter.mount.calledWith(route.url, route.verb, sinon.match((arg) => {
        return route.handlers === 1 ? typeof arg === 'function' : Array.isArray(arg) && arg.length === route.handlers;
      }), options);
    });
  }

}

module.exports = RegistrarTestCase;
