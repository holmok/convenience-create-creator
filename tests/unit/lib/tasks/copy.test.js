const Tape = require('tape')
const Sinon = require('sinon')
const Utils = require('../../../../lib/utils')
const Fs = require('fs')

function pre () {
  const context = {}

  const sandbox = context.sandbox = Sinon.createSandbox()
  context.utilsMock = sandbox.mock(Utils)
  context.fsMock = sandbox.mock(Fs)

  return context
}

function post (context) {
  context.sandbox.verifyAndRestore()
}

Tape('copy - happy path', (t) => {
  const context = pre()

  const list = [{ to: 'to', from: 'from' }]

  context.utilsMock
    .expects('toAndFroms')
    .once()
    .returns(list)

  context.fsMock
    .expects('copyFileSync')
    .once()
    .returns()

  const { copy } = require('../../../../lib/tasks/copy')
  copy()
  post(context)
  t.end()
})
