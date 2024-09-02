import { expect } from "@oclif/test";
import { CommandHistoryLogger, FunctionArgument, FunctionInfo } from "../src/cmd-history-logger";
import { CommandHistory } from "../src/cmd-history";
import { getShell, ShellCommand, CommandToRun } from "../src/shell-cmd";
import { LogLevels } from "m30pm-lib-common";
import { Helpers } from "m30pm-lib-common"
import { ProjectConfiguration, BuiltinViews, ViewRenderer, QueryRunner } from "m30pm-lib-common";
import * as fs from 'fs';
import path from 'path';

describe("Test FunctionInfo class toJsObject()", () => {
    it('should return valid object for function with no arguments', () => {
        let funcInfo = new FunctionInfo("myFunction")
        let expectedJsObject: any = {}
        expectedJsObject["name"] = "myFunction"
        expectedJsObject["arguments"] = []
        expect(Helpers.toJsonString(funcInfo.toJsObject())).to.equal(Helpers.toJsonString(expectedJsObject))
    })

    it('should return valid object for function with 1 simple argument', () => {
        let funcInfo = new FunctionInfo("myFunction")
        funcInfo.addArgument(new FunctionArgument("arg1", 4))
        let expectedJsObject: any = {}
        expectedJsObject["name"] = "myFunction"
        expectedJsObject["arguments"] = []
        expectedJsObject.arguments[0] = {}
        expectedJsObject.arguments[0]["name"] = "arg1"
        expectedJsObject.arguments[0]["value"] = 4
        expect(Helpers.toJsonString(funcInfo.toJsObject())).to.equal(Helpers.toJsonString(expectedJsObject))
    })

    it('should return valid object for function with 2 simple arguments', () => {
        let funcInfo = new FunctionInfo("myFunction")
        funcInfo.addArgument(new FunctionArgument("arg1", 4))
        funcInfo.addArgument(new FunctionArgument("arg2", "foo"))
        let expectedJsObject: any = {}
        expectedJsObject["name"] = "myFunction"
        expectedJsObject["arguments"] = []
        expectedJsObject.arguments[0] = {}
        expectedJsObject.arguments[0]["name"] = "arg1"
        expectedJsObject.arguments[0]["value"] = 4
        expectedJsObject.arguments[1] = {}
        expectedJsObject.arguments[1]["name"] = "arg2"
        expectedJsObject.arguments[1]["value"] = "foo"
        expect(Helpers.toJsonString(funcInfo.toJsObject())).to.equal(Helpers.toJsonString(expectedJsObject))
    })

    it('should return valid object for function with a complex argument', () => {
        const project = new ProjectConfiguration("my-project", "0.0.0", "My New m30ml Project", "Mach 30", "CC-BY-4.0", "npm", "git", "gradle")
        let funcInfo = new FunctionInfo("myFunction")
        funcInfo.addArgument(new FunctionArgument("project", project.toJsObject()))        
        let expectedJsObject: any = {}
        expectedJsObject["name"] = "myFunction"
        expectedJsObject["arguments"] = []
        expectedJsObject.arguments[0] = {}
        expectedJsObject.arguments[0]["name"] = "project"
        expectedJsObject.arguments[0]["value"] = project.toJsObject()
        expect(Helpers.toJsonString(funcInfo.toJsObject())).to.equal(Helpers.toJsonString(expectedJsObject))
    })
})

describe("Test CommandHistoryLogger class", () => {
    it('should log command history when added', () => {
        getShell().cd("/tmp")
        getShell().mkdir("log-project-1")
        getShell().cd("log-project-1")
        let funcInfo = new FunctionInfo("Foo")
        let logger = new CommandHistoryLogger(LogLevels.INFO, "/tmp/log-project-1", funcInfo)
        let cmdHistory = new CommandHistory("my command history")
        let pwdCommand = new ShellCommand("pwd", "", CommandToRun.PWD)
        pwdCommand.execute()
        cmdHistory.addExecutedCommand(pwdCommand)
        logger.addCommandHistory(cmdHistory)
        let expectedJsObject: any = {}
        expectedJsObject["encounteredError"] = false
        expectedJsObject["functionInfo"] = funcInfo.toJsObject()
        expectedJsObject["commandHistoryList"] = []
        expectedJsObject["commandHistoryList"][0] = cmdHistory.toJsObject()
        expect(Helpers.toJsonString(logger.toJsObject())).to.equal(Helpers.toJsonString(expectedJsObject))
        getShell().rm("-rf", "/tmp/log-project-1")
    })

    it('should create .logs/ dir as part of writeLog when not loggingLevel = "error"', () => {
        getShell().cd("/tmp")
        getShell().mkdir("log-project-2")
        let logger = new CommandHistoryLogger(LogLevels.INFO, "/tmp/log-project-2", new FunctionInfo("Foo"))
        logger.writeLog()
        expect(getShell().ls('-al', '/tmp/log-project-2').stdout).include(".logs")
        getShell().rm('-rf', "/tmp/log-project-2")
    })

    it('should not create .logs/ dir as part of writeLog when loggingLevel = "error"', () => {
        getShell().cd("/tmp")
        getShell().mkdir("log-project-3")
        let logger = new CommandHistoryLogger(LogLevels.ERROR, "/tmp/log-project-3", new FunctionInfo("Foo"))
        logger.writeLog()
        expect(getShell().ls('-al', '/tmp/log-project-3').stdout).not.include(".logs")
        getShell().rm('-rf', "/tmp/log-project-3")
    })
})

