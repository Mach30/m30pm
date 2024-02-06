"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
class World extends core_1.Command {
    static args = {};
    static description = 'Say hello world';
    static examples = [
        `<%= config.bin %> <%= command.id %>
hello world! (./src/commands/hello/world.ts)
`,
    ];
    static flags = {};
    async run() {
        this.log('hello world! (./src/commands/hello/world.ts)');
    }
}
exports.default = World;
