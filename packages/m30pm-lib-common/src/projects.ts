import * as Enums from './enums'
import semver from 'semver';

export const DefaultVersion = '0.0.0'
export const DefaultLicense = 'CC0-1.0'

export class ProjectConfiguration {
    private _name: string | undefined;
    private _version: string | undefined;
    private _description: string;
    private _author: string;
    private _license: string;
    private _packageManager: Enums.PackageManagers | undefined;
    private _versionControlTool: Enums.VersionControlTools | undefined;
    private _buildTool: Enums.BuildTools | undefined;
    
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
        let npmPackageNameRegEx = new RegExp('^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$')
        if(npmPackageNameRegEx.test(name)) {
            this._name = name;
        }
        if(semver.valid(version)) {
            this._version = version;
        }
        this._description = description ? description : "";
        this._author = author ? author : "";
        this._license = license;
        this._packageManager = Enums.stringToEnumValue(Enums.PackageManagers, packageManager);
        this._versionControlTool = Enums.stringToEnumValue(Enums.VersionControlTools, versionControlTool);
        this._buildTool = Enums.stringToEnumValue(Enums.BuildTools, buildTool);
    }

    public isValid(): boolean {
        return this._name !== undefined && this._version !== undefined && this._license !== '' && this._packageManager !== undefined && this._versionControlTool !== undefined && this._buildTool !== undefined;
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
}
