import { json } from 'stream/consumers';
import * as Enums from './enums'
import semver from 'semver';
import { Helpers } from './lib-common-helpers'

export const DefaultVersion = '0.0.0'
export const DefaultLicense = 'CC0-1.0'
export const DefaultWorkspacePath = "packages"

export class ProjectConfiguration {
    private _name: string;
    private _providedName: string;
    private _version: string;
    private _providedVersion: string;
    private _description: string;
    private _author: string;
    private _license: string;
    private _packageManager: Enums.PackageManagers;
    private _versionControlTool: Enums.VersionControlTools;
    private _buildTool: Enums.BuildTools;
    private _loggingLevel: Enums.LogLevels;
    private _packageJsonObject: Object;
    
    constructor(
        name: string,
        version: string,
        description: string | undefined,
        author: string | undefined,
        license: string,
        packageManager: string,
        versionControlTool: string,
        buildTool: string,
        loggingLevel: string = "error",
        packageJsonObject: string = ""
    ) {
        this._providedName = "";
        this._name = this.validateName(name);
        this._providedVersion = "";
        this._version = this.validateVersion(version);
        this._description = this.validateDescription(description);
        this._author = this.validateAuthor(author);
        this._license = this.validateLicense(license);
        this._packageManager = this.validatePackageManager(packageManager);
        this._versionControlTool = this.validateVersionControlTool(versionControlTool);
        this._buildTool = this.validateBuildTool(buildTool);
        this._loggingLevel = this.validateLoggingLevel(loggingLevel);
        this._packageJsonObject = this.validatePackageJsonObject(packageJsonObject);
    }

    public static fromJsObject(jsObject: any) {
        try {
            return new ProjectConfiguration(
                jsObject.name,
                jsObject.version,
                jsObject.description,
                jsObject.author,
                jsObject.license,
                jsObject.packageManager,
                jsObject.m30pm.versionControlTool,
                jsObject.m30pm.buildTool,
                jsObject.m30pm.loggingLevel,
                Helpers.toJsonString(jsObject)
            )
        } catch (error) {
            return new ProjectConfiguration(
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                ""
            )
        }
    }

    public isValid(): boolean {
        return this._name !== "" && this._version !== "" && this._license !== '' && this._packageManager !== Enums.PackageManagers.INVALID_PM && this._versionControlTool !== Enums.VersionControlTools.INVALID_VCT && this._buildTool !== Enums.BuildTools.INVALID_BT;
    }

    public toJsObject(): Object {
        let jsObject: any = this._packageJsonObject
        jsObject["name"] = this._name
        jsObject["version"] = this._version
        jsObject["description"] = this._description
        jsObject["author"] = this._author
        jsObject["license"] = this._license
        jsObject["packageManager"] = this._packageManager
        jsObject["workspaces"] = [] // TODO: make this conditional for root projects vs subprojects
        jsObject["workspaces"][0] = `./${DefaultWorkspacePath}/*` // TODO: make this conditional for root projects vs subprojects
        jsObject["m30pm"] = {}
        jsObject["m30pm"]["versionControlTool"] = this._versionControlTool
        jsObject["m30pm"]["buildTool"] = this._buildTool
        jsObject["m30pm"]["loggingLevel"] = this._loggingLevel;
        return jsObject
    }

    public getProjectStatus(): Object {
        let statusObject: any = {};
        statusObject["isValid"] = this.isValid();
        statusObject["projectConfiguration"] = this.toJsObject();
        statusObject["providedValues"] = {};
        statusObject["providedValues"]["name"] = this._providedName;
        statusObject["providedValues"]["version"] = this._providedVersion;
        return statusObject
    }

    public getInitialRcOptions(): any {
        let rcOptions: any = {};
        if (this._packageManager == Enums.PackageManagers.NPM) {
            rcOptions["sign-git-tag"] = true;
        }
        else if (this._packageManager == Enums.PackageManagers.YARN) {
            // no initial options for yarn
        }
        else {
            // no initial options for invalid package manager
        }

        return rcOptions;
    }

