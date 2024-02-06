oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

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
* [`m30pm hello PERSON`](#m30pm-hello-person)
* [`m30pm hello world`](#m30pm-hello-world)
* [`m30pm help [COMMANDS]`](#m30pm-help-commands)
* [`m30pm plugins`](#m30pm-plugins)
* [`m30pm plugins:install PLUGIN...`](#m30pm-pluginsinstall-plugin)
* [`m30pm plugins:inspect PLUGIN...`](#m30pm-pluginsinspect-plugin)
* [`m30pm plugins:install PLUGIN...`](#m30pm-pluginsinstall-plugin-1)
* [`m30pm plugins:link PLUGIN`](#m30pm-pluginslink-plugin)
* [`m30pm plugins:uninstall PLUGIN...`](#m30pm-pluginsuninstall-plugin)
* [`m30pm plugins reset`](#m30pm-plugins-reset)
* [`m30pm plugins:uninstall PLUGIN...`](#m30pm-pluginsuninstall-plugin-1)
* [`m30pm plugins:uninstall PLUGIN...`](#m30pm-pluginsuninstall-plugin-2)
* [`m30pm plugins update`](#m30pm-plugins-update)

## `m30pm hello PERSON`

Say hello

```
USAGE
  $ m30pm hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/Mach30/m30pm/m30pm/blob/v0.0.0/src/commands/hello/index.ts)_

## `m30pm hello world`

Say hello world

```
USAGE
  $ m30pm hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ m30pm hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/Mach30/m30pm/m30pm/blob/v0.0.0/src/commands/hello/world.ts)_

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

## `m30pm plugins`

List installed plugins.

```
USAGE
  $ m30pm plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ m30pm plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.2.1/src/commands/plugins/index.ts)_

## `m30pm plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ m30pm plugins add plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ m30pm plugins add

EXAMPLES
  $ m30pm plugins add myplugin 

  $ m30pm plugins add https://github.com/someuser/someplugin

  $ m30pm plugins add someuser/someplugin
```

## `m30pm plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ m30pm plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ m30pm plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.2.1/src/commands/plugins/inspect.ts)_

## `m30pm plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ m30pm plugins install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ m30pm plugins add

EXAMPLES
  $ m30pm plugins install myplugin 

  $ m30pm plugins install https://github.com/someuser/someplugin

  $ m30pm plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.2.1/src/commands/plugins/install.ts)_

## `m30pm plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ m30pm plugins link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ m30pm plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.2.1/src/commands/plugins/link.ts)_

## `m30pm plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ m30pm plugins remove plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ m30pm plugins unlink
  $ m30pm plugins remove

EXAMPLES
  $ m30pm plugins remove myplugin
```

## `m30pm plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ m30pm plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.2.1/src/commands/plugins/reset.ts)_

## `m30pm plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ m30pm plugins uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ m30pm plugins unlink
  $ m30pm plugins remove

EXAMPLES
  $ m30pm plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.2.1/src/commands/plugins/uninstall.ts)_

## `m30pm plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ m30pm plugins unlink plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ m30pm plugins unlink
  $ m30pm plugins remove

EXAMPLES
  $ m30pm plugins unlink myplugin
```

## `m30pm plugins update`

Update installed plugins.

```
USAGE
  $ m30pm plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.2.1/src/commands/plugins/update.ts)_
<!-- commandsstop -->
