const Tape = require('tape')
const Sinon = require('sinon')
const Glob = require('glob')
const Mkdirp = require('mkdirp')
const Proxyquire = require('proxyquire')
const Fs = require('fs')

function pre () {
  const context = {}

  const sandbox = context.sandbox = Sinon.createSandbox()
  context.globMock = sandbox.mock(Glob)
  context.mkdirpMock = sandbox.mock(Mkdirp)
  context.path = {
    join () {},
    relative () {},
    dirname () {}
  }
  context.pathMock = sandbox.mock(context.path)
  context.fsMock = sandbox.mock(Fs)
  const methods = context.methods = { transform () {} }
  context.methodsMock = sandbox.mock(methods)

  return context
}

function post (context) {
  context.sandbox.restore()
}

Tape('utils - happy path', (t) => {
  const context = pre()

  const paths = [
    { source: 'a', target: 'a', files: 'a' }
  ]

  context.pathMock
    .expects('join')
    .thrice()
    .returns()

  context.pathMock
    .expects('relative')
    .twice()
    .returns()

  context.pathMock
    .expects('dirname')
    .twice()
    .returns()

  context.globMock
    .expects('sync')
    .once()
    .returns(['a', 'b'])

  context.methodsMock
    .expects('transform')
    .twice()
    .returns('a')

  context.fsMock
    .expects('existsSync')
    .twice()
    .onCall(0).returns(true)
    .onCall(1).returns(false)

  context.mkdirpMock
    .expects('sync')
    .once()
    .returns()

  const { toAndFroms } = Proxyquire('../../../lib/utils', { path: context.path })
  const result = toAndFroms(paths, context.methods.transform)
  console.log(result)
  post(context)
  t.end()
})
