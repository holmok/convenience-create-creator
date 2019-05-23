#!/usr/bin/env node

const Path = require('path')
const Run = require('../lib')
const Chalk = require('chalk')

const plan = {
  queries: [
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of this project:',
      default () {
        return Path.basename(process.cwd())
      }
    },
    {
      type: 'confirm',
      name: 'tape',
      message: `Include ${Chalk.green('testing')} with ${Chalk.yellow('tape')}:`,
      default: true
    },
    {
      type: 'confirm',
      name: 'sinon',
      message: `Include ${Chalk.green('spies, stubs and mocks')} with ${Chalk.yellow('sinon')}:`,
      default: true,
      when (answers) { return answers.tape }
    },
    {
      type: 'confirm',
      name: 'nyc',
      message: `Include ${Chalk.green('coverage')} with ${Chalk.yellow('nyc')}:`,
      default: true,
      when (answers) { return answers.tape }
    },
    {
      type: 'confirm',
      name: 'standard',
      message: `Include ${Chalk.green('linting')} with ${Chalk.yellow('standard')}:`,
      default: true
    }
  ],
  actions: [
    {
      type: 'copy',
      name: 'copy standard files',
      transform (path, answers) {
        return path
          .replace(`${Path.sep}_`, Path.sep)
          .replace('{{name}}', answers.name)
      },
      files (answers) {
        return [
          {
            source: Path.join(__dirname, '..', 'template', 'copy'),
            target: Path.join(process.cwd(), '.'),
            files: `.${Path.sep}**${Path.sep}*.+(html|js)`
          }
        ]
      }
    },
    {
      type: 'template',
      name: 'create files from templates',
      transform (path, answers) {
        return path
          .replace(`${Path.sep}_`, Path.sep)
          .replace('{{name}}', answers.name)
          .replace(/\.hbs$/, '')
      },
      files (answers) {
        return [
          {
            source: Path.join(__dirname, '..', 'template', 'template'),
            target: Path.join(process.cwd(), '.'),
            files: `.${Path.sep}_package.json.hbs`
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

Run(plan)
