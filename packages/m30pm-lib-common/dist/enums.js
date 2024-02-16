"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildTools = exports.VersionControlTools = exports.PackageManagers = exports.stringToEnumValue = void 0;
const stringToEnumValue = (enumObj, value) => Object.values(enumObj).find((v) => v === value);
exports.stringToEnumValue = stringToEnumValue;
var PackageManagers;
(function (PackageManagers) {
    PackageManagers["NPM"] = "npm";
    PackageManagers["YARN"] = "yarn";
})(PackageManagers || (exports.PackageManagers = PackageManagers = {}));
var VersionControlTools;
(function (VersionControlTools) {
    VersionControlTools["GIT"] = "git";
})(VersionControlTools || (exports.VersionControlTools = VersionControlTools = {}));
var BuildTools;
(function (BuildTools) {
    BuildTools["GRADLE"] = "gradle";
})(BuildTools || (exports.BuildTools = BuildTools = {}));
