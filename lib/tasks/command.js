const Execa = require('execa')
const debug = require('debug')('create:command')

function command (commands) {
  debug('command execution starting: %O', commands)

  for (const command of commands) {
    const { cmd, args } = command
    debug('executing "%s %s"', cmd, args.join(' '))
    const { stdout, stderr } = Execa.sync(cmd, args)
    if (stdout) { console.log(stdout) }
    if (stderr) { console.error(stderr) }
  }
  debug('command execution complete')
}

module.exports = { command }
