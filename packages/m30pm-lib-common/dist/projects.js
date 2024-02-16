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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectConfiguration = void 0;
const Enums = __importStar(require("./enums"));
class ProjectConfiguration {
    constructor(name, description, license, packageManager, versionControlTool, buildTool) {
        let npmPackageNameRegEx = new RegExp('^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$');
        if (npmPackageNameRegEx.test(name)) {
            this._name = name;
        }
        this._description = description ? description : "";
        this._license = license;
        this._packageManager = Enums.stringToEnumValue(Enums.PackageManagers, packageManager);
        this._versionControlTool = Enums.stringToEnumValue(Enums.VersionControlTools, versionControlTool);
        this._buildTool = Enums.stringToEnumValue(Enums.BuildTools, buildTool);
    }
    isValid() {
        return this._name !== undefined && this._license !== '' && this._packageManager !== undefined && this._versionControlTool !== undefined && this._buildTool !== undefined;
    }
    get name() {
        return this._name;
    }
    get description() {
        return this._description;
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
}
exports.ProjectConfiguration = ProjectConfiguration;