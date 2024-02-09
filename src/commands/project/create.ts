import {Args, Command, Flags} from '@oclif/core'

export default class ProjectCreate extends Command {
  static description = 'Create a new m30ml project'

  static examples = [
    {
      description: 'Display command help',
      command: '<%= config.bin %> <%= command.id %> --help'
    },
    {
      description: 'Create myProject and be prompted for remaining inputs',
      command: '<%= config.bin %> <%= command.id %> myProject'
    },
    {
      description: 'Create myProject entirely from command line',
      command: '<%= config.bin %> <%= command.id %> myProject -d "My New m30ml Project" -l "CC-BY-4.0" -p "npm"'
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
        required: true,
        default: 'CC0-1.0',
        description: 'Project license specified as an SPDX license identifier (https://spdx.org/licenses/)'
      }
    ),
    packageManager: Flags.string(
      {
        char: 'p',
        required: true,
        default: 'npm',
        options: ['npm', 'yarn'],
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

  }
}
