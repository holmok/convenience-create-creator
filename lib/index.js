const { query } = require('./tasks/query')
const { copy } = require('./tasks/copy')
const { template } = require('./tasks/template')
const { command } = require('./tasks/command')
const Chalk = require('chalk')

const debug = require('debug')('create:run')

async function run (plan) {
  const { queries, actions } = plan
  debug('running queries: %O', queries)
  const answers = await query(queries)
  debug('running actions: %O', actions)
  for (const action of actions) {
    console.log(`Running: ${Chalk.bold(action.name)}`)
    switch (action.type) {
      case 'copy':
        await copy(action.files(answers), action.transform, answers)
        break
      case 'template':
        await template(action.files(answers), action.transform, answers)
        break
      case 'command':
        await command(action.commands(answers))
        break
      default:
        console.error(Chalk.red(`Invalid action.type: ${action.type}`))
        process.exit(1)
    }
  }
}

module.exports = { run }
