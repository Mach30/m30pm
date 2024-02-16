import {Args, Command, Flags} from '@oclif/core'
import {PackageManagers, ProjectConfiguration} from 'm30pm-lib-common'
import input from '@inquirer/input'

const defaultLicense = 'CC0-1.0'

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
      command: '<%= config.bin %> <%= command.id %> my-project -d "My New m30ml Project" -l "CC-BY-4.0" -p "npm"'
    }
  ]

  static flags = {
    // flag with a value (-n, --name=VALUE)
    description: Flags.string(
      {
        char: 'd',
        description: 'Description of new m30ml project'
      }
    ),
    license: Flags.string(
      {
        char: 'l',
        description: 'Project license specified as an SPDX license identifier (https://spdx.org/licenses/)'
      }
    ),
    packageManager: Flags.string(
      {
        char: 'p',
        required: true,
        default: PackageManagers.NPM,
        options: Object.values(PackageManagers),
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
    const {args, flags} = await this.parse(ProjectCreate)
    const projectName = args.projectName
    let description = flags.description
    if (!description) {
      let response = await input({
        message: 'Provide a project description: ',
        default: ''
      })
      description = response
    }
    let license = flags.license
    if (!license) {
      let response = await input({
        message: 'Provide a SPDX-formatted project license: ',
        default: defaultLicense
      })
      license = response
    }
    let packageManager = flags.packageManager
    const versionControlTool = "git"
    const buildTool = "gradle"
    const projectConfiguration = new ProjectConfiguration(
      projectName,
      description,
      license,
      packageManager,
      versionControlTool,
      buildTool
      )
      console.log(projectConfiguration.isValid())
      console.log(projectConfiguration)
    }
}
