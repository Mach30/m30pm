import { expect } from "@oclif/test";
import { ShellCommand, CommandToRun, getShell } from "../src/shell-cmd";
import { Helpers } from "m30pm-lib-common"
import { ShellString } from "shelljs";
import exp from "constants";

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
        expect(cmd.executedExactlyOnce).to.equal(false)

        let expectedJsObject: any = {};
        expectedJsObject["description"] = "Execute ls in /tmp"
        expectedJsObject["executedStatus"] = "Command has not been executed";
        expectedJsObject["workingDirectory"] = "/tmp";
        expectedJsObject["command"] = "exec";
        expectedJsObject["commandLine"] = "ls -la";
        expectedJsObject["additionalOptions"] = "";
        expectedJsObject["successExitCode"] = 0;
        expectedJsObject["success"] = true;
        expectedJsObject["exitCode"] = 0;
        expectedJsObject["stdout"] = "";
        expectedJsObject["stderr"] = "";
        expect(Helpers.toJsonString(cmd.toJsObject())).to.equal(Helpers.toJsonString(expectedJsObject));
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
        expect(cmd.executedExactlyOnce).to.equal(false)

        let expectedJsObject: any = {};
        expectedJsObject["description"] = "Get CWD"
        expectedJsObject["executedStatus"] = "Command has not been executed";
        expectedJsObject["workingDirectory"] = "";
        expectedJsObject["command"] = "pwd";
        expectedJsObject["commandLine"] = "";
        expectedJsObject["additionalOptions"] = "";
        expectedJsObject["successExitCode"] = 1;
        expectedJsObject["success"] = true;
        expectedJsObject["exitCode"] = 0;
        expectedJsObject["stdout"] = "";
        expectedJsObject["stderr"] = "";
        expect(Helpers.toJsonString(cmd.toJsObject())).to.equal(Helpers.toJsonString(expectedJsObject));
    })
})

describe("shell command execute CAT tests", () => {
    it('should return true and have contents of specified file without additional options', () => {
        getShell().cd("/tmp");
        let rcFileContents = new ShellString("Hello, World!\n");
        rcFileContents.to("hello.txt");
        let cmd = new ShellCommand("Test cat 1", "/tmp", CommandToRun.CAT, "hello.txt");
        expect(cmd.execute()).to.equal(true);
        expect(cmd.stdout).to.equal(rcFileContents.stdout);
        getShell().rm("/tmp/hello.txt");
    })

    it('should return true and have contents of specified file with line numbers for additional options=-n', () => {
        getShell().cd("/tmp");
        let rcFileContents = new ShellString("Hello, World!\n");
        rcFileContents.to("hello.txt");
        let cmd = new ShellCommand("Test cat 2", "/tmp", CommandToRun.CAT, "hello.txt", "-n");
        expect(cmd.execute()).to.equal(true);
        expect(cmd.stdout).to.equal(`     1\t${rcFileContents.stdout}`);
        getShell().rm("/tmp/hello.txt");
    })
})

