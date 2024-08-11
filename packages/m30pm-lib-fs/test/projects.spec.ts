import { expect } from "@oclif/test";
import { createProjectDirectory, generatePackageManagerScaffolding, initializeBuildTool } from "../src/projects"
import { Helpers } from "m30pm-lib-common";
import { getShell } from "../src/shell-cmd"
import { ProjectConfiguration } from "m30pm-lib-common";
import exp from "constants";
import * as fs from 'fs';

describe("m30pm-lib-fs createProjectDirectory() tests", () => {
    it('should return /tmp/my-project, true, and "" for my-project when directory does not exist', () => {
        getShell().cd('/tmp/')
        const project = new ProjectConfiguration("my-project", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "npm", "git", "gradle", "")
        const results = createProjectDirectory(project);
        expect(results.path).to.equal('/tmp/my-project')
        expect(results.empty).to.equal(true);
        expect(results.contents).to.equal("");
        expect(getShell().ls('/tmp/').toString().includes('my-project')).to.equal(true);
        getShell().rm('-rf', '/tmp/my-project');
    })

    it('should return /tmp/my-project-1, true, and "" for my-project when directory does exist and is empty', () => {
        getShell().cd('/tmp/')
        getShell().mkdir('my-project-1')
        const project = new ProjectConfiguration("my-project-1", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "npm", "git", "gradle", "")
        const results = createProjectDirectory(project);
        expect(results.path).to.equal('/tmp/my-project-1')
        expect(results.empty).to.equal(true);
        expect(results.contents).to.equal("");
        expect(getShell().ls('/tmp/').toString().includes('my-project-1')).to.equal(true);
        expect(getShell().ls('/tmp/my-project-1').toString().includes('package.json')).to.equal(true);
        const expectedPackageFile = Helpers.toJsonString(project.toJsObject())
        const packageFile = fs.readFileSync("/tmp/my-project-1/package.json", 'utf8')
        expect(packageFile).to.equal(expectedPackageFile)
        getShell().rm('-rf', '/tmp/my-project-1');
    })

    it('should return /tmp/my-project-2, false, and "foo" for my-project when directory does exist and has file foo', () => {
        getShell().cd('/tmp/')
        getShell().mkdir('my-project-2')
        getShell().touch('my-project-2/foo')
        const project = new ProjectConfiguration("my-project-2", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "npm", "git", "gradle", "")
        const results = createProjectDirectory(project);
        expect(results.path).to.equal('/tmp/my-project-2')
        expect(results.empty).to.equal(false);
        expect(results.contents).to.equal("foo");
        getShell().rm('-rf', '/tmp/my-project-2');
    })

    it('should return /tmp/my-project-3, false, and ".foo" for my-project when directory does exist and has file .foo', () => {
        getShell().cd('/tmp/')
        getShell().mkdir('my-project-3')
        getShell().touch('my-project-3/.foo')
        const project = new ProjectConfiguration("my-project-3", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "npm", "git", "gradle", "")
        const results = createProjectDirectory(project);
        expect(results.path).to.equal('/tmp/my-project-3')
        expect(results.empty).to.equal(false);
        expect(results.contents).to.equal(".foo");
        getShell().rm('-rf', '/tmp/my-project-3');
    })
})

describe("m30pm-lib-fs generatePackageManagerScaffolding() tests", () => {
    it('should return .npmrc and have correct file structure for npm', () => {
        getShell().cd('/tmp/')
        getShell().mkdir('my-project-4')
        const project = new ProjectConfiguration("my-project-4", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "npm", "git", "gradle", "")
        const results = generatePackageManagerScaffolding(project, "/tmp/my-project-4")
        expect(results.rcFileName).to.equal(".npmrc")
        expect(getShell().ls('/tmp/my-project-4').toString().includes('packages')).to.equal(true);
        expect(getShell().ls('-A', '/tmp/my-project-4').toString().includes('.npmrc')).to.equal(true);
        expect(getShell().ls('-A', '/tmp/my-project-4').toString().includes('.yarnrc.yml')).to.equal(false);
        const rcFile = fs.readFileSync("/tmp/my-project-4/.npmrc", 'utf8')
        expect(rcFile).to.equal("sign-git-tag=true")
        getShell().rm('-rf', '/tmp/my-project-4')
    })

    it('should return .yarnrc.yml and have correct file structure for yarn', () => {
        getShell().cd('/tmp/')
        getShell().mkdir('my-project-5')
        const project = new ProjectConfiguration("my-project-5", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "yarn", "git", "gradle", "")
        const results = generatePackageManagerScaffolding(project, "/tmp/my-project-5")
        expect(results.rcFileName).to.equal(".yarnrc.yml")
        expect(getShell().ls('-A', '/tmp/my-project-5').toString().includes('.npmrc')).to.equal(false);
        expect(getShell().ls('-A', '/tmp/my-project-5').toString().includes('.yarnrc.yml')).to.equal(true);
        const rcFile = fs.readFileSync("/tmp/my-project-5/.yarnrc.yml", 'utf8')
        expect(rcFile).to.equal("---")
        getShell().rm('-rf', '/tmp/my-project-5');
    })

    it('should return emptu string for invalid package manager', () => {
        getShell().cd('/tmp/')
        getShell().mkdir('my-project-6')
        const project = new ProjectConfiguration("my-project-6", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "not-npm", "git", "gradle", "")
        const results = generatePackageManagerScaffolding(project, "/tmp/my-project-6")
        expect(results.rcFileName).to.equal("")
        getShell().rm('-rf', '/tmp/my-project-6')
    })
})

describe("m30pm-lib-fs initializeBuildTool() tests", () => {
    it('should return true for valid build tool and stdout to not equal empty string and contain a build.gradle file in project directory', () => {
        getShell().cd('/tmp/');
        getShell().mkdir('my-project-7');
        const project = new ProjectConfiguration("my-project-7", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "npm", "git", "gradle", "");
        const results = initializeBuildTool(project, "/tmp/my-project-7", "/usr/local/bin/gradle");
        expect(results.btInitialized).to.equal(true);
        expect(results.stdout).to.not.equal("");
        expect(getShell().ls('/tmp/my-project-7').toString().includes('build.gradle')).to.equal(true);
        getShell().rm('-rf', '/tmp/my-project-7');
    })

    it('should return false for invalid build tool and not contain a build.gradle file in project directory', () => {
        getShell().cd('/tmp/');
        getShell().mkdir('my-project-8');
        const project = new ProjectConfiguration("my-project-8", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "npm", "git", "notgradle", "");
        const results = initializeBuildTool(project, "/tmp/my-project-8", "/usr/local/bin/gradle");
        expect(results.btInitialized).to.equal(false);
        expect(getShell().ls('/tmp/my-project-8').toString().includes('build.gradle')).to.equal(false);
        getShell().rm('-rf', '/tmp/my-project-8');
    })
})