import { LogLevels } from "m30pm-lib-common";
import { CommandHistory } from "./cmd-history";
import { getShell } from "./shell-cmd";

export class FunctionArgument {
    private _name: string;
    private _value: Object;

    constructor(name: string, value: Object) {
        this._name = name;
        this._value = value;
    }

    public get name() {
        return this._name;
    }

    public get value() {
        return this._value;
    }

    public toJsObject(): Object {
        let jsObject: any = {}
        jsObject["name"] = this.name;
        jsObject["value"] = this.value;
        return jsObject;
    }
}

export class FunctionInfo {
    private _name : string;
    private _arguments: Array<FunctionArgument>;

    constructor(name: string) {
        this._name = name;
        this._arguments = new Array<FunctionArgument>();
    }

    public addArgument(argument: FunctionArgument) {
        this._arguments.push(argument);
    }

    public toJsObject(): Object {
        let jsObject: any = {}
        jsObject["name"] = this._name;
        jsObject["arguments"] = [];
        this._arguments.forEach( (argument) => {
            jsObject["arguments"].push(argument.toJsObject())
        })
        
        return jsObject;
    }
}

export class CommandHistoryLogger {
    private _loggingLevel: LogLevels;
    private _projectPath: string;
    private _functionInfo: FunctionInfo;
    private _commandHistoryList: Array<CommandHistory>

    constructor(loggingLevel: LogLevels, projectPath: string, functionInfo: FunctionInfo) {
        this._loggingLevel = loggingLevel;
        this._projectPath = projectPath;
        this._functionInfo = functionInfo;
        this._commandHistoryList = new Array<CommandHistory>();            
    }

    public writeLog() {
        getShell().mkdir("-p", `${this._projectPath}/.logs`)
    }
}