import { Command } from '@oclif/core';
export default class ProjectCreate extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        name: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined, import("@oclif/core/lib/interfaces").CustomOptions>;
        force: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    static args: {
        projectName: import("@oclif/core/lib/interfaces").Arg<string, Record<string, unknown>>;
    };
    run(): Promise<void>;
}
