Tape('index - happy path 2', async (t) => {
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
