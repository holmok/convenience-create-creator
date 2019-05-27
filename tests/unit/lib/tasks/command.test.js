const Tape = require('tape')
const Sinon = require('sinon')
const Execa = require('execa')

function pre () {
  const context = {}

  const sandbox = context.sandbox = Sinon.createSandbox()
  context.execaMock = sandbox.mock(Execa)
  context.consoleMock = sandbox.mock(console)

  return context
}

function post (context) {
  context.sandbox.verifyAndRestore()
}

Tape('command - happy path (no stdout or stderr)', (t) => {
  const context = pre()

  const commands = [{ cmd: 'ls', args: ['-al'] }]

  context.execaMock.expects('sync').once().returns({})

  const { command } = require('../../../../lib/tasks/command')
  command(commands)
  post(context)
  t.end()
})

Tape('command - happy path (with stdout or stderr)', (t) => {
  const context = pre()

  const commands = [{ cmd: 'ls', args: ['-al'] }]

  context.execaMock.expects('sync').once().returns({ stdout: 'stdout', stderr: 'stderr' })
  context.consoleMock.expects('log').once().returns()
  context.consoleMock.expects('error').once().returns()

  const { command } = require('../../../../lib/tasks/command')
  command(commands)
  post(context)
  t.end()
})