describe("shell command execute EXEC tests", () => {
    it('should return true and have valid jsObject after executing a command correctly', () => {
        let cmd = new ShellCommand("Test execute", "/tmp", CommandToRun.EXEC, "pwd");
        expect(cmd.execute()).to.equal(true);
        expect(cmd.exitCode).to.equal(0);
        expect(cmd.stdout).to.equal("/tmp\n");
        expect(cmd.executedExactlyOnce).to.equal(true);

        let expectedJsObject: any = {};
        expectedJsObject["description"] = "Test execute"
        expectedJsObject["executedStatus"] = "Command has been executed";
        expectedJsObject["workingDirectory"] = "/tmp";
        expectedJsObject["command"] = "exec";
        expectedJsObject["commandLine"] = "pwd";
        expectedJsObject["additionalOptions"] = "";
        expectedJsObject["successExitCode"] = 0;
        expectedJsObject["success"] = true;
        expectedJsObject["exitCode"] = 0;
        expectedJsObject["stdout"] = "/tmp\n";
        expectedJsObject["stderr"] = "";
        expect(Helpers.toJsonString(cmd.toJsObject())).to.equal(Helpers.toJsonString(expectedJsObject));
    })

    it('should return false after executing a command when specifying the wrong success exit code', () => {
        let cmd = new ShellCommand("Test execute", "/tmp", CommandToRun.EXEC, "pwd", "", 1);
        expect(cmd.execute()).to.equal(false);
        expect(cmd.executedExactlyOnce).to.equal(true)
    })

    it('should return false after executing a command incorrectly', () => {
        let cmd = new ShellCommand("Test execute", "/tmp", CommandToRun.EXEC, "pwd -q");
        expect(cmd.execute()).to.equal(false);
        expect(cmd.exitCode).to.equal(2);
        expect(cmd.stderr).includes("Illegal option");
        expect(cmd.executedExactlyOnce).to.equal(true);
    })

    it('should return false after executing a command in a non-existent working directory', () => {
        let cmd = new ShellCommand("Test execute", "/tm", CommandToRun.EXEC, "pwd");
        expect(cmd.execute()).to.equal(false);
        expect(cmd.exitCode).to.equal(1);
        expect(cmd.stderr).includes("cd: no such file or directory: /tm");
        expect(cmd.executedExactlyOnce).to.equal(true);
    })

    it('should return false after executing a command twice and have execution status of run more than once', () => {
        let cmd = new ShellCommand("Test execute", "/tmp", CommandToRun.EXEC, "pwd");
        expect(cmd.execute()).to.equal(true);
        expect(cmd.execute()).to.equal(false);
        expect(cmd.executedStatus).to.equal("Command has already been executed")
        expect(cmd.executedExactlyOnce).to.equal(false);
    })
})

describe("shell command execute LS tests", () => {
    it('should return true and show directory contents without additional options', () => {
        getShell().cd("/tmp")
        getShell().mkdir("ls-test-1")
        getShell().cd("ls-test-1")
        getShell().touch("file1")
        getShell().touch(".file2")
        let cmd = new ShellCommand("Test ls 1", "/tmp", CommandToRun.LS, "ls-test-1");
        expect(cmd.execute()).to.equal(true)
        expect(cmd.stdout).to.equal("file1\n")
        getShell().cd("/tmp")
        getShell().rm("-rf", "ls-test-1")
    })

    it('should return true and show directory contents with additional options=-A', () => {
        getShell().cd("/tmp")
        getShell().mkdir("ls-test-2")
        getShell().cd("ls-test-2")
        getShell().touch("file1")
        getShell().touch(".file2")
        let cmd = new ShellCommand("Test ls 2", "/tmp", CommandToRun.LS, "ls-test-2", "-A");
        expect(cmd.execute()).to.equal(true)
        expect(cmd.stdout).to.equal(".file2\nfile1\n")
        getShell().cd("/tmp")
        getShell().rm("-rf", "ls-test-2")
    })
})

describe("shell command execute MKDIR tests", () => {
    it('should return true and create directory without additional options', () => {
        getShell().cd("/tmp")
        let cmd = new ShellCommand("Test mkdir 1", "/tmp", CommandToRun.MKDIR, "mkdir-test-1")
        expect(cmd.execute()).to.equal(true)
        expect(getShell().ls().stdout).to.include("mkdir-test-1")
        getShell().rm("-rf", "mkdir-test-1")
    })

    it('should return true and create directories with additional options=-p', () => {
        getShell().cd("/tmp")
        let cmd = new ShellCommand("Test mkdir 2", "/tmp", CommandToRun.MKDIR, "mkdir-test-2/foo", "-p")
        expect(cmd.execute()).to.equal(true)
        expect(getShell().ls().stdout).to.include("mkdir-test-2")
        expect(getShell().ls("mkdir-test-2").stdout).to.equal("foo\n")
        getShell().rm("-rf", "mkdir-test-2")
    })
})

