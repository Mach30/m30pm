import { expect } from "@oclif/test";
import { testTool, verifyMinToolVersion, getShell, createProjectDirectory } from "../src/projects"
import exp from "constants";

describe("m30pm-lib-fs testTool() tests", () => {
    it('should return false, "", and "" for foo', () => {
        const results = testTool("foo")
        expect(results.toolFound).to.equal(false)
        expect(results.toolPath).to.equal("")
        expect(results.toolVersion).to.equal("")
    })

    it('should return true, /usr/bin/ls, and 8.30.0 for ls', () => {
        const results = testTool("ls")
        expect(results.toolFound).to.equal(true)
        expect(results.toolPath).to.equal("/usr/bin/ls")
        expect(results.toolVersion).to.equal("8.30.0")
    })

    it('should return true, /usr/bin/git, and 2.45.2 for git', () => {
        const results = testTool("git")
        expect(results.toolFound).to.equal(true)
        expect(results.toolPath).to.equal("/usr/bin/git")
        expect(results.toolVersion).to.equal("2.45.2")
    })

    it('should return true, /usr/local/bin/gradle, and 8.7.0 for gradle', () => {
        const results = testTool("gradle")
        expect(results.toolFound).to.equal(true)
        expect(results.toolPath).to.equal("/usr/local/bin/gradle")
        expect(results.toolVersion).to.equal("8.7.0")
    })

    it('should return true, /var/lib/nvm/versions/node/v20.11.1/bin/npm, and 10.2.4 for npm', () => {
        const results = testTool("npm")
        expect(results.toolFound).to.equal(true)
        expect(results.toolPath).to.equal("/var/lib/nvm/versions/node/v20.11.1/bin/npm")
        expect(results.toolVersion).to.equal("10.2.4")
    })
})

describe("m30pm-lib-fs verifyMinToolVersion() tests", () => {
    it('should not error and return false for tool not found', () => {
        let toolInfo : any = {}
        toolInfo["toolName"] = "myapp";
        toolInfo["toolVersion"] = "";
        toolInfo["toolFound"] = false;
        
        const results = verifyMinToolVersion(toolInfo, "1.2.3")
        expect(results.toolName).to.equal("myapp")
        expect(results.toolVersion).to.equal("")
        expect(results.minVersion).to.equal("1.2.3")
        expect(results.passedMinVersionCheck).to.equal(false)
    })

    it('should return false for 1.2.3 >= 2.0.0', () => {
        let toolInfo : any = {}
        toolInfo["toolName"] = "myapp";
        toolInfo["toolVersion"] = "1.2.3";
        toolInfo["toolFound"] = true;
        
        const results = verifyMinToolVersion(toolInfo, "2.0.0")
        expect(results.toolName).to.equal("myapp")
        expect(results.toolVersion).to.equal("1.2.3")
        expect(results.minVersion).to.equal("2.0.0")
        expect(results.passedMinVersionCheck).to.equal(false)
    })

    it('should return true for 2.1.0 >= 2.0.0', () => {
        let toolInfo : any = {}
        toolInfo["toolName"] = "myapp";
        toolInfo["toolVersion"] = "2.1.0";
        toolInfo["toolFound"] = true;
        
        const results = verifyMinToolVersion(toolInfo, "2.0.0")
        expect(results.toolName).to.equal("myapp")
        expect(results.toolVersion).to.equal("2.1.0")
        expect(results.minVersion).to.equal("2.0.0")
        expect(results.passedMinVersionCheck).to.equal(true)
    })

    it('should return true for 2.0.0 >= 2.0.0', () => {
        let toolInfo : any = {}
        toolInfo["toolName"] = "myapp";
        toolInfo["toolVersion"] = "2.0.0";
        toolInfo["toolFound"] = true;
        
        const results = verifyMinToolVersion(toolInfo, "2.0.0")
        expect(results.toolName).to.equal("myapp")
        expect(results.toolVersion).to.equal("2.0.0")
        expect(results.minVersion).to.equal("2.0.0")
        expect(results.passedMinVersionCheck).to.equal(true)
    })
})

describe("m30pm-lib-fs createProjectDirectory() tests", () => {
    it('should return /tmp/my-project, true, and "" for my-project when directory does not exist', () => {
        getShell().cd('/tmp/')
        const results = createProjectDirectory('my-project');
        expect(results.path).to.equal('/tmp/my-project')
        expect(results.empty).to.equal(true);
        expect(results.contents).to.equal("");
        expect(getShell().ls('/tmp/').toString().includes('my-project')).to.equal(true);
        getShell().rm('-rf', '/tmp/my-project');
    })

    it('should return /tmp/my-project-1, true, and "" for my-project when directory does exist and is empty', () => {
        getShell().cd('/tmp/')
        getShell().mkdir('my-project-1')
        const results = createProjectDirectory('my-project-1');
        expect(results.path).to.equal('/tmp/my-project-1')
        expect(results.empty).to.equal(true);
        expect(results.contents).to.equal("");
        expect(getShell().ls('/tmp/').toString().includes('my-project-1')).to.equal(true);
        getShell().rm('-rf', '/tmp/my-project-1');
    })

    it('should return /tmp/my-project-2, false, and "foo" for my-project when directory does exist and has file foo', () => {
        getShell().cd('/tmp/')
        getShell().mkdir('my-project-2')
        getShell().touch('my-project-2/foo')
        const results = createProjectDirectory('my-project-2');
        expect(results.path).to.equal('/tmp/my-project-2')
        expect(results.empty).to.equal(false);
        expect(results.contents).to.equal("foo");
        getShell().rm('-rf', '/tmp/my-project-2');
    })

    it('should return /tmp/my-project-3, false, and ".foo" for my-project when directory does exist and has file .foo', () => {
        getShell().cd('/tmp/')
        getShell().mkdir('my-project-3')
        getShell().touch('my-project-3/.foo')
        const results = createProjectDirectory('my-project-3');
        expect(results.path).to.equal('/tmp/my-project-3')
        expect(results.empty).to.equal(false);
        expect(results.contents).to.equal(".foo");
        getShell().rm('-rf', '/tmp/my-project-3');
    })
})