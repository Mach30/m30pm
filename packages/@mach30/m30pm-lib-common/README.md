# m30pm-lib-common

Mach 30 PM common functions library

<!-- TSDOC_START -->

## :toolbox: Functions

- [stringToEnumValue](#gear-stringtoenumvalue)

### :gear: stringToEnumValue

| Function | Type |
| ---------- | ---------- |
| `stringToEnumValue` | `<T>(enumObj: Object, value: string) => T or undefined` |


## :wrench: Constants

- [DefaultVersion](#gear-defaultversion)
- [DefaultLicense](#gear-defaultlicense)
- [DefaultWorkspacePath](#gear-defaultworkspacepath)

### :gear: DefaultVersion

| Constant | Type |
| ---------- | ---------- |
| `DefaultVersion` | `"0.0.0"` |

### :gear: DefaultLicense

| Constant | Type |
| ---------- | ---------- |
| `DefaultLicense` | `"CC0-1.0"` |

### :gear: DefaultWorkspacePath

| Constant | Type |
| ---------- | ---------- |
| `DefaultWorkspacePath` | `"packages"` |


## :factory: Helpers

### Methods

- [toJsonString](#gear-tojsonstring)

#### :gear: toJsonString

| Method | Type |
| ---------- | ---------- |
| `toJsonString` | `(o: Object) => string` |

## :factory: ProjectConfiguration

### Methods

- [fromJsObject](#gear-fromjsobject)
- [isValid](#gear-isvalid)
- [toJsObject](#gear-tojsobject)
- [getProjectStatus](#gear-getprojectstatus)
- [getInitialRcOptions](#gear-getinitialrcoptions)

#### :gear: fromJsObject

| Method | Type |
| ---------- | ---------- |
| `fromJsObject` | `(jsObject: any) => ProjectConfiguration` |

#### :gear: isValid

| Method | Type |
| ---------- | ---------- |
| `isValid` | `() => boolean` |

#### :gear: toJsObject

| Method | Type |
| ---------- | ---------- |
| `toJsObject` | `() => Object` |

#### :gear: getProjectStatus

| Method | Type |
| ---------- | ---------- |
| `getProjectStatus` | `() => Object` |

#### :gear: getInitialRcOptions

| Method | Type |
| ---------- | ---------- |
| `getInitialRcOptions` | `() => any` |

## :factory: BuiltinViews

### Methods

- [getCommandHistoryLogMdView](#gear-getcommandhistorylogmdview)
- [getCommandHistoryLogQuery](#gear-getcommandhistorylogquery)
- [getProjectStatusView](#gear-getprojectstatusview)
- [getNpmRcFileView](#gear-getnpmrcfileview)
- [getYarnRcYamlFileView](#gear-getyarnrcyamlfileview)
- [getReadmeQuery](#gear-getreadmequery)
- [getReadmeView](#gear-getreadmeview)
- [getBuildQuery](#gear-getbuildquery)
- [getBuildView](#gear-getbuildview)

#### :gear: getCommandHistoryLogMdView

| Method | Type |
| ---------- | ---------- |
| `getCommandHistoryLogMdView` | `() => string` |

#### :gear: getCommandHistoryLogQuery

| Method | Type |
| ---------- | ---------- |
| `getCommandHistoryLogQuery` | `() => string` |

#### :gear: getProjectStatusView

| Method | Type |
| ---------- | ---------- |
| `getProjectStatusView` | `() => string` |

#### :gear: getNpmRcFileView

| Method | Type |
| ---------- | ---------- |
| `getNpmRcFileView` | `() => string` |

#### :gear: getYarnRcYamlFileView

| Method | Type |
| ---------- | ---------- |
| `getYarnRcYamlFileView` | `() => string` |

#### :gear: getReadmeQuery

| Method | Type |
| ---------- | ---------- |
| `getReadmeQuery` | `() => string` |

#### :gear: getReadmeView

| Method | Type |
| ---------- | ---------- |
| `getReadmeView` | `() => string` |

#### :gear: getBuildQuery

| Method | Type |
| ---------- | ---------- |
| `getBuildQuery` | `() => string` |

#### :gear: getBuildView

| Method | Type |
| ---------- | ---------- |
| `getBuildView` | `() => string` |

## :factory: ViewRenderer

### Methods

- [render](#gear-render)

#### :gear: render

| Method | Type |
| ---------- | ---------- |
| `render` | `(template: string, context: object, debug?: Boolean) => string` |

## :factory: QueryRunner

### Methods

- [addParameter](#gear-addparameter)
- [runQuery](#gear-runquery)

#### :gear: addParameter

| Method | Type |
| ---------- | ---------- |
| `addParameter` | `(name: string, value: any) => void` |

#### :gear: runQuery

| Method | Type |
| ---------- | ---------- |
| `runQuery` | `(debug?: Boolean) => string` |

## :nut_and_bolt: Enum

- [PackageManagers](#gear-packagemanagers)
- [VersionControlTools](#gear-versioncontroltools)
- [BuildTools](#gear-buildtools)
- [LogLevels](#gear-loglevels)
- [FormattedMessageType](#gear-formattedmessagetype)

### :gear: PackageManagers



| Property | Type | Description |
| ---------- | ---------- | ---------- |
| `INVALID_PM` | `'invalid_pm'` |  |
| `NPM` | `'npm'` |  |
| `YARN` | `'yarn'` |  |


### :gear: VersionControlTools



| Property | Type | Description |
| ---------- | ---------- | ---------- |
| `INVALID_VCT` | `'invalid_vct'` |  |
| `GIT` | `'git'` |  |


### :gear: BuildTools



| Property | Type | Description |
| ---------- | ---------- | ---------- |
| `INVALID_BT` | `'invalid_bt'` |  |
| `GRADLE` | `'gradle'` |  |


### :gear: LogLevels



| Property | Type | Description |
| ---------- | ---------- | ---------- |
| `NONE` | `'none'` |  |
| `ERROR` | `'error'` |  |
| `INFO` | `'info'` |  |
| `DEBUG` | `'debug'` |  |


### :gear: FormattedMessageType



| Property | Type | Description |
| ---------- | ---------- | ---------- |
| `NORMAL` | `"normal"` |  |
| `WARNING` | `"warning"` |  |
| `ERROR` | `"error"` |  |


<!-- TSDOC_END -->
