import { CommandToRun, ShellCommand } from "./shell-cmd"

export class CommandHistory {
    private _description : string;
    private _success : boolean;
    private _commands : Array<ShellCommand>;

    constructor(description : string) {
        this._description = description;
        this._success = true;
        this._commands = new Array<ShellCommand>();
    }

    public get description() {
        return this._description;
    }

    public get success() {
        return this._success;
    }

    public get commands() {
        let commands = new Array<Object>();
        this._commands.forEach((cmd: ShellCommand) => {
            commands.push(cmd.toJsObject())
        })
        return commands;
    }
}