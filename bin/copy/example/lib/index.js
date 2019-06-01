const { run } = require('@convenience/create-creator')
const Path = require('path')

const plan = {
  queries: [
    {
      type: 'confirm',
      name: 'organization',
      message: 'Will this creator be published to an @organization?',
      default: false
    },
    {
      type: 'input',
      name: 'organizationName',
      message: 'What is the name of organization this creator will be published to?',
      validate (input) {
        return input.startsWith('@') || 'organization must start with an @ symbol'
      },
      default: '@organization',
      when (answers) { return answers.organization }
    },
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of this library?',
      default () {
        return Path.basename(process.cwd())
      }
    },
    {
      type: 'input',
      name: 'description',
      message: 'Describe this creator?',
      default: 'Builds an npm module'
    },
    {
      type: 'input',
      name: 'repository',
      message: 'Url for the repository for this creator?'
    }
  ],
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
            target: Path.join(process.cwd(), '.'),
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
            target: Path.join(process.cwd(), '.'),
            files: `./*`
          }
        ]
      }
    },
    {
      type: 'command',
      name: 'running commands',
      commands (answers) {
        return [
          { cmd: 'npm', args: ['install'] },
          { cmd: 'git', args: ['init'] }
        ]
      }
    }
  ]
}

run(plan)
