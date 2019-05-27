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
    '../../../lib/tasks/query': context.query,
    '../../../lib/tasks/copy': context.copy,
    '../../../lib/tasks/command': context.command,
    '../../../lib/tasks/template': context.template
  })
  await run(plan)

  post(context)
  t.end()
})
