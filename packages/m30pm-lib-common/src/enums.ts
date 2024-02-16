export const stringToEnumValue = <T>(enumObj: Object, value: string): T | undefined =>   Object.values(enumObj).find((v) => v === value);

export enum PackageManagers {
    NPM = 'npm',
    YARN = 'yarn'
}

export enum VersionControlTools {
    GIT = 'git'
}

export enum BuildTools {
    GRADLE = 'gradle'
}