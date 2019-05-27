const Tape = require('tape')
const Path = require('path')
const Fs = require('fs')
const Rimraf = require('rimraf')

Tape('integration test', async (t) => {
  const output = Path.join(__dirname, 'support', 'output')
  console.log(output)
  if (Fs.existsSync(output)) {
    Rimraf.sync(output)
    console.log(Fs.existsSync(output))
  }
  const { run } = require('../../lib/index')
  const plan = require('./support/index')
  await run(plan)
  t.ok(Fs.existsSync(output), 'output is built')
  t.ok(Fs.existsSync(Path.join(output, 'node_modules')), 'node_modules is built')
  t.ok(Fs.existsSync(Path.join(output, 'package.json')), 'package.json is built')
  t.ok(Fs.existsSync(Path.join(output, '.gitignore')), '.gitignore is built')
  t.ok(Fs.existsSync(Path.join(output, 'lib', 'index.js')), 'lib/index.js is built')
  Rimraf.sync(output)
  t.end()
})
