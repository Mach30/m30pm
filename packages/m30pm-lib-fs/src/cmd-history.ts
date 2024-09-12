import { ShellCommand } from "./shell-cmd"

export class CommandHistory {
    private _description : string;
    private _success : boolean;
    private _executedCommands : Array<ShellCommand>;

    constructor(description : string) {
        this._description = description;
        this._success = true;
        this._executedCommands = new Array<ShellCommand>();
    }

    public addExecutedCommand(command: ShellCommand) : boolean {
        if (!command.executedExactlyOnce || !this._success)
            return false;

        this._success = command.success;
        this._executedCommands.push(command);
        return true;
    }

    public get description() {
        return this._description;
    }

    public get success() {
        return this._success;
    }

    public get executedCommands() {
        let executedCommands = new Array<Object>();
        this._executedCommands.forEach((cmd: ShellCommand) => {
            executedCommands.push(cmd.toJsObject())
        })
        return executedCommands;
    }

    public toJsObject() : Object {
        let jsObject: any = {};
        jsObject["description"] = this.description
        jsObject["success"] = this.success
        jsObject["executedCommands"] = this.executedCommands
        return jsObject
    }
}