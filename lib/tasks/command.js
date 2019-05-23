const { spawn } = require('child_process')
const debug = require('debug')('create:command')

async function command (commands) {
  debug('command execution starting: %O', commands)

  for (const command of commands) {
    const { cmd, args } = command
    debug('executing "%s %s"', cmd, args.join(' '))
    await exec(cmd, args)
  }
  debug('command execution complete')
}

function exec (cmd, args) {
  return new Promise((resolve, reject) => {
    const exec = spawn(cmd, args)
    exec.stdout.on('data', (chunk) => {
      process.stdout.write(chunk)
    })
    exec.stderr.on('data', (chunk) => {
      process.stderr.write(chunk)
    })
    exec.on('exit', () => resolve())
    exec.on('error', (err) => reject(err))
  })
}

module.exports = { command }
