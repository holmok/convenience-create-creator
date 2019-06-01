const Execa = require('execa')
const debug = require('debug')('create:command')
const Chalk = require('chalk')

function command (commands) {
  debug('command execution starting: %O', commands)

  for (const command of commands) {
    const { cmd, args, options } = command
    debug('executing "%s %s"', cmd, args.join(' '))
    process.stdout.write(`${Chalk.rgb(255, 192, 0)('Running:')} ${Chalk.white(`${cmd} ${args.join(' ')}`)}...`)
    const { stdout, stderr } = Execa.sync(cmd, args, options)
    console.log(Chalk.rgb(192, 0, 255)(' finished.'))
    if (stdout) { console.log(stdout) }
    if (stderr) { console.error(stderr) }
  }
  debug('command execution complete')
}

module.exports = { command }
