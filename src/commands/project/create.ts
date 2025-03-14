import {Args, Command, Flags} from '@oclif/core'
//import {Metadata, MetadataFlag} from '@oclif/core/lib/interfaces/parser'
import {PackageManagers, ProjectConfiguration, DefaultVersion, DefaultLicense, ViewRenderer, BuiltinViews} from '@mach30/m30pm-lib-common'
import input from '@inquirer/input'
import select from '@inquirer/select'
import confirm from '@inquirer/confirm'
import { Projects } from '@mach30/m30pm-lib-fs'
import { mdStdout } from '@mach30/m30pm-lib-cli'

export default class ProjectCreate extends Command {
  static description = 'Create a new m30ml project'

  static examples = [
    {
      description: 'Display command help',
      command: '<%= config.bin %> <%= command.id %> --help'
    },
    {
      description: 'Create myProject and be prompted for remaining inputs',
      command: '<%= config.bin %> <%= command.id %> my-project'
    },
    {
      description: 'Create myProject entirely from command line',
      command: '<%= config.bin %> <%= command.id %> my-project -V "0.0.0" -d "My New m30ml Project" -a "Mach 30" -l "CC-BY-4.0" -p "npm"'
    }
  ]

  static flags = {
    // flag with a value (-n, --name=VALUE)
    versionString: Flags.string(
      {
        char: 'V',
        required: true,
        default: DefaultVersion,
        description: 'Initial project version string as a semver version (https://semver.org/)'
      }
    ),
    description: Flags.string(
      {
        char: 'd',
        description: 'Description of new m30ml project'
      }
    ),
    author: Flags.string(
      {
        char: 'a',
        description: 'Author of new m30ml project'
      }
    ),
    license: Flags.string(
      {
        char: 'l',
        required: true,
        default: DefaultLicense,
        description: 'Project license specified as an SPDX license identifier (https://spdx.org/licenses/)'
      }
    ),
    packageManager: Flags.string(
      {
        char: 'p',
        required: true,
        default: PackageManagers.NPM,
        options: Object.values(PackageManagers).filter(item => item !== "invalid_pm"), //TODO: fix me to not show invalid_pm
        description: 'Node-based package manager for new m30ml project'
      }
    )
  }

  static args = {
    projectName: Args.string(
      {
        required: true,
        description: 'Name of new m30ml project to create (must conform to npm package naming convention)'
      }
    ),
  }

  public async run(): Promise<void> {
//    const libCli = await import("m30pm-lib-cli");
    const {args, flags, metadata} = await this.parse(ProjectCreate)
    const projectName = args.projectName
    let versionString = flags.versionString
    if (metadata.flags["versionString"] && metadata.flags["versionString"].setFromDefault) {
      let response = await input({
        message: 'Provide an initial semver-formatted project version: ',
        default: DefaultVersion
      })
      versionString = response
    }
    let description = flags.description
    if (!description) {
      let response = await input({
        message: 'Provide a project description: ',
        default: ''
      })
      description = response
    }
    let author = flags.author
    if (!author) {
      let response = await input({
        message: 'Provide a project author: ',
        default: ''
      })
      author = response
    }
    let license = flags.license
    if (metadata.flags["license"] && metadata.flags["license"].setFromDefault) {
      let response = await input({
        message: 'Provide a SPDX-formatted project license: ',
        default: DefaultLicense
      })
      license = response
    }
    let packageManager = flags.packageManager
    if (metadata.flags["packageManager"] && metadata.flags["packageManager"].setFromDefault) {
      let response = await select({
        message: 'Select a package manager',
        choices: [
          {
            name: PackageManagers.NPM,
            value: PackageManagers.NPM
          },
          {
            name: PackageManagers.YARN,
            value: PackageManagers.YARN
          }
        ]
      });
      packageManager = response
    }
    const versionControlTool = "git"
    const buildTool = "gradle"
    const projectConfiguration = new ProjectConfiguration(
      projectName,
      versionString,
      description,
      author,
      license,
      packageManager,
      versionControlTool,
      buildTool
      )

    const projectStatus = projectConfiguration.getProjectStatus()
    const projectStatusView = ViewRenderer.render(BuiltinViews.getProjectStatusView(), projectStatus)
    
    if (projectConfiguration.isValid()) {
      mdStdout.log(projectStatusView)
    }
    else {  // invalid project
      mdStdout.logError(projectStatusView)
      this.exit(1)
    }
      
    const createProject = await confirm({ message: 'Create project?' })
    if (createProject) {
      console.log(``)
      Projects.createProject(projectConfiguration, mdStdout.notifyUserOnConsole);
    }
  }
}
