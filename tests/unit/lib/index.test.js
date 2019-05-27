const Tape = require('tape')
const Sinon = require('sinon')
const Proxyquire = require('proxyquire').noCallThru()

function pre () {
  const context = {}

  const sandbox = context.sandbox = Sinon.createSandbox()
  context.query = { query () {} }
  context.copy = { copy () {} }
  context.command = { command () {} }
  context.template = { template () {} }
  context.queryMock = sandbox.mock(context.query)
  context.copyMock = sandbox.mock(context.copy)
  context.commandMock = sandbox.mock(context.command)
  context.templateMock = sandbox.mock(context.template)
  context.consoleMock = sandbox.mock(console)
  context.processMock = sandbox.mock(process)

  return context
}

function post (context) {
  context.sandbox.verifyAndRestore()
}

Tape('index - happy path', async (t) => {
  const context = pre()

  const plan = {
    queries: [],
    actions: [
      { type: 'copy', files () {} },
      { type: 'template', files () {} },
      { type: 'command', commands () {} }
    ]
  }

  context.queryMock.expects('query').once().resolves()
  context.copyMock.expects('copy').once().returns()
  context.templateMock.expects('template').once().returns()
  context.commandMock.expects('command').once().returns()

  const { run } = Proxyquire('../../../lib/index', {
    './tasks/query': context.query,
    './tasks/copy': context.copy,
    './tasks/command': context.command,
    './tasks/template': context.template
  })
  await run(plan)

  post(context)
  t.end()
})

Tape('index - bad plan', async (t) => {
  const context = pre()

  const plan = {
    queries: [],
    actions: [ { type: 'bob' } ]
  }

  context.queryMock.expects('query').once().resolves()
  context.consoleMock.expects('error').once().returns()
  context.processMock.expects('exit').once().returns()

  const { run } = Proxyquire('../../../lib/index', {
    './tasks/query': context.query,
    './tasks/copy': context.copy,
    './tasks/command': context.command,
    './tasks/template': context.template
  })
  await run(plan)

  post(context)
  t.end()
})
