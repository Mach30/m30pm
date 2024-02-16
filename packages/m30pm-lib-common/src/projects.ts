import * as Enums from './enums'

export class ProjectConfiguration {
    private _name: string | undefined;
    private _description: string;
    private _license: string;
    private _packageManager: Enums.PackageManagers | undefined;
    private _versionControlTool: Enums.VersionControlTools | undefined;
    private _buildTool: Enums.BuildTools | undefined;
    
    constructor(
        name: string,
        description: string,
        license: string,
        packageManager: string,
        versionControlTool: string,
        buildTool: string
    ) {
        let npmPackageNameRegEx = new RegExp('^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$')
        if(npmPackageNameRegEx.test(name)) {
            this._name = name;
        }
        this._description = description;
        this._license = license;
        this._packageManager = Enums.stringToEnumValue(Enums.PackageManagers, packageManager);
        this._versionControlTool = Enums.stringToEnumValue(Enums.VersionControlTools, versionControlTool);
        this._buildTool = Enums.stringToEnumValue(Enums.BuildTools, buildTool);
    }

    public isValid(): boolean {
        return this._name !== undefined && this._packageManager !== undefined && this._versionControlTool !== undefined && this._buildTool !== undefined;
    }

    public get name() {
        return this._name;
    }

    public get description() {
        return this._description;
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
