"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
class ProjectCreate extends core_1.Command {
    static description = 'describe the command here';
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
        file: core_1.Args.string({ description: 'file to read' }),
    };
    async run() {
        const { args, flags } = await this.parse(ProjectCreate);
        const name = flags.name ?? 'world';
        this.log(`hello ${name} from /home/kasm-user/repos/m30pm/src/commands/project/create.ts`);
        if (args.file && flags.force) {
            this.log(`you input --force and --file: ${args.file}`);
        }
    }
}
exports.default = ProjectCreate;
