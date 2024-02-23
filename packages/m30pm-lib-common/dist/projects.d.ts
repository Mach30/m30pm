import * as Enums from './enums';
export declare const DefaultLicense = "CC0-1.0";
export declare class ProjectConfiguration {
    private _name;
    private _description;
    private _license;
    private _packageManager;
    private _versionControlTool;
    private _buildTool;
    constructor(name: string, description: string | undefined, license: string, packageManager: string, versionControlTool: string, buildTool: string);
    isValid(): boolean;
    get name(): string | undefined;
    get description(): string;
    get license(): string;
    get packageManager(): Enums.PackageManagers | undefined;
    get versionControlTool(): Enums.VersionControlTools | undefined;
    get buildTool(): Enums.BuildTools | undefined;
}
