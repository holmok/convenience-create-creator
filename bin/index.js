#!/usr/bin/env node

const Path = require('path')
const { run } = require('../lib')
const Chalk = require('chalk')
const GitUserInfo = require('git-user-info')
const Os = require('os')

const user = GitUserInfo({ path: Path.join(Os.homedir(), '.gitconfig') })

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
      message: 'What is the name of this creator?',
      validate (input) {
        return input.startsWith('create-') || 'name must start with "create-"'
      },
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
      name: 'username',
      message: 'Your name?',
      default: user && user.name ? user.name : ''
    },
    {
      type: 'input',
      name: 'email',
      message: 'Your email?',
      default: user && user.email ? user.email : ''
    },
    {
      type: 'input',
      name: 'license',
      message: 'What license?',
      default: 'MIT'
    },
    {
      type: 'input',
      name: 'repository',
      message: 'Url for the repository for this creator?'
    },
    {
      type: 'confirm',
      name: 'tape',
      message: `Include ${Chalk.green('testing')} with ${Chalk.yellow('tape')}?`,
      default: true
    },
    {
      type: 'confirm',
      name: 'sinon',
      message: `Include ${Chalk.green('spies, stubs and mocks')} with ${Chalk.yellow('sinon')}?`,
      default: true,
      when (answers) { return answers.tape }
    },
    {
      type: 'confirm',
      name: 'nyc',
      message: `Include ${Chalk.green('coverage')} with ${Chalk.yellow('nyc')}?`,
      default: true,
      when (answers) { return answers.tape }
    },
    {
      type: 'confirm',
      name: 'standard',
      message: `Include ${Chalk.green('linting')} with ${Chalk.yellow('standard')}?`,
      default: true
    },
    {
      type: 'confirm',
      name: 'standard',
      message: `Include an example template?`,
      default: true
    }
  ],
  actions: [
    {
      type: 'copy',
      name: 'copy standard files',
      transform (path, answers) {
        const filename = Path.basename(path)
        const pathname = Path.dirname(path)
        return Path.join(pathname, filename
          .replace(/^_/, '.')
          .replace(/\.hbs$/, ''))
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
