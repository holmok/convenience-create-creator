const { toAndFroms } = require('../utils')
const Fs = require('fs')

const debug = require('debug')('create:copy')

function copy (paths, transform, answers) {
  debug('copying starting: %O', paths)
  const list = toAndFroms(paths, transform, answers)
  for (let i = 0; i < list.length; i++) {
    const { to, from } = list[i]
    debug('copying "%s" => "%s"', from, to)
    Fs.copyFileSync(from, to)
  }
  debug('copying complete')
}

module.exports = { copy }
