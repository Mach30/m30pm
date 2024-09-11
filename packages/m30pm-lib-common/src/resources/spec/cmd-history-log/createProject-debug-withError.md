# createProject Log

## Arguments

### project:

```json
{
  "name": "my-project",
  "version": "0.0.0",
  "description": "My New m30ml Project",
  "author": "Mach 30",
  "license": "CC-BY-4.0",
  "packageManager": "npm",
  "workspaces": [
    "./packages/*",
    "./packages/@*/*"
  ],
  "m30pm": {
    "versionControlTool": "git",
    "buildTool": "gradle",
    "loggingLevel": "error"
  }
}
```

## Processed Commands

### Verify Tool Info for "npm" | *Success*

#### Find Tool

|Command Property | Value |
|-----------------|-------|
| executedStatus  | Command has been executed |
| workingDirectory |  |
| command | which |
| commandLine | `npm` |
| additionalOptions |  |
| successExitCode | 0 |
| exitCode | 0 |

##### stdout

```
/var/lib/nvm/versions/node/v20.15.1/bin/npm
```

##### stderr

```
null
```

#### Get Current Working Directory

|Command Property | Value |
|-----------------|-------|
| executedStatus  | Command has been executed |
| workingDirectory |  |
| command | pwd |
| commandLine |  |
| additionalOptions |  |
| successExitCode | 0 |
| exitCode | 0 |

##### stdout

```
/home/kasm-user/repos/m30pm
```

##### stderr

```
null
```

#### Get Tool Version

|Command Property | Value |
|-----------------|-------|
| executedStatus  | Command has been executed |
| workingDirectory | `/home/kasm-user/repos/m30pm` |
| command | exec |
| commandLine | `/var/lib/nvm/versions/node/v20.15.1/bin/npm --version` |
| additionalOptions |  |
| successExitCode | 0 |
| exitCode | 0 |

##### stdout

```
10.7.0
```

##### stderr

```
null
```

### Verify Tool Info for "gradle" | *Success*

#### Find Tool

|Command Property | Value |
|-----------------|-------|
| executedStatus  | Command has been executed |
| workingDirectory |  |
| command | which |
| commandLine | `gradle` |
| additionalOptions |  |
| successExitCode | 0 |
| exitCode | 0 |

##### stdout

```
/usr/local/bin/gradle
```

##### stderr

```
null
```

#### Get Current Working Directory

|Command Property | Value |
|-----------------|-------|
| executedStatus  | Command has been executed |
| workingDirectory |  |
| command | pwd |
| commandLine |  |
| additionalOptions |  |
| successExitCode | 0 |
| exitCode | 0 |

##### stdout

```
/home/kasm-user/repos/m30pm
```

##### stderr

```
null
```

#### Get Tool Version

|Command Property | Value |
|-----------------|-------|
| executedStatus  | Command has been executed |
| workingDirectory | `/home/kasm-user/repos/m30pm` |
| command | exec |
| commandLine | `/usr/local/bin/gradle --version` |
| additionalOptions |  |
| successExitCode | 0 |
| exitCode | 0 |

##### stdout

```

------------------------------------------------------------

Gradle 8.7

------------------------------------------------------------


Build time:   2024-03-22 15:52:46 UTC

Revision:     650af14d7653aa949fce5e886e685efc9cf97c10


Kotlin:       1.9.22

Groovy:       3.0.17

Ant:          Apache Ant(TM) version 1.10.13 compiled on January 4
2023

JVM:          11.0.24 (Ubuntu 11.0.24+8-post-Ubuntu-1ubuntu320.04)

OS:           Linux 5.15.0-117-generic amd64

```

##### stderr

```
null
```

### Verify Tool Info for "git" | *Success*

#### Find Tool

|Command Property | Value |
|-----------------|-------|
| executedStatus  | Command has been executed |
| workingDirectory |  |
| command | which |
| commandLine | `git` |
| additionalOptions |  |
| successExitCode | 0 |
| exitCode | 0 |

##### stdout

```
/usr/bin/git
```

##### stderr

```
null
```

#### Get Current Working Directory

|Command Property | Value |
|-----------------|-------|
| executedStatus  | Command has been executed |
| workingDirectory |  |
| command | pwd |
| commandLine |  |
| additionalOptions |  |
| successExitCode | 0 |
| exitCode | 0 |

