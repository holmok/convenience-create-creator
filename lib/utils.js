const Glob = require('glob')
const Mkdirp = require('mkdirp')
const Path = require('path')
const Fs = require('fs')

const debug = require('debug')('create:copy')

function toAndFroms (paths, transform, answers) {
  const output = []
  // istanbul ignore next
  transform = transform || (path => path)
  answers = answers || {}
  for (let i = 0; i < paths.length; i++) {
    let { source, target, files } = paths[i]
    const sources = Glob.sync(Path.join(source, files))
    for (let x = 0; x < sources.length; x++) {
      const from = sources[x]
      const toFile = Path.join(target, Path.relative(source, from))
      const to = transform(toFile, answers)
      const toPath = Path.dirname(to)
      if (!Fs.existsSync(toPath)) {
        debug('creating dir "%s"', toPath)
        Mkdirp.sync(toPath)
      }
      output.push({ from, to })
    }
  }
  return output
}

module.exports = { toAndFroms }
