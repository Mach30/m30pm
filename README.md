m30pm
=================

Mach 30 package manager for m30ml projects

[![GitHub license](https://img.shields.io/github/license/Mach30/m30pm)](https://github.com/Mach30/m30pm/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g m30pm
$ m30pm COMMAND
running command...
$ m30pm (--version)
m30pm/0.0.0 linux-x64 node-v18.5.0
$ m30pm --help [COMMAND]
USAGE
  $ m30pm COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`m30pm help [COMMANDS]`](#m30pm-help-commands)
* [`m30pm project create PROJECTNAME`](#m30pm-project-create-projectname)

## `m30pm help [COMMANDS]`

Display help for m30pm.

```
USAGE
  $ m30pm help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for m30pm.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.12/src/commands/help.ts)_

## `m30pm project create PROJECTNAME`

Create a new m30ml project

```
USAGE
  $ m30pm project create PROJECTNAME [-n <value>] [-f]

ARGUMENTS
  PROJECTNAME  Name of new m30ml project to create (must conform to npm package naming convention)

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  Create a new m30ml project

EXAMPLES
  $ m30pm project create
```

_See code: [src/commands/project/create.ts](https://github.com/Mach30/m30pm/blob/v0.0.0/src/commands/project/create.ts)_
<!-- commandsstop -->
