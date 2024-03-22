import * as Enums from './enums'
import semver from 'semver';

export const DefaultVersion = '0.0.0'
export const DefaultLicense = 'CC0-1.0'

export class ProjectConfiguration {
    private _name: string;
    private _version: string;
    private _description: string;
    private _author: string;
    private _license: string;
    private _packageManager: Enums.PackageManagers;
    private _versionControlTool: Enums.VersionControlTools;
    private _buildTool: Enums.BuildTools;
    
    constructor(
        name: string,
        version: string,
        description: string | undefined,
        author: string | undefined,
        license: string,
        packageManager: string,
        versionControlTool: string,
        buildTool: string
    ) {
        this._name = this.validateName(name);
        this._version = this.validateVersion(version);
        this._description = this.validateDescription(description);
        this._author = this.validateAuthor(author);
        this._license = this.validateLicense(license);
        this._packageManager = this.validatePackageManager(packageManager);
        this._versionControlTool = this.validateVersionControlTool(versionControlTool);
        this._buildTool = this.validateBuildTool(buildTool);
    }

    public isValid(): boolean {
        return this._name !== "" && this._version !== "" && this._license !== '' && this._packageManager !== Enums.PackageManagers.INVALID_PM && this._versionControlTool !== Enums.VersionControlTools.INVALID_VCT && this._buildTool !== Enums.BuildTools.INVALID_BT;
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

    private validateName(name: string): string {
        let validatedName = "";
        let npmPackageNameRegEx = new RegExp('^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$')
        if(npmPackageNameRegEx.test(name)) {
            validatedName = name;
        }
        return validatedName
    }

    private validateVersion(version: string): string {
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
}
