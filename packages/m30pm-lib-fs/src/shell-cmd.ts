import * as sh from 'shelljs'
sh.config.silent = true;

export function getShell() : any {
    return sh;
}

enum ShellCommandStatus {
    NOT_EXECUTED = "Command has not been executed",
    EXECUTED_ONCE = "Command has been executed",
    EXECUTED_MORE_THAN_ONCE = "Command has already been executed"
}

export enum CommandToRun {
    CAT = "cat",
    EXEC = "exec",
    LS = "ls",
    MKDIR = "mkdir",
    PWD = "pwd",
    RM = "rm",
    TEMP_DIR = "tempdir",
    TO_FILE = "toFile",
    TOUCH = "touch",
    WHICH = "which"
}

export class ShellCommand {
    private _executedStatus : ShellCommandStatus;
    private _description: string;
    private _workingDirectory: string;
    private _command: CommandToRun;
    private _commandLine: string;
    private _additionalOptions: string;
    private _successExitCode: number;
    private _success: boolean = true;
    private _exitCode : number = 0;
    private _stdout: string = "";
    private _stderr: string = "";

    constructor(
        description: string,
        workingDirectory: string,
        command: CommandToRun,
        commandLine: string = "",
        additionalOptions : string = "",
        successExitCode: number = 0
    ) {
        this._executedStatus = ShellCommandStatus.NOT_EXECUTED;
        this._description = description;
        this._workingDirectory = workingDirectory;
        this._command = command;
        this._commandLine = commandLine;
        this._additionalOptions = additionalOptions;
        this._successExitCode = successExitCode;
    }

    public toJsObject(): Object {
        let jsObject: any = {};
        jsObject["executedStatus"] = this._executedStatus.toString();
        jsObject["description"] = this._description;
        jsObject["workingDirectory"] = this._workingDirectory;
        jsObject["command"] = this._command.toString();
        jsObject["commandLine"] = this._commandLine;
        jsObject["additionalOptions"] = this._additionalOptions;
        jsObject["successExitCode"] = this.successExitCode;
        jsObject["success"] = this._success;
        jsObject["exitCode"] = this._exitCode;
        jsObject["stdout"] = this._stdout;
        jsObject["stderr"] = this._stderr;
        return jsObject;
    }

    public execute() : boolean {
        if (this._executedStatus === ShellCommandStatus.EXECUTED_ONCE || 
            this._executedStatus === ShellCommandStatus.EXECUTED_MORE_THAN_ONCE) {
                this._executedStatus = ShellCommandStatus.EXECUTED_MORE_THAN_ONCE;
                return false;
            }

        let executedCommand : sh.ShellString | sh.ShellArray | null = null;
        if (this._command !== CommandToRun.PWD && 
            this._command !== CommandToRun.TEMP_DIR &&
            this._command !== CommandToRun.WHICH)
            executedCommand = sh.cd(this._workingDirectory)
        
        if (executedCommand === null || executedCommand.code === 0) {  
            switch(this._command) {
                case CommandToRun.CAT: {
                    if (this._additionalOptions === "")
                        executedCommand = sh.cat(this._commandLine);
                    else
                        executedCommand = sh.cat(this._additionalOptions, this._commandLine);
                    break;
                }
                case CommandToRun.EXEC: {
                    executedCommand = sh.exec(this._commandLine);
                    break;
                }
                case CommandToRun.LS: {
                    if (this._additionalOptions === "") 
                        executedCommand = sh.ls(this._commandLine)
                    else
                        executedCommand = sh.ls(this._additionalOptions, this._commandLine)
                    break;
                }
                case CommandToRun.MKDIR: {
                    if (this._additionalOptions === "")
                        executedCommand = sh.mkdir(this._commandLine)
                    else
                        executedCommand = sh.mkdir(this._additionalOptions, this._commandLine)
                    break;
                }
                case CommandToRun.PWD: {
                    executedCommand = sh.pwd();
                    break;
                }
                case CommandToRun.RM: {
                    if (this._additionalOptions === "")
                        executedCommand = sh.rm(this._commandLine)
                    else
                        executedCommand = sh.rm(this._additionalOptions, this._commandLine)
                    break;
                }
                case CommandToRun.TEMP_DIR: {
                    executedCommand = new sh.ShellString(sh.tempdir());
                    break;
                }
                case CommandToRun.TO_FILE: {
                    executedCommand = new sh.ShellString(this._commandLine)
                    executedCommand.to(this._additionalOptions)
                    executedCommand.cat(this._additionalOptions)
                    break;
                }
                case CommandToRun.TOUCH: {
                    if (this._additionalOptions === "")
                        executedCommand = sh.touch(this._commandLine)
                    else
                        executedCommand = sh.touch(this._additionalOptions, this._commandLine)
                    break;
                }
                case CommandToRun.WHICH: {
                    executedCommand = sh.which(this._commandLine)
                    break;
                }
            }
        }

        // capture results
        if (executedCommand !== null) {
            this._exitCode = executedCommand.code ? executedCommand.code : 0;
            this._success = this._exitCode === this._successExitCode;
            this._stdout = executedCommand.stdout ? executedCommand.stdout : "";
            this._stderr = executedCommand.stderr ? executedCommand.stderr : "";
        }
        else {
            this._success = false;
            this._exitCode = 1;
            this._stdout = "";
            this._stderr = "Command failed"
        }

        this._executedStatus = ShellCommandStatus.EXECUTED_ONCE;
        return this._success
    }

    public get executedStatus() {
        return this._executedStatus.toString();
    }

    public get description() {
        return this._description;
    }

    public get workingDirectory() {
        return this._workingDirectory;
    }

    public get command() {
        return this._command.toString();
    }

    public get commandLine() {
        return this._commandLine;
    }

    public get additionalOptions() {
        return this._additionalOptions;
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