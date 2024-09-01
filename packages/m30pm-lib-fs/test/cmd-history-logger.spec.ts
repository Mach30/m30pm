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

    it('should create .logs/ dir as part of writeLog', () => {
        getShell().cd("/tmp")
        getShell().mkdir("log-project-2")
        let logger = new CommandHistoryLogger(LogLevels.INFO, "/tmp/log-project-2", new FunctionInfo("Foo"))
        logger.writeLog()
        expect(getShell().ls('-al', '/tmp/log-project-2').stdout).include(".logs")
        getShell().rm('-rf', "/tmp/log-project-2")
    })
})

describe.only("Test CommandHistoryLogger query", () => {
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

        let expectedQueryResults = "---\n{}\n..."
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

        let expectedQueryResults = "---\n{}\n..."
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

        let expectedQueryResults = "---\n{}\n..."
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
        expectedQueryResults += "..."

        expect(queryResults).to.equal(expectedQueryResults)
    })

    it('should return just summaries of command histories and commands for logging level = "info" and encounteredError = false', () => {
        // return only name of function and descriptions of command histories and commands
        // two command histories, the first with 1 successful command, 
        // the second with 2 successful commands
    })

    it('should return summaries of command histories and commands and context of error for loggingLevel = "info" and encounteredError = true', () => {
        // return all function info, descriptions of command histories and successful commands
        // return full details for failed command
        // two command histories, the first with 1 successful command, 
        // the second with 1 successful and 1 failed command
    })

    it('should return all details for loggingLevel = "debug" and encounteredError = false', () => {
        // two command histories, the first with 1 successful command, 
        // the second with 2 successful commands
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
        // 
    })

    it('should return properly formatted function argument value when it is a list', () => {
        // 
    })
})