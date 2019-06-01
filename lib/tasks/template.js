const { toAndFroms } = require('../utils')
const Fs = require('fs')
const Handlebars = require('handlebars')
const debug = require('debug')('create:template')
const Chalk = require('chalk')

function template (paths, transform, answers) {
  debug('templating starting: %O', paths)
  const list = toAndFroms(paths, transform, answers)
  for (let i = 0; i < list.length; i++) {
    const { to, from } = list[i]
    debug('templating "%s" => "%s"', from, to)
    const hbs = Fs.readFileSync(from).toString('utf8')
    const template = Handlebars.compile(hbs)
    const output = template(answers)
    debug('template output: %s', output)
    process.stdout.write(`${Chalk.green('Writing:')} ${Chalk.white(to)}...`)
    Fs.writeFileSync(to, output)
    console.log(Chalk.yellow(' finished.'))
  }
  debug('templating complete')
}

module.exports = { template }
