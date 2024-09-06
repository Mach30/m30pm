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
