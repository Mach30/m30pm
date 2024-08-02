import * as sh from 'shelljs'

sh.config.silent = true;

export class ShellCommand {
    private _workingDirectory: string;
    private _command: string;
    private _successExitCode: number;
    private _success: boolean = true;
    private _exitCode : number = 0;
    private _stdout: string = "";
    private _stderr: string = "";

    constructor(
        workingDirectory: string,
        command: string,
        successExitCode: number = 0
    ) {
        this._workingDirectory = workingDirectory;
        this._command = command;
        this._successExitCode = successExitCode;
    }

    public toJsObject(): Object {
        let jsObject: any = {};
        jsObject["workingDirectory"] = this._workingDirectory;
        jsObject["command"] = this._command;
        jsObject["successExitCode"] = this.successExitCode;
        jsObject["success"] = this._success;
        jsObject["exitCode"] = this._exitCode;
        jsObject["stdout"] = this._stdout;
        jsObject["stderr"] = this._stderr;
        return jsObject;
    }

    public execute() : boolean {
        sh.cd(this._workingDirectory)
        let executedCommand = sh.exec(this._command);
        this._success = executedCommand.code === this._successExitCode;
        this._exitCode = executedCommand.code;
        this._stdout = executedCommand.stdout;
        this._stderr = executedCommand.stderr;

        return this._success
    }

    public get workingDirectory() {
        return this._workingDirectory;
    }

    public get command() {
        return this._command;
    }

    public get successExitCode() {
        return this._successExitCode;
    }

    public get success() {
        return this._success;
    }

    public get exitCode() {
        return this._exitCode;
    }

    public get stdout() {
        return this._stdout;
    }

    public get stderr() {
        return this._stderr;
    }

}