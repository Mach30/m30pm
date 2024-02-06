"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
class Hello extends core_1.Command {
    static args = {
        person: core_1.Args.string({ description: 'Person to say hello to', required: true }),
    };
    static description = 'Say hello';
    static examples = [
        `$ oex hello friend --from oclif
hello friend from oclif! (./src/commands/hello/index.ts)
`,
    ];
    static flags = {
        from: core_1.Flags.string({ char: 'f', description: 'Who is saying hello', required: true }),
    };
    async run() {
        const { args, flags } = await this.parse(Hello);
        this.log(`hello ${args.person} from ${flags.from}! (./src/commands/hello/index.ts)`);
    }
}
exports.default = Hello;
