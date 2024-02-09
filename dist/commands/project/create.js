"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
class ProjectCreate extends core_1.Command {
    static description = 'Create a new m30ml project';
    static examples = [
        '<%= config.bin %> <%= command.id %>',
    ];
    static flags = {
        // flag with a value (-n, --name=VALUE)
        name: core_1.Flags.string({ char: 'n', description: 'name to print' }),
        // flag with no value (-f, --force)
        force: core_1.Flags.boolean({ char: 'f' }),
    };
    static args = {
        projectName: core_1.Args.string({
            name: 'Project Name',
            required: true,
            description: 'Name of new m30ml project to create (must conform to npm package naming convention)'
        }),
    };
    async run() {
        const { args, flags } = await this.parse(ProjectCreate);
    }
}
exports.default = ProjectCreate;
