import { expect } from "@oclif/test";
import { ShellCommand, CommandToRun } from "../src/shell-cmd";

describe("shell command constructor and to jsObject tests", () => {
    it('should return valid object for default success exit code', () => {
        let cmd = new ShellCommand("Execute ls in /tmp", "/tmp", CommandToRun.EXEC, "ls -la");
        expect(cmd.executedStatus).to.equal("Command has not been executed");
        expect(cmd.description).to.equal("Execute ls in /tmp");
        expect(cmd.workingDirectory).to.equal("/tmp");
        expect(cmd.command).to.equal("exec");
        expect(cmd.commandLine).to.equal("ls -la");
        expect(cmd.additionalOptions).to.equal("");
        expect(cmd.successExitCode).to.equal(0);
        expect(cmd.success).to.equal(true);
        expect(cmd.exitCode).to.equal(0);
        expect(cmd.stdout).to.equal("");
        expect(cmd.stderr).to.equal("");

        let expectedJsObject: any = {};
        expectedJsObject["executedStatus"] = "Command has not been executed";
        expectedJsObject["description"] = "Execute ls in /tmp"
        expectedJsObject["workingDirectory"] = "/tmp";
        expectedJsObject["command"] = "exec";
        expectedJsObject["commandLine"] = "ls -la";
        expectedJsObject["additionalOptions"] = "";
        expectedJsObject["successExitCode"] = 0;
        expectedJsObject["success"] = true;
        expectedJsObject["exitCode"] = 0;
        expectedJsObject["stdout"] = "";
        expectedJsObject["stderr"] = "";
        expect(JSON.stringify(cmd.toJsObject(), null, 2)).to.equal(JSON.stringify(expectedJsObject, null, 2));
    })

    it('should return valid object for non-default success exit code', () => {
        let cmd = new ShellCommand("Get CWD","", CommandToRun.PWD, "", "", 1);
        expect(cmd.executedStatus).to.equal("Command has not been executed");
        expect(cmd.description).to.equal("Get CWD");
        expect(cmd.workingDirectory).to.equal("");
        expect(cmd.command).to.equal("pwd");
        expect(cmd.commandLine).to.equal("");
        expect(cmd.additionalOptions).to.equal("");
        expect(cmd.successExitCode).to.equal(1);
        expect(cmd.success).to.equal(true);
        expect(cmd.exitCode).to.equal(0);
        expect(cmd.stdout).to.equal("");
        expect(cmd.stderr).to.equal("");

        let expectedJsObject: any = {};
        expectedJsObject["executedStatus"] = "Command has not been executed";
        expectedJsObject["description"] = "Get CWD"
        expectedJsObject["workingDirectory"] = "";
        expectedJsObject["command"] = "pwd";
        expectedJsObject["commandLine"] = "";
        expectedJsObject["additionalOptions"] = "";
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
        let cmd = new ShellCommand("Test execute", "/tmp", CommandToRun.EXEC, "pwd");
        expect(cmd.execute()).to.equal(true);
        expect(cmd.exitCode).to.equal(0);
        expect(cmd.stdout).to.equal("/tmp\n");

        let expectedJsObject: any = {};
        expectedJsObject["executedStatus"] = "Command has been executed";
        expectedJsObject["description"] = "Test execute"
        expectedJsObject["workingDirectory"] = "/tmp";
        expectedJsObject["command"] = "exec";
        expectedJsObject["commandLine"] = "pwd";
        expectedJsObject["additionalOptions"] = "";
        expectedJsObject["successExitCode"] = 0;
        expectedJsObject["success"] = true;
        expectedJsObject["exitCode"] = 0;
        expectedJsObject["stdout"] = "/tmp\n";
        expectedJsObject["stderr"] = "";
        expect(JSON.stringify(cmd.toJsObject(), null, 2)).to.equal(JSON.stringify(expectedJsObject, null, 2));
    })

    it('should return false after executing a command when specifying the wrong success exit code', () => {
        let cmd = new ShellCommand("Test execute", "/tmp", CommandToRun.EXEC, "pwd", "", 1);
        expect(cmd.execute()).to.equal(false);
    })

    it('should return false after executing a command incorrectly', () => {
        let cmd = new ShellCommand("Test execute", "/tmp", CommandToRun.EXEC, "pwd -q");
        expect(cmd.execute()).to.equal(false);
        expect(cmd.exitCode).to.equal(2);
        expect(cmd.stderr).includes("Illegal option");
    })
})