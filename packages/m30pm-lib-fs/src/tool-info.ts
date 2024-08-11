import { CommandHistory } from "./cmd-history";
import { ShellCommand, CommandToRun } from "./shell-cmd";
import semver from 'semver';

export class ToolInfo {
    private _name : string;
    private _installed : boolean;
    private _path : string;
    private _minVersion : string;
    private _version : string;
    private _cmdHistory : CommandHistory;

    constructor (name : string, minVersion : string = "0.0.0") {
        this._name = name;
        this._minVersion = minVersion;
        this._cmdHistory = new CommandHistory(`Get Tool Info for ${this.name}`);
        this._path = ""
        this._version = ""

        let whichCmd = new ShellCommand("Find Tool", "", CommandToRun.WHICH, this.name);
        this._installed = whichCmd.execute();
        this.cmdHistory.addExecutedCommand(whichCmd);

        if (this.installed) {
            this._path = whichCmd.stdout;

            let pwdCmd = new ShellCommand("Get Current Working Directory", "", CommandToRun.PWD)
            pwdCmd.execute();
            this.cmdHistory.addExecutedCommand(pwdCmd);
            let cwd = pwdCmd.stdout;
    
            let versionCmd = new ShellCommand("Get Tool Version", cwd, CommandToRun.EXEC, `${this.path} --version`);
            const versionReported = versionCmd.execute()
            this.cmdHistory.addExecutedCommand(versionCmd)
            if (versionReported) {
                const versionStringRegEx = /[0-9]+(\.[0-9]+)+/;
                const versionSearch = versionCmd.stdout.match(versionStringRegEx);
                const versionString = versionSearch ? versionSearch[0] : "";
                let coercedVersion = semver.coerce(versionString)?.toString()
                this._version = coercedVersion ? coercedVersion : "";
            }
        }
    }

    public get name() {
        return this._name;
    }

    public get installed() {
        return this._installed;
    }

    public get path() {
        return this._path;
    }

    public get minVersion() {
        return this._minVersion;
    }

    public get version() {
        return this._version
    }

    public get cmdHistory() {
        return this._cmdHistory;
    }

    public get verifiedVersion() {
        // check installed and version >= minVersion
        return this.installed && semver.gte(this.version, this.minVersion);
    }

    // toJsObject()
    public toJsObject() :Object {
        let jsObject: any = {};
        jsObject["name"] = this.name;
        jsObject["installed"] = this.installed;
        jsObject["path"] = this.path;
        jsObject["minVersion"] = this.minVersion;
        jsObject["version"] = this.version;
        jsObject["verifiedVersion"] = this.verifiedVersion;
        jsObject["cmdHistory"] = this.cmdHistory.toJsObject()
        return jsObject;
    }
}