const Tape = require('tape')
const Sinon = require('sinon')
const Inquirer = require('inquirer')
const Chalk = require('chalk')

function pre () {
  const context = {}

  const sandbox = context.sandbox = Sinon.createSandbox()
  context.inquirerMock = sandbox.mock(Inquirer)
  context.chalkMock = sandbox.mock(Chalk)
  context.consoleMock = sandbox.mock(console)
  context.processMock = sandbox.mock(process)

  return context
}

function post (context) {
  context.sandbox.verifyAndRestore()
}

Tape('query - happy path', async (t) => {
  const context = pre()

  const answers = { test: true }
  context.inquirerMock.expects('prompt').once().resolves(answers)

  const { query } = require('../../../../lib/tasks/query')
  const results = await query()
  t.deepEqual(answers, results, 'got correct answers')
  post(context)
  t.end()
})

Tape('query - fails', async (t) => {
  const context = pre()

  context.inquirerMock.expects('prompt').once().rejects()
  context.consoleMock.expects('error').once().returns()
  context.processMock.expects('exit').once().returns()

  const { query } = require('../../../../lib/tasks/query')
  await query()
  post(context)
  t.end()
})