##### stdout

```
/home/kasm-user/repos/m30pm
```

##### stderr

```
null
```

#### Get Tool Version

|Command Property | Value |
|-----------------|-------|
| executedStatus  | Command has been executed |
| workingDirectory | `/home/kasm-user/repos/m30pm` |
| command | exec |
| commandLine | `/usr/bin/git --version` |
| additionalOptions |  |
| successExitCode | 0 |
| exitCode | 0 |

##### stdout

```
git version 2.46.0
```

##### stderr

```
null
```

### Initialize Project Directory for my-project | *Success*

#### Create Project Directory /home/kasm-user/repos/m30pm/my-project

|Command Property | Value |
|-----------------|-------|
| executedStatus  | Command has been executed |
| workingDirectory | `/home/kasm-user/repos/m30pm` |
| command | mkdir |
| commandLine | `my-project` |
| additionalOptions |  |
| successExitCode | 0 |
| exitCode | 0 |

##### stdout

```
null
```

##### stderr

```
null
```

#### Create package.json File

|Command Property | Value |
|-----------------|-------|
| executedStatus  | Command has been executed |
| workingDirectory | `/home/kasm-user/repos/m30pm/my-project` |
| command | toFile |
| commandLine | *File Contents* |
| additionalOptions | `package.json` |
| successExitCode | 0 |
| exitCode | 0 |

##### File Contents

```
{
  "name": "my-project",
  "version": "0.0.0",
  "description": "My New m30ml Project",
  "author": "Mach 30",
  "license": "CC-BY-4.0",
  "packageManager": "npm",
  "workspaces": [
    "./packages/*",
    "./packages/@*/*"
  ],
  "m30pm": {
    "versionControlTool": "git",
    "buildTool": "gradle",
    "loggingLevel": "error"
  }
}
```

##### stdout

```
{
  "name": "my-project",
  "version": "0.0.0",
  "description": "My New m30ml Project",
  "author": "Mach 30",
  "license": "CC-BY-4.0",
  "packageManager": "npm",
  "workspaces": [
    "./packages/*",
    "./packages/@*/*"
  ],
  "m30pm": {
    "versionControlTool": "git",
    "buildTool": "gradle",
    "loggingLevel": "error"
  }
}
```

##### stderr

```
null
```

#### Create model/ Directory

|Command Property | Value |
|-----------------|-------|
| executedStatus  | Command has been executed |
| workingDirectory | `/home/kasm-user/repos/m30pm/my-project` |
| command | mkdir |
| commandLine | `model` |
| additionalOptions |  |
| successExitCode | 0 |
| exitCode | 0 |

##### stdout

```
null
```

##### stderr

```
null
```

#### Create Dot File for model/ Directory

|Command Property | Value |
|-----------------|-------|
| executedStatus  | Command has been executed |
| workingDirectory | `/home/kasm-user/repos/m30pm/my-project/model` |
| command | toFile |
| commandLine | *File Contents* |
| additionalOptions | `.description` |
| successExitCode | 0 |
| exitCode | 0 |

##### File Contents

```
Directory to store top-level model source code
```

##### stdout

```
Directory to store top-level model source code
```

##### stderr

```
null
```

#### Create views/queries/ Directories

|Command Property | Value |
|-----------------|-------|
| executedStatus  | Command has been executed |
| workingDirectory | `/home/kasm-user/repos/m30pm/my-project` |
| command | mkdir |
| commandLine | `views/queries` |
| additionalOptions | `-p` |
| successExitCode | 0 |
| exitCode | 0 |

##### stdout

```
null
```

##### stderr

```
null
```

#### Create Dot File for views/ Directory

|Command Property | Value |
|-----------------|-------|
| executedStatus  | Command has been executed |
| workingDirectory | `/home/kasm-user/repos/m30pm/my-project/views` |
| command | toFile |
| commandLine | *File Contents* |
| additionalOptions | `.description` |
| successExitCode | 0 |
| exitCode | 0 |

##### File Contents

```
Directory to store views source code
```

##### stdout

```
Directory to store views source code
```

##### stderr

```
null
```

#### Create Dot File for views/queries/ Directory

