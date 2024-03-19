import { expect } from "@oclif/test";
import { ProjectConfiguration } from "../src/projects";

describe("Project Validation Tests", () => {
    it('should return true for the example project', () => {
        const project = new ProjectConfiguration("my-project", "My New m30ml Project", "CC-BY-4.0", "npm", "git", "gradle")
        expect(project.isValid()).to.equal(true)
        project.description
        project.license
    })

    it('should return true and have an empty description for and undefined description', () => {
        const project = new ProjectConfiguration("my-project", undefined, "CC-BY-4.0", "npm", "git", "gradle")
        expect(project.isValid()).to.equal(true)
        expect(project.description).to.equal("")
    })

    it('should return false and have undefined name for invalid project name', () => {
        const project = new ProjectConfiguration("myProject", "My New m30ml Project", "CC-BY-4.0", "npm", "git", "gradle")
        expect(project.isValid()).to.equal(false)
        expect(project.name).to.be.undefined
    })

    it('should return false and have undefined package manager for invalid package manager', () => {
        const project = new ProjectConfiguration("my-project", "My New m30ml Project", "CC-BY-4.0", "not-npm", "git", "gradle")
        expect(project.isValid()).to.equal(false)
        expect(project.packageManager).to.be.undefined
    })

    it('should return false and have undefined version control tool for invalid version control tool', () => {
        const project = new ProjectConfiguration("my-project", "My New m30ml Project", "CC-BY-4.0", "npm", "not-git", "gradle")
        expect(project.isValid()).to.equal(false)
        expect(project.versionControlTool).to.be.undefined
    })

    it('should return false and have undefined build tool for invalid build tool', () => {
        const project = new ProjectConfiguration("my-project", "My New m30ml Project", "CC-BY-4.0", "npm", "git", "not-gradle")
        expect(project.isValid()).to.equal(false)
        expect(project.buildTool).to.be.undefined
    })
})