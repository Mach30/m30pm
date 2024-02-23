"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const m30pm_lib_common_1 = require("m30pm-lib-common");
const input_1 = require("@inquirer/input");
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
            default: m30pm_lib_common_1.DefaultLicense,
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
        const { args, flags, metadata } = await this.parse(ProjectCreate);
        const projectName = args.projectName;
        let description = flags.description;
        if (!description) {
            let response = await (0, input_1.default)({
                message: 'Provide a project description: ',
                default: ''
            });
            description = response;
        }
        let license = flags.license;
        if (metadata.flags["license"] && metadata.flags["license"].setFromDefault) {
            let response = await (0, input_1.default)({
                message: 'Provide a SPDX-formatted project license: ',
                default: m30pm_lib_common_1.DefaultLicense
            });
            license = response;
        }
        let packageManager = flags.packageManager;
        const versionControlTool = "git";
        const buildTool = "gradle";
        const projectConfiguration = new m30pm_lib_common_1.ProjectConfiguration(projectName, description, license, packageManager, versionControlTool, buildTool);
        console.log(projectConfiguration.isValid());
        console.log(projectConfiguration);
    }
}
exports.default = ProjectCreate;
