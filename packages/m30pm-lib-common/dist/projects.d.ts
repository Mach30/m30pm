import * as Enums from './enums';
export declare const DefaultVersion = "0.0.0";
export declare const DefaultLicense = "CC0-1.0";
export declare class ProjectConfiguration {
    private _name;
    private _version;
    private _description;
    private _author;
    private _license;
    private _packageManager;
    private _versionControlTool;
    private _buildTool;
    constructor(name: string, version: string, description: string | undefined, author: string | undefined, license: string, packageManager: string, versionControlTool: string, buildTool: string);
    isValid(): boolean;
    get name(): string | undefined;
    get version(): string | undefined;
    get description(): string;
    get author(): string;
    get license(): string;
    get packageManager(): Enums.PackageManagers | undefined;
    get versionControlTool(): Enums.VersionControlTools | undefined;
    get buildTool(): Enums.BuildTools | undefined;
}
