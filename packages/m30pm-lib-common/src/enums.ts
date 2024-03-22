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