"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectConfiguration = exports.DefaultLicense = exports.DefaultVersion = void 0;
const Enums = __importStar(require("./enums"));
const semver_1 = __importDefault(require("semver"));
exports.DefaultVersion = '0.0.0';
exports.DefaultLicense = 'CC0-1.0';
class ProjectConfiguration {
    _name;
    _version;
    _description;
    _author;
    _license;
    _packageManager;
    _versionControlTool;
    _buildTool;
    constructor(name, version, description, author, license, packageManager, versionControlTool, buildTool) {
        this._name = this.validateName(name);
        this._version = this.validateVersion(version);
        this._description = this.validateDescription(description);
        this._author = this.validateAuthor(author);
        this._license = this.validateLicense(license);
        this._packageManager = this.validatePackageManager(packageManager);
        this._versionControlTool = this.validateVersionControlTool(versionControlTool);
        this._buildTool = this.validateBuildTool(buildTool);
    }
    isValid() {
        return this._name !== "" && this._version !== "" && this._license !== '' && this._packageManager !== Enums.PackageManagers.INVALID_PM && this._versionControlTool !== Enums.VersionControlTools.INVALID_VCT && this._buildTool !== Enums.BuildTools.INVALID_BT;
    }
    getJsonString() {
        let jsonObject = {};
        jsonObject["name"] = this._name;
        jsonObject["version"] = this._version;
        jsonObject["description"] = this._description;
        jsonObject["author"] = this._author;
        jsonObject["license"] = this._license;
        jsonObject["packageManager"] = this._packageManager;
        jsonObject["m30pm"] = {};
        jsonObject["m30pm"]["versionControlTool"] = this._versionControlTool;
        jsonObject["m30pm"]["buildTool"] = this._buildTool;
        return JSON.stringify(jsonObject, null, 2);
    }
    get name() {
        return this._name;
    }
    get version() {
        return this._version;
    }
    get description() {
        return this._description;
    }
    get author() {
        return this._author;
    }
    get license() {
        return this._license;
    }
    get packageManager() {
        return this._packageManager;
    }
    get versionControlTool() {
        return this._versionControlTool;
    }
    get buildTool() {
        return this._buildTool;
    }
    validateName(name) {
        let validatedName = "";
        let npmPackageNameRegEx = new RegExp('^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$');
        if (npmPackageNameRegEx.test(name)) {
            validatedName = name;
        }
        return validatedName;
    }
    validateVersion(version) {
        let validatedVersion = "";
        if (semver_1.default.valid(version)) {
            validatedVersion = version;
        }
        return validatedVersion;
    }
    validateDescription(description) {
        return description ? description : "";
    }
    validateAuthor(author) {
        return author ? author : "";
    }
    validateLicense(license) {
        return license;
    }
    validatePackageManager(packageManager) {
        let validatedPackageManager = Enums.PackageManagers.INVALID_PM;
        let testValidatedPackageManager = Enums.stringToEnumValue(Enums.PackageManagers, packageManager);
        if (testValidatedPackageManager === Enums.PackageManagers.NPM) {
            validatedPackageManager = Enums.PackageManagers.NPM;
        }
        else if (testValidatedPackageManager === Enums.PackageManagers.YARN) {
            validatedPackageManager = Enums.PackageManagers.YARN;
        }
        return validatedPackageManager;
    }
    validateVersionControlTool(versionControlTool) {
        let validatedVersionControlTool = Enums.VersionControlTools.INVALID_VCT;
        let testValidatedVersionControlTool = Enums.stringToEnumValue(Enums.VersionControlTools, versionControlTool);
        if (testValidatedVersionControlTool === Enums.VersionControlTools.GIT) {
            validatedVersionControlTool = Enums.VersionControlTools.GIT;
        }
        return validatedVersionControlTool;
    }
    validateBuildTool(buildTool) {
        let validatedBuildTool = Enums.BuildTools.INVALID_BT;
        let testBuildTool = Enums.stringToEnumValue(Enums.BuildTools, buildTool);
        if (testBuildTool === Enums.BuildTools.GRADLE) {
            validatedBuildTool = Enums.BuildTools.GRADLE;
        }
        return validatedBuildTool;
    }
}
exports.ProjectConfiguration = ProjectConfiguration;
