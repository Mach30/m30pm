import { LogLevels } from "m30pm-lib-common";
import { CommandHistory } from "./cmd-history";
import { getShell } from "./shell-cmd";
import { QueryRunner, BuiltinViews, Helpers } from "m30pm-lib-common";
import * as yaml from 'js-yaml';
const moment = require('moment');

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

    public get name() : string {
        return this._name
    }
}

export class CommandHistoryLogger {
    private _loggingLevel: LogLevels;
    private _projectPath: string;
    private _encounteredError: Boolean;
    private _functionInfo: FunctionInfo;
    private _commandHistoryList: Array<CommandHistory>;
    private _logFileName: string;

    constructor(loggingLevel: LogLevels, projectPath: string, functionInfo: FunctionInfo) {
        this._loggingLevel = loggingLevel;
        this._projectPath = projectPath;
        this._encounteredError = false;         
        this._functionInfo = functionInfo;
        this._commandHistoryList = new Array<CommandHistory>();  
        
        this._logFileName = `${moment().format('YYYYMMDD-HHmm')}-${this._functionInfo.name}-${this._loggingLevel.toString()}`
    }

    public addCommandHistory(cmdHistory: CommandHistory) {
        this._encounteredError = !cmdHistory.success;
        this._commandHistoryList.push(cmdHistory);
    }

    public toJsObject(): Object {
        let jsObject: any = {}
        jsObject["encounteredError"] = this._encounteredError;
        jsObject["functionInfo"] = this._functionInfo.toJsObject();
        jsObject["commandHistoryList"] = [];
        this._commandHistoryList.forEach( (cmdHistory) => {
            jsObject["commandHistoryList"].push(cmdHistory.toJsObject())
        })
        return jsObject;
    }

    public get logFileName () {
        return this._logFileName
    }

    public get logFileDirectory() {
        return `${this._projectPath}/.logs`
    }

    public writeLog() {
        let query = new QueryRunner(BuiltinViews.getCommandHistoryLogQuery(), this.toJsObject())
        query.addParameter("loggingLevel", this._loggingLevel.toString())
        let queryResults = query.runQuery()
        let queryResultsObject = yaml.load(queryResults) as Object;

        if (Helpers.toJsonString(queryResultsObject) === "{}")
            return

        getShell().mkdir("-p", this.logFileDirectory)
        let yamlLogFile = getShell().ShellString(queryResults)
        yamlLogFile.to(`${this.logFileDirectory}/${this.logFileName}.yaml`)
    }
}