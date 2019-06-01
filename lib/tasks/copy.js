const { toAndFroms } = require('../utils')
const Fs = require('fs')
const Chalk = require('chalk')

const debug = require('debug')('create:copy')

function copy (paths, transform, answers) {
  debug('copying starting: %O', paths)
  const list = toAndFroms(paths, transform, answers)
  for (let i = 0; i < list.length; i++) {
    const { to, from } = list[i]
    debug('copying "%s" => "%s"', from, to)
    process.stdout.write(`${Chalk.magenta('Writing:')} ${Chalk.white(to)}...`)
    Fs.copyFileSync(from, to)
    console.log(Chalk.cyan(' finished.'))
  }
  debug('copying complete')
}

module.exports = { copy }
