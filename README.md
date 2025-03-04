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
m30pm/0.1.0-alpha.3 linux-x64 node-v23.8.0
$ m30pm --help [COMMAND]
USAGE
  $ m30pm COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`m30pm help [COMMAND]`](#m30pm-help-command)
* [`m30pm project create PROJECTNAME`](#m30pm-project-create-projectname)

## `m30pm help [COMMAND]`

Display help for m30pm.

```
USAGE
  $ m30pm help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for m30pm.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.22/src/commands/help.ts)_

## `m30pm project create PROJECTNAME`

Create a new m30ml project

```
USAGE
  $ m30pm project create PROJECTNAME -V <value> -l <value> -p npm|yarn [-d <value>] [-a <value>]

ARGUMENTS
  PROJECTNAME  Name of new m30ml project to create (must conform to npm package naming convention)

FLAGS
  -V, --versionString=<value>    (required) [default: 0.0.0] Initial project version string as a semver version
                                 (https://semver.org/)
  -a, --author=<value>           Author of new m30ml project
  -d, --description=<value>      Description of new m30ml project
  -l, --license=<value>          (required) [default: CC0-1.0] Project license specified as an SPDX license identifier
                                 (https://spdx.org/licenses/)
  -p, --packageManager=<option>  (required) [default: npm] Node-based package manager for new m30ml project
                                 <options: npm|yarn>

DESCRIPTION
  Create a new m30ml project

EXAMPLES
  Display command help

    $ m30pm project create --help

  Create myProject and be prompted for remaining inputs

    $ m30pm project create my-project

  Create myProject entirely from command line

    $ m30pm project create my-project -V "0.0.0" -d "My New m30ml Project" -a "Mach 30" -l "CC-BY-4.0" -p "npm"
```

_See code: [src/commands/project/create.ts](https://github.com/Mach30/m30pm/blob/v0.1.0-alpha.3/src/commands/project/create.ts)_
<!-- commandsstop -->
