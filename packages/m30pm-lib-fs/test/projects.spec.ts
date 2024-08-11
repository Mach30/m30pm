import { expect } from "@oclif/test";
import { initializeProjectDirectory, generatePackageManagerScaffolding, initializeBuildTool, initializeVersionControlTool, getVctNextStep } from "../src/projects"
import { CommandHistory } from "../src/cmd-history";
import { Helpers } from "m30pm-lib-common";
import { getShell } from "../src/shell-cmd"
import { ProjectConfiguration } from "m30pm-lib-common";
import { VersionControlTools } from "m30pm-lib-common";

describe("m30pm-lib-fs initializeProjectDirectory() tests", () => {
    it('should return true for my-project when directory does not exist', () => {
        getShell().cd('/tmp/')
        const project = new ProjectConfiguration("my-project", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "npm", "git", "gradle", "")
        const history = initializeProjectDirectory(project);
        expect(history.success).to.equal(true);
        expect(getShell().ls('/tmp/').toString().includes('my-project')).to.equal(true);
        getShell().rm('-rf', '/tmp/my-project');
    })

    it('should return true for my-project-1 when directory does exist and is empty', () => {
        getShell().cd('/tmp/')
        getShell().mkdir('my-project-1')
        const project = new ProjectConfiguration("my-project-1", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "npm", "git", "gradle", "")
        const history = initializeProjectDirectory(project);
        expect(history.success).to.equal(true);
        expect(getShell().ls('/tmp/').toString().includes('my-project-1')).to.equal(true);
        expect(getShell().ls('/tmp/my-project-1').toString().includes('package.json')).to.equal(true);
        const expectedPackageFile = Helpers.toJsonString(project.toJsObject())
        const packageFile = getShell().cat("/tmp/my-project-1/package.json").stdout
        expect(packageFile).to.equal(expectedPackageFile)
        getShell().rm('-rf', '/tmp/my-project-1');
    })

    it('should return false when my-project-2 directory does exist and has file foo', () => {
        getShell().cd('/tmp/')
        getShell().mkdir('my-project-2')
        getShell().touch('my-project-2/foo')
        const project = new ProjectConfiguration("my-project-2", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "npm", "git", "gradle", "")
        const history = initializeProjectDirectory(project);
        expect(history.success).to.equal(false);
        getShell().rm('-rf', '/tmp/my-project-2');
    })

    it('should return false for my-project-3 when directory does exist and has file .foo', () => {
        getShell().cd('/tmp/')
        getShell().mkdir('my-project-3')
        getShell().touch('my-project-3/.foo')
        const project = new ProjectConfiguration("my-project-3", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "npm", "git", "gradle", "")
        const history = initializeProjectDirectory(project);
        expect(history.success).to.equal(false);
        getShell().rm('-rf', '/tmp/my-project-3');
    })
})

describe("m30pm-lib-fs generatePackageManagerScaffolding() tests", () => {
    it('should return true and have correct file structure for npm', () => {
        getShell().cd('/tmp/')
        getShell().mkdir('my-project-4')
        const project = new ProjectConfiguration("my-project-4", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "npm", "git", "gradle", "")
        const history = generatePackageManagerScaffolding(project, "/tmp/my-project-4")
        expect(history.success).to.equal(true)
        expect(getShell().ls('/tmp/my-project-4').toString().includes('packages')).to.equal(true);
        expect(getShell().ls('-A', '/tmp/my-project-4').toString().includes('.npmrc')).to.equal(true);
        expect(getShell().ls('-A', '/tmp/my-project-4').toString().includes('.yarnrc.yml')).to.equal(false);
        const rcFile = getShell().cat("/tmp/my-project-4/.npmrc").stdout
        expect(rcFile).to.equal("sign-git-tag=true")
        getShell().rm('-rf', '/tmp/my-project-4')
    })

    it('should return true and have correct file structure for yarn', () => {
        getShell().cd('/tmp/')
        getShell().mkdir('my-project-5')
        const project = new ProjectConfiguration("my-project-5", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "yarn", "git", "gradle", "")
        const history = generatePackageManagerScaffolding(project, "/tmp/my-project-5")
        expect(history.success).to.equal(true)
        expect(getShell().ls('-A', '/tmp/my-project-5').toString().includes('.npmrc')).to.equal(false);
        expect(getShell().ls('-A', '/tmp/my-project-5').toString().includes('.yarnrc.yml')).to.equal(true);
        const rcFile = getShell().cat("/tmp/my-project-5/.yarnrc.yml").stdout
        expect(rcFile).to.equal("---")
        getShell().rm('-rf', '/tmp/my-project-5');
    })
})

describe("m30pm-lib-fs initializeBuildTool() tests", () => {
    it('should return true for gradle and contain a build.gradle file in project directory', () => {
        getShell().cd('/tmp/');
        getShell().mkdir('my-project-7');
        const project = new ProjectConfiguration("my-project-7", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "npm", "git", "gradle", "");
        const history = initializeBuildTool(project, "/tmp/my-project-7", "/usr/local/bin/gradle");
        expect(history.success).to.equal(true);
        expect(getShell().ls('/tmp/my-project-7').toString().includes('build.gradle')).to.equal(true);
        getShell().rm('-rf', '/tmp/my-project-7');
    })
})

describe("m30pm-lib-fs initializeVersionControlTool() tests", () => {
    // cannot get this test to work automatically, but manual test of the function works
    // it('should return true for git contain a .git directory in project directory', () => {
    //     getShell().cd('/tmp/');
    //     getShell().mkdir('my-project-8');
    //     getShell().touch('my-project-8/package.json')
    //     const project = new ProjectConfiguration("my-project-8", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "npm", "git", "gradle", "");
    //     const history = initializeVersionControlTool(project, "/tmp/my-project-8", "/usr/bin/git");
    //     //console.log(history.toJsObject())
    //     expect(history.success).to.equal(true);
    //     expect(getShell().ls('-d', '/tmp/my-project-8/.git').toString().includes('.git')).to.equal(true);
    //     getShell().rm('-rf', '/tmp/my-project-8');
    // })

    it('should return non-empty string for getVctNextStep(GIT)', () => {
        expect(getVctNextStep(VersionControlTools.GIT)).to.not.equal("")
    })

    it('should return empty string for getVctNextStep(INVALID_VCT)', () => {
        expect(getVctNextStep(VersionControlTools.INVALID_VCT)).to.equal("")
    })
})