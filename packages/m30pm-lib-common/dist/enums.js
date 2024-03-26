"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildTools = exports.VersionControlTools = exports.PackageManagers = exports.stringToEnumValue = void 0;
const stringToEnumValue = (enumObj, value) => Object.values(enumObj).find((v) => v === value);
exports.stringToEnumValue = stringToEnumValue;
var PackageManagers;
(function (PackageManagers) {
    PackageManagers["INVALID_PM"] = "invalid_pm";
    PackageManagers["NPM"] = "npm";
    PackageManagers["YARN"] = "yarn";
})(PackageManagers || (exports.PackageManagers = PackageManagers = {}));
var VersionControlTools;
(function (VersionControlTools) {
    VersionControlTools["INVALID_VCT"] = "invalid_vct";
    VersionControlTools["GIT"] = "git";
})(VersionControlTools || (exports.VersionControlTools = VersionControlTools = {}));
var BuildTools;
(function (BuildTools) {
    BuildTools["INVALID_BT"] = "invalid_bt";
    BuildTools["GRADLE"] = "gradle";
})(BuildTools || (exports.BuildTools = BuildTools = {}));
