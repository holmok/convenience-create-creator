const Inquirer = require('inquirer')
const Chalk = require('chalk')

const debug = require('debug')('create:query')

async function query (queries) {
  debug('asking queries: %O', queries)
  try {
    const answers = await Inquirer.prompt(queries)
    debug('got answers: %O', answers)
    return answers
  } catch (error) {
    console.error(Chalk.red(`Failed to query user: ${error.message} (Run with DEBUG=create:* for more information)`))
    debug('failed to query user: %O', error)
    process.exit(1)
  }
}

module.exports = query
