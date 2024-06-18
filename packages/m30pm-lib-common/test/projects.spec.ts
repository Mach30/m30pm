import { expect } from "@oclif/test";
import { ProjectConfiguration } from "../src/projects";
import { PackageManagers, VersionControlTools, BuildTools } from "../src/enums";
import * as fs from 'fs';
import path from 'path';

describe("Project Validation Tests (argument-based constructor)", () => {
    it('should return true for the example project', () => {
        const project = new ProjectConfiguration("my-project", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "npm", "git", "gradle", "")
        expect(project.isValid()).to.equal(true)
        project.description
        project.author
        project.license
    })

    it('should return true for the example project but with yarn', () => {
        const project = new ProjectConfiguration("my-project", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "yarn", "git", "gradle", "")
        expect(project.isValid()).to.equal(true)
        project.description
        project.author
        project.license
    })

    it('should return false and have an empty name for invalid project name', () => {
        const project = new ProjectConfiguration("myProject", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "npm", "git", "gradle", "")
        expect(project.isValid()).to.equal(false)
        expect(project.name).to.equal("")
    })

    it('should return false and have an empty version for invalid version', () => {
        const project = new ProjectConfiguration("my-project", "bad version", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "npm", "git", "gradle", "")
        expect(project.isValid()).to.equal(false)
        expect(project.version).to.equal("")
    })

    it('should return true and have an empty description for and undefined description', () => {
        const project = new ProjectConfiguration("my-project", "0.0.0", undefined, "Mach 30", "CC-BY-4.0", "npm", "git", "gradle", "")
        expect(project.isValid()).to.equal(true)
        expect(project.description).to.equal("")
    })

    it('should return true and have an empty author for and undefined author', () => {
        const project = new ProjectConfiguration("my-project", "0.0.0", "My New m30ml Project", undefined, "CC-BY-4.0", "npm", "git", "gradle", "")
        expect(project.isValid()).to.equal(true)
        expect(project.author).to.equal("")
    })

    it('should return false and have invalid package manager for invalid package manager', () => {
        const project = new ProjectConfiguration("my-project", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "not-npm", "git", "gradle", "")
        expect(project.isValid()).to.equal(false)
        expect(project.packageManager).to.equal(PackageManagers.INVALID_PM)
    })

    it('should return false and have invalid version control tool for invalid version control tool', () => {
        const project = new ProjectConfiguration("my-project", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "npm", "not-git", "gradle", "")
        expect(project.isValid()).to.equal(false)
        expect(project.versionControlTool).to.equal(VersionControlTools.INVALID_VCT)
    })

    it('should return false and have invalid build tool for invalid build tool', () => {
        const project = new ProjectConfiguration("my-project", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "npm", "git", "not-gradle", "")
        expect(project.isValid()).to.equal(false)
        expect(project.buildTool).to.equal(BuildTools.INVALID_BT)
    })
})

describe("To JSObject Tests", () => {
    it('should return example project package.json string for a given example project', () => {
        const exampleProjectJson = fs.readFileSync(path.join(__dirname, 'example-package.json') , 'utf8');
        const project = new ProjectConfiguration("my-project", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "npm", "git", "gradle", "")
        expect(JSON.stringify(project.toJsObject(), null, 2)).to.equal(exampleProjectJson)
    })
})

describe("Project Validation Tests for ProjectConfiguration.fromJsObject()", () => {
    it('should return true for the example project from package.json string', () => {
        const project = new ProjectConfiguration("my-project", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "npm", "git", "gradle", "")
        const project2 = ProjectConfiguration.fromJsObject(project.toJsObject())
        expect(project2.isValid()).to.equal(true)
        project2.description
        project2.author
        project2.license
    })

    it('should return true for the example project but with yarn from package.json string', () => {
        const project = new ProjectConfiguration("my-project", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "yarn", "git", "gradle", "")
        const project2 = ProjectConfiguration.fromJsObject(project.toJsObject())
        expect(project2.isValid()).to.equal(true)
        project2.description
        project2.author
        project2.license
    })

    it('should return false and have an empty name for invalid project name from package.json string', () => {
        const project = new ProjectConfiguration("myProject", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "npm", "git", "gradle", "")
        const project2 = ProjectConfiguration.fromJsObject(project.toJsObject())
        expect(project2.isValid()).to.equal(false)
        expect(project2.name).to.equal("")
    })

    it('should return false and have an empty version for invalid version from package.json string', () => {
        const project = new ProjectConfiguration("my-project", "bad version", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "npm", "git", "gradle", "")
        const project2 = ProjectConfiguration.fromJsObject(project.toJsObject())
        expect(project2.isValid()).to.equal(false)
        expect(project2.version).to.equal("")
    })

    it('should return true and have an empty description for and undefined description from package.json string', () => {
        const project = new ProjectConfiguration("my-project", "0.0.0", undefined, "Mach 30", "CC-BY-4.0", "npm", "git", "gradle", "")
        const project2 = ProjectConfiguration.fromJsObject(project.toJsObject())
        expect(project2.isValid()).to.equal(true)
        expect(project2.description).to.equal("")
    })

    it('should return true and have an empty author for and undefined author from package.json string', () => {
        const project = new ProjectConfiguration("my-project", "0.0.0", "My New m30ml Project", undefined, "CC-BY-4.0", "npm", "git", "gradle", "")
        const project2 = ProjectConfiguration.fromJsObject(project.toJsObject())
        expect(project2.isValid()).to.equal(true)
        expect(project2.author).to.equal("")
    })

    it('should return false and have invalid package manager for invalid package manager from package.json string', () => {
        const project = new ProjectConfiguration("my-project", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "not-npm", "git", "gradle", "")
        const project2 = ProjectConfiguration.fromJsObject(project.toJsObject())
        expect(project2.isValid()).to.equal(false)
        expect(project2.packageManager).to.equal(PackageManagers.INVALID_PM)
    })

    it('should return false and have invalid version control tool for invalid version control tool from package.json string', () => {
        const project = new ProjectConfiguration("my-project", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "npm", "not-git", "gradle", "")
        const project2 = ProjectConfiguration.fromJsObject(project.toJsObject())
        expect(project2.isValid()).to.equal(false)
        expect(project2.versionControlTool).to.equal(VersionControlTools.INVALID_VCT)
    })

    it('should return false and have invalid build tool for invalid build tool from package.json string', () => {
        const project = new ProjectConfiguration("my-project", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "npm", "git", "not-gradle", "")
        const project2 = ProjectConfiguration.fromJsObject(project.toJsObject())
        expect(project2.isValid()).to.equal(false)
        expect(project2.buildTool).to.equal(BuildTools.INVALID_BT)
    })

    it('should return false for malformed package.json string', () => {
        const project2 = ProjectConfiguration.fromJsObject({})
        expect(project2.isValid()).to.equal(false)
    })
})