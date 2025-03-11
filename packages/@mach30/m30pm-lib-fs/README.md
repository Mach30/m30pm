# m30pm-lib-fs

Mach 30 PM filesystem implementation library

<!-- TSDOC_START -->

## :toolbox: Functions

- [getShell](#gear-getshell)
- [initializeProjectDirectory](#gear-initializeprojectdirectory)
- [generatePackageManagerScaffolding](#gear-generatepackagemanagerscaffolding)
- [initializeBuildTool](#gear-initializebuildtool)
- [initializeVersionControlTool](#gear-initializeversioncontroltool)
- [getVctNextStep](#gear-getvctnextstep)

### :gear: getShell

| Function | Type |
| ---------- | ---------- |
| `getShell` | `() => any` |

### :gear: initializeProjectDirectory

| Function | Type |
| ---------- | ---------- |
| `initializeProjectDirectory` | `(project: ProjectConfiguration, workingDirectory: string, projectDirectory: string) => CommandHistory` |

### :gear: generatePackageManagerScaffolding

| Function | Type |
| ---------- | ---------- |
| `generatePackageManagerScaffolding` | `(project: ProjectConfiguration, projectDirectory: string) => CommandHistory` |

### :gear: initializeBuildTool

| Function | Type |
| ---------- | ---------- |
| `initializeBuildTool` | `(project: ProjectConfiguration, projectDirectory: string, buildToolPath: string) => CommandHistory` |

### :gear: initializeVersionControlTool

| Function | Type |
| ---------- | ---------- |
| `initializeVersionControlTool` | `(project: ProjectConfiguration, projectDirectory: string, versionControlToolPath: string) => CommandHistory` |

### :gear: getVctNextStep

| Function | Type |
| ---------- | ---------- |
| `getVctNextStep` | `(versionControlTool: VersionControlTools) => string` |


## :factory: ShellCommand

### Methods

- [toJsObject](#gear-tojsobject)
- [execute](#gear-execute)

#### :gear: toJsObject

| Method | Type |
| ---------- | ---------- |
| `toJsObject` | `() => Object` |

#### :gear: execute

| Method | Type |
| ---------- | ---------- |
| `execute` | `() => boolean` |

## :factory: CommandHistory

### Methods

- [addExecutedCommand](#gear-addexecutedcommand)
- [toJsObject](#gear-tojsobject)

#### :gear: addExecutedCommand

| Method | Type |
| ---------- | ---------- |
| `addExecutedCommand` | `(command: ShellCommand) => boolean` |

#### :gear: toJsObject

| Method | Type |
| ---------- | ---------- |
| `toJsObject` | `() => Object` |

## :factory: FunctionArgument

### Methods

- [toJsObject](#gear-tojsobject)

#### :gear: toJsObject

| Method | Type |
| ---------- | ---------- |
| `toJsObject` | `() => Object` |

## :factory: FunctionInfo

### Methods

- [addArgument](#gear-addargument)
- [toJsObject](#gear-tojsobject)

#### :gear: addArgument

| Method | Type |
| ---------- | ---------- |
| `addArgument` | `(argument: FunctionArgument) => void` |

#### :gear: toJsObject

| Method | Type |
| ---------- | ---------- |
| `toJsObject` | `() => Object` |

## :factory: CommandHistoryLogger

### Methods

- [addCommandHistory](#gear-addcommandhistory)
- [toJsObject](#gear-tojsobject)
- [writeLog](#gear-writelog)

#### :gear: addCommandHistory

| Method | Type |
| ---------- | ---------- |
| `addCommandHistory` | `(cmdHistory: CommandHistory) => void` |

#### :gear: toJsObject

| Method | Type |
| ---------- | ---------- |
| `toJsObject` | `() => Object` |

#### :gear: writeLog

| Method | Type |
| ---------- | ---------- |
| `writeLog` | `() => void` |

## :factory: ToolInfo

### Methods

- [toJsObject](#gear-tojsobject)

#### :gear: toJsObject

| Method | Type |
| ---------- | ---------- |
| `toJsObject` | `() => Object` |

## :factory: Projects

### Methods

- [createProject](#gear-createproject)

#### :gear: createProject

| Method | Type |
| ---------- | ---------- |
| `createProject` | `(project: ProjectConfiguration, notifyUser: NotifyUserFunction) => void` |

## :nut_and_bolt: Enum

- [CommandToRun](#gear-commandtorun)

### :gear: CommandToRun



| Property | Type | Description |
| ---------- | ---------- | ---------- |
| `CAT` | `"cat"` |  |
| `EXEC` | `"exec"` |  |
| `LS` | `"ls"` |  |
| `MKDIR` | `"mkdir"` |  |
| `PWD` | `"pwd"` |  |
| `RM` | `"rm"` |  |
| `TEMP_DIR` | `"tempdir"` |  |
| `TO_FILE` | `"toFile"` |  |
| `TOUCH` | `"touch"` |  |
| `WHICH` | `"which"` |  |


<!-- TSDOC_END -->