    public get name() {
        return this._name;
    }

    public get version() {
        return this._version;
    }

    public get description() {
        return this._description;
    }

    public get author() {
        return this._author;
    }

    public get license() {
        return this._license;
    }

    public get packageManager() {
        return this._packageManager;
    }

    public get versionControlTool() {
        return this._versionControlTool;
    }

    public get buildTool() {
        return this._buildTool;
    }

    public get loggingLevel() {
        return this._loggingLevel;
    }

    private validateName(name: string): string {
        this._providedName = name;
        let validatedName = "";
        let npmPackageNameRegEx = new RegExp('^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$')
        if(npmPackageNameRegEx.test(name)) {
            validatedName = name;
        }
        return validatedName
    }

    private validateVersion(version: string): string {
        this._providedVersion = version;
        let validatedVersion = "";
        if(semver.valid(version)) {
            validatedVersion = version;
        }
        return validatedVersion
    }

    private validateDescription(description: string | undefined): string {
        return description ? description : "";
    }

    private validateAuthor(author: string | undefined): string {
        return author ? author : "";
    }

    private validateLicense(license: string): string {
        return license;
    }

    private validatePackageManager(packageManager: string): Enums.PackageManagers {
        let validatedPackageManager = Enums.PackageManagers.INVALID_PM
        let testValidatedPackageManager = Enums.stringToEnumValue(Enums.PackageManagers, packageManager);
        if (testValidatedPackageManager === Enums.PackageManagers.NPM) {
            validatedPackageManager = Enums.PackageManagers.NPM
        }
        else if (testValidatedPackageManager === Enums.PackageManagers.YARN) {
            validatedPackageManager = Enums.PackageManagers.YARN;
        }
        return validatedPackageManager;
    }

    private validateVersionControlTool(versionControlTool: string): Enums.VersionControlTools {
        let validatedVersionControlTool = Enums.VersionControlTools.INVALID_VCT
        let testValidatedVersionControlTool = Enums.stringToEnumValue(Enums.VersionControlTools, versionControlTool);
        if (testValidatedVersionControlTool === Enums.VersionControlTools.GIT) {
            validatedVersionControlTool = Enums.VersionControlTools.GIT
        }
        return validatedVersionControlTool;
    }

    private validateBuildTool(buildTool: string): Enums.BuildTools {
        let validatedBuildTool = Enums.BuildTools.INVALID_BT
        let testBuildTool = Enums.stringToEnumValue(Enums.BuildTools, buildTool);
        if (testBuildTool === Enums.BuildTools.GRADLE) {
            validatedBuildTool = Enums.BuildTools.GRADLE
        }
        return validatedBuildTool;
    }

    private validateLoggingLevel(loggingLevel: string): Enums.LogLevels {
        let validatedLoggingLevel = Enums.LogLevels.NONE;
        let testLoggingLevel = Enums.stringToEnumValue(Enums.LogLevels, loggingLevel);
        switch (testLoggingLevel){
            case Enums.LogLevels.ERROR: {
                validatedLoggingLevel = Enums.LogLevels.ERROR;
                break;
            }
            case Enums.LogLevels.INFO: {
                validatedLoggingLevel = Enums.LogLevels.INFO;
                break;
            }
            case Enums.LogLevels.DEBUG: {
                validatedLoggingLevel = Enums.LogLevels.DEBUG;
                break;
            }
        }

        return validatedLoggingLevel;
    }

    private validatePackageJsonObject(packageJsonObject: string) {
        try {
            let testPackageJsonObject = JSON.parse(packageJsonObject)
            if (testPackageJsonObject.constructor === Object) {
                return testPackageJsonObject;
            }
            else {
                return {};
            }
        } catch {
            return {};
        }
    }
}
