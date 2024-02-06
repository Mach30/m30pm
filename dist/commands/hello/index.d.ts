import { Command } from '@oclif/core';
export default class Hello extends Command {
    static args: {
        person: import("@oclif/core/lib/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    static flags: {
        from: import("@oclif/core/lib/interfaces").OptionFlag<string, import("@oclif/core/lib/interfaces").CustomOptions>;
    };
    run(): Promise<void>;
}
