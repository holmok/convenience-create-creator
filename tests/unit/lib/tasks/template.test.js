const Tape = require('tape')
const Sinon = require('sinon')
const Utils = require('../../../../lib/utils')
const Handlebars = require('handlebars')
const Proxyquire = require('proxyquire')

function pre () {
  const context = {}

  const sandbox = context.sandbox = Sinon.createSandbox()
  context.utilsMock = sandbox.mock(Utils)
  context.fs = { writeFileSync () {}, readFileSync () {} }
  context.fsMock = sandbox.mock(context.fs)
  context.handlebarsMock = sandbox.mock(Handlebars)

  return context
}

function post (context) {
  context.sandbox.verifyAndRestore()
}

Tape('template - happy path', (t) => {
  const context = pre()

  const list = [{ to: 'to', from: 'from' }]

  context.utilsMock.expects('toAndFroms').once().returns(list)
  context.fsMock.expects('readFileSync').once().returns(Buffer.alloc(0))
  context.fsMock.expects('writeFileSync').once().returns()
  context.handlebarsMock.expects('compile').once().returns(() => '')

  const { template } = Proxyquire('../../../../lib/tasks/template', { fs: context.fs })
  template()
  post(context)
  t.end()
})