|Command Property | Value |
|-----------------|-------|
| executedStatus  | Command has been executed |
| workingDirectory | `/home/kasm-user/repos/m30pm/my-project/views/queries` |
| command | toFile |
| commandLine | *File Contents* |
| additionalOptions | `.description` |
| successExitCode | 0 |
| exitCode | 0 |

##### File Contents

```
Directory to store queries source code
```

##### stdout

```
Directory to store queries source code
```

##### stderr

```
null
```

#### Create default README Query File

|Command Property | Value |
|-----------------|-------|
| executedStatus  | Command has been executed |
| workingDirectory | `/home/kasm-user/repos/m30pm/my-project/views/queries` |
| command | toFile |
| commandLine | *File Contents* |
| additionalOptions | `README.query.njk` |
| successExitCode | 0 |
| exitCode | 0 |

##### File Contents

```
{#- TBD - Will specify the query needed to render README.md.njk -#}
{}
```

##### stdout

```
{#- TBD - Will specify the query needed to render README.md.njk -#}
{}
```

##### stderr

```
null
```

#### Create default README View File

|Command Property | Value |
|-----------------|-------|
| executedStatus  | Command has been executed |
| workingDirectory | `/home/kasm-user/repos/m30pm/my-project/views` |
| command | toFile |
| commandLine | *File Contents* |
| additionalOptions | `README.md.njk` |
| successExitCode | 0 |
| exitCode | 0 |

##### File Contents

```
# Project README File

TBD from template.
```

##### stdout

```
# Project README File

TBD from template.
```

##### stderr

```
null
```

#### Save Generated README.md File

|Command Property | Value |
|-----------------|-------|
| executedStatus  | Command has been executed |
| workingDirectory | `/home/kasm-user/repos/m30pm/my-project` |
| command | toFile |
| commandLine | *File Contents* |
| additionalOptions | `README.md` |
| successExitCode | 0 |
| exitCode | 0 |

##### File Contents

```
# Project README File

TBD from template.
```

##### stdout

```
# Project README File

TBD from template.
```

##### stderr

```
null
```

### Generate Package Manager Scaffolding for my-project | *Success*

#### Create packages Directory

|Command Property | Value |
|-----------------|-------|
| executedStatus  | Command has been executed |
| workingDirectory | `/home/kasm-user/repos/m30pm/my-project` |
| command | mkdir |
| commandLine | `packages` |
| additionalOptions |  |
| successExitCode | 0 |
| exitCode | 0 |

##### stdout

```
null
```

##### stderr

```
null
```

#### Create Dot File for packages/ Directory

|Command Property | Value |
|-----------------|-------|
| executedStatus  | Command has been executed |
| workingDirectory | `/home/kasm-user/repos/m30pm/my-project/packages` |
| command | toFile |
| commandLine | *File Contents* |
| additionalOptions | `.description` |
| successExitCode | 0 |
| exitCode | 0 |

##### File Contents

```
Directory to store sub-projects within
```

##### stdout

```
Directory to store sub-projects within
```

##### stderr

```
null
```

#### Save RC File .npmrc

|Command Property | Value |
|-----------------|-------|
| executedStatus  | Command has been executed |
| workingDirectory | `/home/kasm-user/repos/m30pm/my-project` |
| command | toFile |
| commandLine | *File Contents* |
| additionalOptions | `.npmrc` |
| successExitCode | 0 |
| exitCode | 0 |

##### File Contents

```
sign-git-tag=true
```

##### stdout

```
sign-git-tag=true
```

##### stderr

```
null
```

### Initialize Build Tool for my-project | *Failure*

#### Run gradle init | *Error*

|Command Property | Value |
|-----------------|-------|
| executedStatus  | Command has been executed |
| workingDirectory | `/home/kasm-user/repos/m30pm/my-project` |
| command | exec |
| commandLine | `/usr/local/bin/gradle init --typ basic --dsl groovy --project-name my-project --no-incubating` |
| additionalOptions |  |
| successExitCode | 0 |
| exitCode | 1 |

##### stdout

```
null
```

##### stderr

```

FAILURE: Build failed with an exception.

* What went wrong:
Problem configuring task :init from command line.
> Unknown command-line option '--typ'.

* Try:
> Run gradle help --task :init to get task usage details.
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.
> Get more help at https://help.gradle.org.

BUILD FAILED in 1s
```