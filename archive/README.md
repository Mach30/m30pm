# Mach 30 Modeling Language Tools

The Mach 30 Modeling Language Tools (m30mlTools) module is a set of tools for working with the Mach 30 Modeling Language (m30ml).  These tools facilitate the generation of and working with unified m30ml models from file sources.

The m30mlTools script curretly supports the *make* command (and its subcommands).  The make command can be used to generate the artifacts for an entire m30ml project or individual artifacts.  Configuration is managed through the m30ml.yaml and the package.json files or from command line options.

# Configuration

The m30ml.yaml file is composed of three sections:  settings, targets, and all.  The settings section covers project wide settings not found in the package.json file.  The targets section covers the definition of the make targets and their individudal settings.  The All section contains the ordered list of targets to build when the selected target is *all*.

## Settings

| Setting | Description | Default | Example |
|---------|-------------|--------|----------|
|projectPath | Root path of the m30ml project | CWD | /home/jones/demoProject/ |
|modelSrcPath | Directory within project path where m30ml model files are stored | modelSrc | modelSrc |
|templatePath | Directory within project path where m30ml template files are stored | templates | templates |
|outputPath | Directory within project path to store the generated artifacts in | dist | dist |
|unifiedModelFile| File path relative to the outputPath of the unified model created from the model source content | model.yaml | models/main.yaml |

Reserved Words

* *CWD*: meaning the Current Working Directory, can be used for any of the path related settings
* *all*: meaning build all targets, can be used on command line to indicate a making all targets in the order specified in the m30ml.yaml file

## Targets

The Targets section is a dictionary of objects.  The key values are the target names and the objects are m30mlTools make subcommands with their individual settings.  The currently supported subcommands are: makeModel and makeDoc.

### makeModel

The makeModel subcommand directs m30mlTools to parse the m30ml model source and generate a unified model yaml file.  There are no additional settings for the makeModel subcommand.  Note, you can override any of the project level settings when calling the makeModel subcommand.

### makeDoc

The makeDoc subcommand directs m30mlTools to generate a document by applying a unified model to a Liquid template.  The additional settings for the makeDoc subcommand are: templateFile and outFile.  Note, you can override any of the project level settings when calling the makeDoc subcommand.

| Setting | Description | Default | Example |
|---------|-------------|--------|----------|
| templateFile | File path relative to the templatePath of the Liquid template file to use | none | demo.md.liquid |
| outFile | File path relative to the outputPath of the generated document | none | demo.md |

## Example

```
settings:
  projectPath: "CWD"
  modelSrcPath: "modelSrc"
  templatePath: "templates"
  outputPath: "dist"
  unifiedModelFile: "model.yaml"
targets:
  model:
    subcommand: makeModel
  demoDoc:
    subcommand: makeDoc
    templateFile: "demo.md.liquid"
    outFile: "demo.md"
all:
  - model
  - demoDoc
```