describe("shell command execute PWD tests", () => {
    it('should return true, stdout should be cwd, and stderr should be empty string and CWD to be unchanged', () => {
        getShell().cd("/tmp")
        let cmd = new ShellCommand("Test pwd", "", CommandToRun.PWD)
        expect(cmd.execute()).to.equal(true)
        expect(cmd.stdout).to.equal("/tmp")
        expect(cmd.stderr).to.equal("")
        expect(getShell().pwd().stdout).to.equal("/tmp")
    })
})

describe("shell command execute RM tests", () => {
    it('should return true and remove specified file without additonal options', () => {
        getShell().cd("/tmp")
        getShell().touch("foo")
        let cmd = new ShellCommand("Test rm 1", "/tmp", CommandToRun.RM, "foo")
        expect(cmd.execute()).to.equal(true)
        expect(getShell().ls().stdout).to.not.include("foo")
    })

    it('should return true and remove specified directory with additional options=-f', () => {
        getShell().cd("/tmp")
        getShell().mkdir("bar")
        let cmd = new ShellCommand("Test rm 2", "/tmp", CommandToRun.RM, "bar", "-rf")
        expect(cmd.execute()).to.equal(true)
        expect(getShell().ls().stdout).to.not.include("bar")
    })
})

describe("shell command execute TEMP_DIR tests", () => {
    it('should return true, stdout should be /tmp, and stderr should be empty string and CWD unchanged', () => {
        getShell().cd("/")
        let cmd = new ShellCommand("Test tempdir", "", CommandToRun.TEMP_DIR)
        expect(cmd.execute()).to.equal(true)
        expect(cmd.stdout).to.equal("/tmp")
        expect(cmd.stderr).to.equal("")
        expect(getShell().pwd().stdout).to.equal("/")
    })
})

describe("shell command execute TO_FILE tests", () => {
    it('should return true and stdout should equal the string saved to the file', () => {
        let cmd = new ShellCommand("Test to_file", "/tmp", CommandToRun.TO_FILE, "Hello, World!\n", "hello-file.txt")
        expect(cmd.execute()).to.equal(true)
        expect(cmd.stdout).to.equal("Hello, World!\n")
        getShell().rm("hello-file.txt")
    })
})

describe("shell command execute TOUCH tests", () => {
    it('should return true, file foo should exist, stdout should be empty string, and stderr should be empty string without additional options', () => {
        let cmd = new ShellCommand("Test touch 1", "/tmp", CommandToRun.TOUCH, "baz")
        expect(cmd.execute()).to.equal(true)
        expect(getShell().ls().stdout).to.include("baz")
        expect(cmd.stdout).to.equal("")
        expect(cmd.stderr).to.equal("")
        getShell().rm("/tmp/baz")
    })

    it('should return true, file foo should not exist, stdout should be empty string, and stderr should be empty string with additional options=-c', () => {
        let cmd = new ShellCommand("Test touch 2", "/tmp", CommandToRun.TOUCH, "baz", "-c")
        expect(cmd.execute()).to.equal(true)
        expect(getShell().ls().stdout).to.not.include("baz")
        expect(cmd.stdout).to.equal("")
        expect(cmd.stderr).to.equal("")
    })
})

describe("shell command execute WHICH tests", () => {
    it('should return true, stdout should be /usr/bin/ls, and stderr should be empty string for ls and CWD is unchanged', () => {
        getShell().cd("/")
        let cmd = new ShellCommand("Test which 1", "", CommandToRun.WHICH, "ls")
        expect(cmd.execute()).to.equal(true)
        expect(cmd.stdout).to.equal("/usr/bin/ls")
        expect(cmd.stderr).to.equal("")
        expect(getShell().pwd().stdout).to.equal("/")
    })

    it('should return false, stdout should be empty string, and stderr should be Command failed for foo', () => {
        let cmd = new ShellCommand("Test which 2", "", CommandToRun.WHICH, "foo")
        expect(cmd.execute()).to.equal(false)
        expect(cmd.stdout).to.equal("")
        expect(cmd.stderr).to.equal("Command failed")
    })

})

