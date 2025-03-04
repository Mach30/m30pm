export const stringToEnumValue = <T>(enumObj: Object, value: string): T | undefined =>   Object.values(enumObj).find((v) => v === value);

export enum PackageManagers {
    INVALID_PM = 'invalid_pm',
    NPM = 'npm',
    YARN = 'yarn'
}

export enum VersionControlTools {
    INVALID_VCT = 'invalid_vct',
    GIT = 'git'
}

export enum BuildTools {
    INVALID_BT = 'invalid_bt',
    GRADLE = 'gradle'
}

export enum LogLevels {
    NONE = 'none',      // prevents logging, sets to this state when an invalid state is encountered
    ERROR = 'error',    // only logs errors with context
    INFO = 'info',      // logs summary of activity, reports errors when they occur
    DEBUG = 'debug'     // logs full command history
}