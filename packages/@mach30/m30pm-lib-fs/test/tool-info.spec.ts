import { expect } from "@oclif/test";
import { ToolInfo } from '../src/tool-info'
import { CommandHistory } from '../src/cmd-history'
import { ShellCommand, CommandToRun } from "../src/shell-cmd";
import { Helpers } from "m30pm-lib-common";

describe("m30pm-lib-fs TestTool tests", () => {
    it('should return false, "", and "" for foo', () => {
        const fooInfo = new ToolInfo("foo")
        expect(fooInfo.installed).to.equal(false)
        expect(fooInfo.path).to.equal("")
        expect(fooInfo.version).to.equal("")
        expect(fooInfo.verifiedVersion).to.equal(false)

        let expectedCmdHistory = new CommandHistory(`Verify Tool Info for "foo"`);
        let whichCmd = new ShellCommand("Find Tool", "", CommandToRun.WHICH, "foo");
        whichCmd.execute();
        expectedCmdHistory.addExecutedCommand(whichCmd);

        let expectedJsObject : any = {}
        expectedJsObject["name"] = "foo";
        expectedJsObject["installed"] = false;
        expectedJsObject["path"] = "";
        expectedJsObject["minVersion"] = "0.0.0";
        expectedJsObject["version"] = "";
        expectedJsObject["verifiedVersion"] = false;
        expectedJsObject["cmdHistory"] = expectedCmdHistory.toJsObject();
        expect(Helpers.toJsonString(fooInfo.toJsObject())).to.equal(Helpers.toJsonString(expectedJsObject))
    })

    it('should return true, /usr/bin/ls, and 8.30.0 for ls', () => {
        const lsInfo = new ToolInfo("ls");
        expect(lsInfo.installed).to.equal(true)
        expect(lsInfo.path).to.equal("/usr/bin/ls")
        expect(lsInfo.version).to.equal("8.30.0")
        expect(lsInfo.verifiedVersion).to.equal(true)
    })

    it('should return true, /usr/bin/git, and 2.46.0 for git', () => {
        const gitInfo = new ToolInfo('git')
        expect(gitInfo.installed).to.equal(true)
        expect(gitInfo.path).to.equal("/usr/bin/git")
        expect(gitInfo.version).to.equal("2.46.0")
        expect(gitInfo.verifiedVersion).to.equal(true)
    })

    it('should return true, /usr/local/bin/gradle, and 8.7.0 for gradle', () => {
        const gradleInfo = new ToolInfo("gradle", "8.2.0")
        expect(gradleInfo.installed).to.equal(true)
        expect(gradleInfo.path).to.equal("/usr/local/bin/gradle")
        expect(gradleInfo.version).to.equal("8.7.0")
        expect(gradleInfo.verifiedVersion).to.equal(true)
    })

    it('should return true, /var/lib/nvm/versions/node/v20.15.1/bin/npm, and 10.7.0 for npm', () => {
        const npmInfo = new ToolInfo("npm")
        expect(npmInfo.installed).to.equal(true)
        expect(npmInfo.path).to.equal("/var/lib/nvm/versions/node/v20.15.1/bin/npm")
        expect(npmInfo.version).to.equal("10.7.0")
        expect(npmInfo.verifiedVersion).to.equal(true)
    })

    it('should return false for 8.30.0 >= 10.0.0', () => {
        const lsInfo = new ToolInfo("ls", "10.0.0");
        expect(lsInfo.installed).to.equal(true)
        expect(lsInfo.path).to.equal("/usr/bin/ls")
        expect(lsInfo.version).to.equal("8.30.0")
        expect(lsInfo.verifiedVersion).to.equal(false)
    })

    it('should return true for 8.30.0 >= 8.30.0', () => {
        const lsInfo = new ToolInfo("ls", "8.30.0");
        expect(lsInfo.installed).to.equal(true)
        expect(lsInfo.path).to.equal("/usr/bin/ls")
        expect(lsInfo.version).to.equal("8.30.0")
        expect(lsInfo.verifiedVersion).to.equal(true)
    })
})