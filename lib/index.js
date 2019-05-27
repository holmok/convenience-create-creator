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
  for (let i = 0; i < actions.length; i++) {
    const action = actions[i]
    switch (action.type) {
      case 'copy':
        copy(action.files(answers), action.transform, answers)
        break
      case 'template':
        template(action.files(answers), action.transform, answers)
        break
      case 'command':
        command(action.commands(answers))
        break
      default:
        console.error(Chalk.red(`Invalid action.type: ${action.type}`))
        process.exit(1)
    }
  }
}

module.exports = { run }
