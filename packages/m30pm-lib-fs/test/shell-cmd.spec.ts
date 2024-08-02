import { expect } from "@oclif/test";
import { ShellCommand } from "../src/shell-cmd";

describe("shell command constructor and to jsObject tests", () => {
    it('should return valid object for default success exit code', () => {
        let cmd = new ShellCommand("/tmp", "ls -la");
        expect(cmd.workingDirectory).to.equal("/tmp");
        expect(cmd.command).to.equal("ls -la");
        expect(cmd.successExitCode).to.equal(0);
        expect(cmd.success).to.equal(true);
        expect(cmd.exitCode).to.equal(0);
        expect(cmd.stdout).to.equal("");
        expect(cmd.stderr).to.equal("");

        let expectedJsObject: any = {};
        expectedJsObject["workingDirectory"] = "/tmp";
        expectedJsObject["command"] = "ls -la";
        expectedJsObject["successExitCode"] = 0;
        expectedJsObject["success"] = true;
        expectedJsObject["exitCode"] = 0;
        expectedJsObject["stdout"] = "";
        expectedJsObject["stderr"] = "";
        expect(JSON.stringify(cmd.toJsObject(), null, 2)).to.equal(JSON.stringify(expectedJsObject, null, 2));
    })

    it('should return valid object for non-default success exit code', () => {
        let cmd = new ShellCommand("~/", "pwd", 1);
        expect(cmd.workingDirectory).to.equal("~/");
        expect(cmd.command).to.equal("pwd");
        expect(cmd.successExitCode).to.equal(1);
        expect(cmd.success).to.equal(true);
        expect(cmd.exitCode).to.equal(0);
        expect(cmd.stdout).to.equal("");
        expect(cmd.stderr).to.equal("");

        let expectedJsObject: any = {};
        expectedJsObject["workingDirectory"] = "~/";
        expectedJsObject["command"] = "pwd";
        expectedJsObject["successExitCode"] = 1;
        expectedJsObject["success"] = true;
        expectedJsObject["exitCode"] = 0;
        expectedJsObject["stdout"] = "";
        expectedJsObject["stderr"] = "";
        expect(JSON.stringify(cmd.toJsObject(), null, 2)).to.equal(JSON.stringify(expectedJsObject, null, 2));
    })
})

describe("shell command execute tests", () => {
    it('should return true and have valid jsObject after executing a command correctly', () => {
        let cmd = new ShellCommand("/tmp", "pwd");
        expect(cmd.execute()).to.equal(true);
        expect(cmd.exitCode).to.equal(0);
        expect(cmd.stdout).to.equal("/tmp\n");

        let expectedJsObject: any = {};
        expectedJsObject["workingDirectory"] = "/tmp";
        expectedJsObject["command"] = "pwd";
        expectedJsObject["successExitCode"] = 0;
        expectedJsObject["success"] = true;
        expectedJsObject["exitCode"] = 0;
        expectedJsObject["stdout"] = "/tmp\n";
        expectedJsObject["stderr"] = "";
        expect(JSON.stringify(cmd.toJsObject(), null, 2)).to.equal(JSON.stringify(expectedJsObject, null, 2));
    })

    it('should return false after executing a command when specifying the wrong success exit code', () => {
        let cmd = new ShellCommand("/tmp", "pwd", 1);
        expect(cmd.execute()).to.equal(false);
    })

    it('should return false after executing a command incorrectly', () => {
        let cmd = new ShellCommand("/tmp", "pwd -q");
        expect(cmd.execute()).to.equal(false);
        expect(cmd.exitCode).to.equal(2);
        expect(cmd.stderr).includes("Illegal option");
    })
})