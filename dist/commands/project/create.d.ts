import { Command } from '@oclif/core';
export default class ProjectCreate extends Command {
    static description: string;
    static examples: {
        description: string;
        command: string;
    }[];
    static flags: {
        description: import("@oclif/core/lib/interfaces/parser").OptionFlag<string | undefined, import("@oclif/core/lib/interfaces/parser").CustomOptions>;
        license: import("@oclif/core/lib/interfaces/parser").OptionFlag<string, import("@oclif/core/lib/interfaces/parser").CustomOptions>;
        packageManager: import("@oclif/core/lib/interfaces/parser").OptionFlag<string, import("@oclif/core/lib/interfaces/parser").CustomOptions>;
    };
    static args: {
        projectName: import("@oclif/core/lib/interfaces/parser").Arg<string, Record<string, unknown>>;
    };
    run(): Promise<void>;
}
