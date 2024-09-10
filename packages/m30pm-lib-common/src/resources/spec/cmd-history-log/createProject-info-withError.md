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

- Find Tool
- Get Current Working Directory
- Get Tool Version

### Verify Tool Info for "gradle" | *Success*

- Find Tool
- Get Current Working Directory
- Get Tool Version

### Verify Tool Info for "git" | *Success*

- Find Tool
- Get Current Working Directory
- Get Tool Version

### Initialize Project Directory for my-project | *Success*

- Create Project Directory /home/kasm-user/repos/m30pm/my-project
- Create package.json File
- Create model/ Directory
- Create Dot File for model/ Directory
- Create views/queries/ Directories
- Create Dot File for views/ Directory
- Create Dot File for views/queries/ Directory
- Create default README Query File
- Create default README View File
- Save Generated README.md File

### Generate Package Manager Scaffolding for my-project | *Success*

- Create packages Directory
- Create Dot File for packages/ Directory
- Save RC File .npmrc

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
