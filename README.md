# @convenience/create-creator

[![NPM Version](https://img.shields.io/npm/v/@convenience/create-creator.svg?style=flat-square)](https://www.npmjs.com/package/@convenience/create-creator)
[![Build Status](https://travis-ci.com/holmok/convenience-create-creator.svg?branch=master)](https://travis-ci.org/holmok/convenience-create-creator)
[![Dependency Status](https://david-dm.org/holmok/convenience-create-creator/status.svg)](https://david-dm.org/holmok/convenience-create-creator)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![alt text](https://github.com/holmok/convenience-create-creator/wizard.png "Wizard Logo")


A simple node project generator for creating __create scripts__.

## What are Create Scripts?

If you name a module with a leading `create-`, then you can invoke it with `npm init`!

So if you have a module that is published that is called `create-applesauce`. You can of
course invoke it with:

```
$ npx create-applesauce
```

...or (because it starts with `create`) you can...

```
$ npm init applesauce
```

## A Creator of Create scripts so You can Create your own Create scripts?

Okay, how to use?

1. Create a directory
2. `cd` into that directory
3. Run: `$ npm init @convenience/creator`
4. Answer the questions.
5. Build your creator.
6. Publish you creator.
7. Use and share your creator with: `$ npm init [insert you creator here]`

## API

The basic skeleton is this:

```javascript
const { run } = require('@convenience/create-creator')

const plan = {
  queries: [],
  actions: []
}

run(plan)
```

You make a plan and run it.  A plan is made yp of queries (which are just prompts for [inquirer](https://www.npmjs.com/package/inquirer)) and actions.  Actions can be any of the following types: `copy`, `template`, `command`.

## Actions

All actions must have a type and a name, like so:

```javascript
{
    type: 'copy|template|command',
    name: 'Some descriptive name',
    # ...other stuff...
}
```

### `copy` Actions

Copy actions should provide 2 functions.  One is `files` and __IS REQUIRED__, it will get passed the answers from the queries allowing you to determine which files to copy based on those answers. It will return an array of objects that contain `source`, `target`, and `files`.

* `source`: is the directory to copy from
* `target`: is the directory to copy to
* `files`: is a [glob](https://www.npmjs.com/package/glob) expression to filter which files to copy. 

 The other function is `transform` and it _is optional_. It will get passed the target path of a file being copied and the query answers so you can dynamically alter the target path (for renaming files and directories based on the answers to queries).

Here is an example `copy` action:

```javascript
{
    type: 'copy',
    name: 'Copy Files',
    files (answers) {
        return [{
            source: Path.join(__dirname, 'copy'),
            target: Path.join(process.cwd(), '.'),
            files: `.${Path.sep}**${Path.sep}*`
        }]
    },
    transform (path, answers) {
        const filename = Path.basename(path)
        const pathname = Path.dirname(path)
        return Path.join(pathname,filename.replace(/^_/, '.'))
    }
}
```
This will copy files (and will run in windows ;P) from the create script `lib/copy` directory in where ever the create script is being ran. The transform will convert files with a leading underscore(_) to a dot(.) for things like `.gitignore`.

### `template` Actions

Exactly like `copy`.  Only instead of just copying the file, it will load each file like an [handlebars](https://www.npmjs.com/package/handlebars) template and apply the the answers as a context and write the merged result to the target.

Here's an example:

```javascript
{
    type: 'template',
    name: 'Templates',
    transform (path, answers) {
        const filename = Path.basename(path)
        const pathname = Path.dirname(path)
        return Path.join(pathname, filename
            .replace(/^_/, '')
            .replace(/\.hbs$/, ''))
    },
    files (answers) {
    return [{
        source: Path.join(__dirname, 'template'),
        target: Path.join(process.cwd(), '.'),
        files: `.${Path.sep}*`
        }]
    }
}
```

Similar to the `copy` action, but this one also removes the `.hbs` extensions from the source files.

### `command` Actions

This allows you to execute shell commands, like: `npm install`.  Here is an example action that runs `npm install` and `git init`:

```javascript
{
    type: 'command',
    name: 'Commands',
    commands (answers) {
    return [
        { cmd: 'npm', args: ['install'] },
        { cmd: 'git', args: ['init'] }
    ]
    }
}
```

This can be dangerous, don't be stupid or mean.  Thanks!