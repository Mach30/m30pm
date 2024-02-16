"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const m30pm_lib_common_1 = require("m30pm-lib-common");
class ProjectCreate extends core_1.Command {
    static description = 'Create a new m30ml project';
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
    ];
    static flags = {
        // flag with a value (-n, --name=VALUE)
        description: core_1.Flags.string({
            char: 'd',
            description: 'Description of new m30ml project'
        }),
        license: core_1.Flags.string({
            char: 'l',
            required: true,
            default: 'CC0-1.0',
            description: 'Project license specified as an SPDX license identifier (https://spdx.org/licenses/)'
        }),
        packageManager: core_1.Flags.string({
            char: 'p',
            required: true,
            default: m30pm_lib_common_1.PackageManagers.NPM,
            options: Object.values(m30pm_lib_common_1.PackageManagers),
            description: 'Node-based package manager for new m30ml project'
        })
    };
    static args = {
        projectName: core_1.Args.string({
            required: true,
            description: 'Name of new m30ml project to create (must conform to npm package naming convention)'
        }),
    };
    async run() {
        const { args, flags } = await this.parse(ProjectCreate);
        const projectName = args.projectName;
        const description = flags.description ? flags.description : "";
        const license = flags.license;
        const packageManager = flags.packageManager;
        const versionControlTool = "git";
        const buildTool = "gradle";
        const projectConfiguration = new m30pm_lib_common_1.ProjectConfiguration(projectName, description, license, packageManager, versionControlTool, buildTool);
        console.log(projectConfiguration.isValid());
    }
}
exports.default = ProjectCreate;
