#!/usr/bin/env node

const Path = require('path')

const plan = {
  queries: [],
  actions: [
    {
      type: 'copy',
      name: 'copy standard files',
      transform (path, answers) {
        const filename = Path.basename(path)
        const pathname = Path.dirname(path)
        return Path.join(pathname, filename.replace(/^_/, '.'))
      },
      files (answers) {
        return [
          {
            source: Path.join(__dirname, 'copy'),
            target: Path.join(__dirname, 'output'),
            files: `.${Path.sep}**${Path.sep}*`
          }
        ]
      }
    },
    {
      type: 'template',
      name: 'create files from templates',
      transform (path, answers) {
        const filename = Path.basename(path)
        const pathname = Path.dirname(path)
        return Path.join(pathname, filename
          .replace(/^_/, '')
          .replace(/\.hbs$/, ''))
      },
      files (answers) {
        return [
          {
            source: Path.join(__dirname, 'template'),
            target: Path.join(__dirname, 'output'),
            files: `_package.json.hbs`
          }
        ]
      }
    },
    {
      type: 'command',
      name: 'running commands',
      commands (answers) {
        return [
          { cmd: 'npm', args: ['install', '.'], options: { cwd: Path.join(__dirname, 'output') } }
        ]
      }
    }
  ]
}

module.exports = plan