describe("Test CommandHistoryLogger query", () => {
    it('should return empty results for loggingLevel = "none"', () => {
        let funcInfo = new FunctionInfo("Foo")
        let logger = new CommandHistoryLogger(LogLevels.INFO, "/tmp/log-project-1", funcInfo)
        let cmdHistory = new CommandHistory("my command history")
        let pwdCommand = new ShellCommand("pwd", "", CommandToRun.PWD)
        pwdCommand.execute()
        cmdHistory.addExecutedCommand(pwdCommand)
        logger.addCommandHistory(cmdHistory)

        let query = new QueryRunner(BuiltinViews.getCommandHistoryLogQuery(), logger.toJsObject())
        query.addParameter("loggingLevel", "none")
        let queryResults = query.runQuery()

        let expectedQueryResults = "---\n{}\n...\n"
        expect(queryResults).to.equal(expectedQueryResults)
    })

    it('should return empty results for loggingLevel = "none" even with an encountered error', () => {
        let funcInfo = new FunctionInfo("Foo")
        let logger = new CommandHistoryLogger(LogLevels.INFO, "/tmp/log-project-1", funcInfo)
        let cmdHistory = new CommandHistory("my command history")
        let execCommand = new ShellCommand("cd /root", "", CommandToRun.EXEC, "cd /root")
        execCommand.execute()
        cmdHistory.addExecutedCommand(execCommand)
        logger.addCommandHistory(cmdHistory)

        let query = new QueryRunner(BuiltinViews.getCommandHistoryLogQuery(), logger.toJsObject())
        query.addParameter("loggingLevel", "none")
        let queryResults = query.runQuery()

        let expectedQueryResults = "---\n{}\n...\n"
        expect(queryResults).to.equal(expectedQueryResults)
    })

    it('should return empty results for loggingLevel = "error" and encounteredError = false', () => {
        let funcInfo = new FunctionInfo("Foo")
        let logger = new CommandHistoryLogger(LogLevels.INFO, "/tmp/log-project-1", funcInfo)
        let cmdHistory = new CommandHistory("my command history")
        let pwdCommand = new ShellCommand("pwd", "", CommandToRun.PWD)
        pwdCommand.execute()
        cmdHistory.addExecutedCommand(pwdCommand)
        logger.addCommandHistory(cmdHistory)

        let query = new QueryRunner(BuiltinViews.getCommandHistoryLogQuery(), logger.toJsObject())
        query.addParameter("loggingLevel", "error")
        let queryResults = query.runQuery()

        let expectedQueryResults = "---\n{}\n...\n"
        expect(queryResults).to.equal(expectedQueryResults)
    })

    it('should return just the error and its context for loggingLevel = "error" and encounteredError = true', () => {
        // context is: all function info, failed command history description, full details of failed command
        // two command histories, the first with 1 successful command, 
        // the second with 1 successful and 1 failed command
        let funcInfo = new FunctionInfo("Foo")
        funcInfo.addArgument(new FunctionArgument("a", 1))
        funcInfo.addArgument(new FunctionArgument("b", "bar"))
        let logger = new CommandHistoryLogger(LogLevels.INFO, "/tmp/log-project-1", funcInfo)
        
        let cmdHistory1 = new CommandHistory("Successful Command")
        getShell().cd("/tmp")
        let pwdCommand = new ShellCommand("pwd", "", CommandToRun.PWD)
        pwdCommand.execute()
        cmdHistory1.addExecutedCommand(pwdCommand)
        logger.addCommandHistory(cmdHistory1)

        let cmdHistory2 = new CommandHistory("Successful Command and Failed Command")
        let pwdCommand2 = new ShellCommand("pwd", "", CommandToRun.PWD)
        pwdCommand2.execute()
        cmdHistory2.addExecutedCommand(pwdCommand2)
        let execCommand = new ShellCommand("cd /root", "", CommandToRun.EXEC, "cd /root")
        execCommand.execute()
        cmdHistory2.addExecutedCommand(execCommand)
        logger.addCommandHistory(cmdHistory2)

        let query = new QueryRunner(BuiltinViews.getCommandHistoryLogQuery(), logger.toJsObject())
        query.addParameter("loggingLevel", "error")
        let queryResults = query.runQuery()

        let expectedQueryResults = "---\n"
        expectedQueryResults += "encounteredError: true\n"
        expectedQueryResults += "functionInfo:\n"
        expectedQueryResults += "  name: Foo\n"
        expectedQueryResults += "  arguments:\n"
        expectedQueryResults += "    - name: a\n"
        expectedQueryResults += "      value: 1\n"
        expectedQueryResults += "    - name: b\n"
        expectedQueryResults += "      value: bar\n"
        expectedQueryResults += "commandHistoryList:\n"
        expectedQueryResults += "  - description: Successful Command and Failed Command\n"
        expectedQueryResults += "    success: false\n"
        expectedQueryResults += "    executedCommands:\n"
        expectedQueryResults += "      - description: cd /root\n"
        expectedQueryResults += "        executedStatus: Command has been executed\n"
        expectedQueryResults += "        workingDirectory: ''\n"
        expectedQueryResults += "        command: exec\n"
        expectedQueryResults += "        commandLine: cd /root\n"
        expectedQueryResults += "        additionalOptions: ''\n"
        expectedQueryResults += "        successExitCode: 0\n"
        expectedQueryResults += "        success: false\n"
        expectedQueryResults += "        exitCode: 2\n"
        expectedQueryResults += "        stdout: ''\n"
        expectedQueryResults += "        stderr: |\n"
        expectedQueryResults += "          /bin/sh: 1: cd: can't cd to /root\n"
        expectedQueryResults += "...\n"

        expect(queryResults).to.equal(expectedQueryResults)
    })

    it('should return just summaries of command histories and commands for logging level = "info" and encounteredError = false', () => {
        // return only name of function and descriptions of command histories and commands
        // two command histories, the first with 1 successful command, 
        // the second with 2 successful commands
        let funcInfo = new FunctionInfo("Foo")
        funcInfo.addArgument(new FunctionArgument("a", 1))
        funcInfo.addArgument(new FunctionArgument("b", "bar"))
        let logger = new CommandHistoryLogger(LogLevels.INFO, "/tmp/log-project-1", funcInfo)
        
        let cmdHistory1 = new CommandHistory("Successful Command")
        getShell().cd("/tmp")
        let pwdCommand = new ShellCommand("pwd", "", CommandToRun.PWD)
        pwdCommand.execute()
        cmdHistory1.addExecutedCommand(pwdCommand)
        logger.addCommandHistory(cmdHistory1)

        let cmdHistory2 = new CommandHistory("Two Successful Commands")
        let pwdCommand2 = new ShellCommand("pwd", "", CommandToRun.PWD)
        pwdCommand2.execute()
        cmdHistory2.addExecutedCommand(pwdCommand2)
        let pwdCommand3 = new ShellCommand("pwd", "", CommandToRun.PWD)
        pwdCommand3.execute()
        cmdHistory2.addExecutedCommand(pwdCommand3)
        logger.addCommandHistory(cmdHistory2)

        let query = new QueryRunner(BuiltinViews.getCommandHistoryLogQuery(), logger.toJsObject())
        query.addParameter("loggingLevel", "info")
        let queryResults = query.runQuery()

        let expectedQueryResults = "---\n"
        expectedQueryResults += "encounteredError: false\n"
        expectedQueryResults += "functionInfo:\n"
        expectedQueryResults += "  name: Foo\n"
        expectedQueryResults += "commandHistoryList:\n"
        expectedQueryResults += "  - description: Successful Command\n"
        expectedQueryResults += "    success: true\n"
        expectedQueryResults += "    executedCommands:\n"
        expectedQueryResults += "      - description: pwd\n"
        expectedQueryResults += "  - description: Two Successful Commands\n"
        expectedQueryResults += "    success: true\n"
        expectedQueryResults += "    executedCommands:\n"
        expectedQueryResults += "      - description: pwd\n"
        expectedQueryResults += "      - description: pwd\n"
        expectedQueryResults += "...\n"

        expect(queryResults).to.equal(expectedQueryResults)
    })

    it('should return summaries of command histories and commands and context of error for loggingLevel = "info" and encounteredError = true', () => {
        // return all function info, descriptions of command histories and successful commands
        // return full details for failed command
        // two command histories, the first with 1 successful command, 
        // the second with 1 successful and 1 failed command
        let funcInfo = new FunctionInfo("Foo")
        funcInfo.addArgument(new FunctionArgument("a", 1))
        funcInfo.addArgument(new FunctionArgument("b", "bar"))
        let logger = new CommandHistoryLogger(LogLevels.INFO, "/tmp/log-project-1", funcInfo)
        
        let cmdHistory1 = new CommandHistory("Successful Command")
        getShell().cd("/tmp")
        let pwdCommand = new ShellCommand("pwd", "", CommandToRun.PWD)
        pwdCommand.execute()
        cmdHistory1.addExecutedCommand(pwdCommand)
        logger.addCommandHistory(cmdHistory1)

        let cmdHistory2 = new CommandHistory("Successful Command and Failed Command")
        let pwdCommand2 = new ShellCommand("pwd", "", CommandToRun.PWD)
        pwdCommand2.execute()
        cmdHistory2.addExecutedCommand(pwdCommand2)
        let execCommand = new ShellCommand("cd /root", "", CommandToRun.EXEC, "cd /root")
        execCommand.execute()
        cmdHistory2.addExecutedCommand(execCommand)
        logger.addCommandHistory(cmdHistory2)

        let query = new QueryRunner(BuiltinViews.getCommandHistoryLogQuery(), logger.toJsObject())
        query.addParameter("loggingLevel", "info")
        let queryResults = query.runQuery()

        let expectedQueryResults = "---\n"
        expectedQueryResults += "encounteredError: true\n"
        expectedQueryResults += "functionInfo:\n"
        expectedQueryResults += "  name: Foo\n"
        expectedQueryResults += "  arguments:\n"
        expectedQueryResults += "    - name: a\n"
        expectedQueryResults += "      value: 1\n"
        expectedQueryResults += "    - name: b\n"
        expectedQueryResults += "      value: bar\n"
        expectedQueryResults += "commandHistoryList:\n"
        expectedQueryResults += "  - description: Successful Command\n"
        expectedQueryResults += "    success: true\n"
        expectedQueryResults += "    executedCommands:\n"
        expectedQueryResults += "      - description: pwd\n"
        expectedQueryResults += "  - description: Successful Command and Failed Command\n"
        expectedQueryResults += "    success: false\n"
        expectedQueryResults += "    executedCommands:\n"
        expectedQueryResults += "      - description: pwd\n"
        expectedQueryResults += "      - description: cd /root\n"
        expectedQueryResults += "        executedStatus: Command has been executed\n"
        expectedQueryResults += "        workingDirectory: ''\n"
        expectedQueryResults += "        command: exec\n"
        expectedQueryResults += "        commandLine: cd /root\n"
        expectedQueryResults += "        additionalOptions: ''\n"
        expectedQueryResults += "        successExitCode: 0\n"
        expectedQueryResults += "        success: false\n"
        expectedQueryResults += "        exitCode: 2\n"
        expectedQueryResults += "        stdout: ''\n"
        expectedQueryResults += "        stderr: |\n"
        expectedQueryResults += "          /bin/sh: 1: cd: can't cd to /root\n"
        expectedQueryResults += "...\n"

        expect(queryResults).to.equal(expectedQueryResults)
    })

    it('should return all details for loggingLevel = "debug" and encounteredError = false', () => {
        // two command histories, the first with 1 successful command, 
        // the second with 2 successful commands
        let funcInfo = new FunctionInfo("Foo")
        funcInfo.addArgument(new FunctionArgument("a", 1))
        funcInfo.addArgument(new FunctionArgument("b", "bar"))
        let logger = new CommandHistoryLogger(LogLevels.INFO, "/tmp/log-project-1", funcInfo)
        
        let cmdHistory1 = new CommandHistory("Successful Command")
        getShell().cd("/tmp")
        let pwdCommand = new ShellCommand("pwd", "", CommandToRun.PWD)
        pwdCommand.execute()
        cmdHistory1.addExecutedCommand(pwdCommand)
        logger.addCommandHistory(cmdHistory1)

        let cmdHistory2 = new CommandHistory("Two Successful Commands")
        let pwdCommand2 = new ShellCommand("pwd", "", CommandToRun.PWD)
        pwdCommand2.execute()
        cmdHistory2.addExecutedCommand(pwdCommand2)
        let pwdCommand3 = new ShellCommand("pwd", "", CommandToRun.PWD)
        pwdCommand3.execute()
        cmdHistory2.addExecutedCommand(pwdCommand3)
        logger.addCommandHistory(cmdHistory2)

        let query = new QueryRunner(BuiltinViews.getCommandHistoryLogQuery(), logger.toJsObject())
        query.addParameter("loggingLevel", "debug")
        let queryResults = query.runQuery()

        const expectedQueryResults = fs.readFileSync(path.join(__dirname, 'debug-log-no-error.yaml') , 'utf8');
        expect(queryResults).to.equal(expectedQueryResults)
    })

    it('should return all details for loggingLevel = "debug" and encounteredError = true', () => {
        // two command histories, the first with 1 successful command, 
        // the second with 1 successful and 1 failed command
        let funcInfo = new FunctionInfo("Foo")
        funcInfo.addArgument(new FunctionArgument("a", 1))
        funcInfo.addArgument(new FunctionArgument("b", "bar"))
        let logger = new CommandHistoryLogger(LogLevels.INFO, "/tmp/log-project-1", funcInfo)
        
        let cmdHistory1 = new CommandHistory("Successful Command")
        getShell().cd("/tmp")
        let pwdCommand = new ShellCommand("pwd", "", CommandToRun.PWD)
        pwdCommand.execute()
        cmdHistory1.addExecutedCommand(pwdCommand)
        logger.addCommandHistory(cmdHistory1)

        let cmdHistory2 = new CommandHistory("Successful Command and Failed Command")
        let pwdCommand2 = new ShellCommand("pwd", "", CommandToRun.PWD)
        pwdCommand2.execute()
        cmdHistory2.addExecutedCommand(pwdCommand2)
        let execCommand = new ShellCommand("cd /root", "", CommandToRun.EXEC, "cd /root")
        execCommand.execute()
        cmdHistory2.addExecutedCommand(execCommand)
        logger.addCommandHistory(cmdHistory2)

        let query = new QueryRunner(BuiltinViews.getCommandHistoryLogQuery(), logger.toJsObject())
        query.addParameter("loggingLevel", "debug")
        let queryResults = query.runQuery()
        
        const expectedQueryResults = fs.readFileSync(path.join(__dirname, 'debug-log-error.yaml') , 'utf8');
        expect(queryResults).to.equal(expectedQueryResults)
    })

    it('should return properly formatted function argument value when it is an object', () => {
        let funcInfo = new FunctionInfo("Foo")
        funcInfo.addArgument(new FunctionArgument("a", {"foo":"bar","x":"z"}))
        let logger = new CommandHistoryLogger(LogLevels.INFO, "/tmp/log-project-1", funcInfo)

        let query = new QueryRunner(BuiltinViews.getCommandHistoryLogQuery(), logger.toJsObject())
        query.addParameter("loggingLevel", "debug")
        let queryResults = query.runQuery()

        let expectedQueryResults = "---\n"
        expectedQueryResults += "encounteredError: false\n"
        expectedQueryResults += "functionInfo:\n"
        expectedQueryResults += "  name: Foo\n"
        expectedQueryResults += "  arguments:\n"
        expectedQueryResults += "    - name: a\n"
        expectedQueryResults += "      value:\n"
        expectedQueryResults += "        foo: bar\n"
        expectedQueryResults += "        x: z\n"
        expectedQueryResults += "commandHistoryList: []\n"
        expectedQueryResults += "...\n"

        expect(queryResults).to.equal(expectedQueryResults)
    })

    it('should return properly formatted function argument value when it is a list', () => {
        let funcInfo = new FunctionInfo("Foo")
        funcInfo.addArgument(new FunctionArgument("a", [1,2,3]))
        let logger = new CommandHistoryLogger(LogLevels.INFO, "/tmp/log-project-1", funcInfo)

        let query = new QueryRunner(BuiltinViews.getCommandHistoryLogQuery(), logger.toJsObject())
        query.addParameter("loggingLevel", "debug")
        let queryResults = query.runQuery()

        let expectedQueryResults = "---\n"
        expectedQueryResults += "encounteredError: false\n"
        expectedQueryResults += "functionInfo:\n"
        expectedQueryResults += "  name: Foo\n"
        expectedQueryResults += "  arguments:\n"
        expectedQueryResults += "    - name: a\n"
        expectedQueryResults += "      value:\n"
        expectedQueryResults += "        - 1\n"
        expectedQueryResults += "        - 2\n"
        expectedQueryResults += "        - 3\n"
        expectedQueryResults += "commandHistoryList: []\n"
        expectedQueryResults += "...\n"

        expect(queryResults).to.equal(expectedQueryResults)
    })
})