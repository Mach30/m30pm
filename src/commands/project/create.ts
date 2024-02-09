import {Args, Command, Flags} from '@oclif/core'

export default class ProjectCreate extends Command {
  static description = 'Create a new m30ml project'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: Flags.boolean({char: 'f'}),
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
