import { expect } from "@oclif/test";
import { CommandHistoryLogger, FunctionArgument, FunctionInfo } from "../src/cmd-history-logger";
import { CommandHistory } from "../src/cmd-history";
import { getShell, ShellCommand, CommandToRun } from "../src/shell-cmd";
import { LogLevels } from "m30pm-lib-common";
import { Helpers } from "m30pm-lib-common"
import { ProjectConfiguration, BuiltinViews, ViewRenderer } from "m30pm-lib-common";
import exp from "constants";

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

describe("Test CommandHistoryLogger query", () => {
    it('should return empty results for loggingLevel = "none"', () => {
        let funcInfo = new FunctionInfo("Foo")
        let logger = new CommandHistoryLogger(LogLevels.INFO, "/tmp/log-project-1", funcInfo)
        let cmdHistory = new CommandHistory("my command history")
        let pwdCommand = new ShellCommand("pwd", "", CommandToRun.PWD)
        pwdCommand.execute()
        cmdHistory.addExecutedCommand(pwdCommand)
        logger.addCommandHistory(cmdHistory)
        let queryInput: any = {}
        queryInput["parameters"] = {}
        queryInput.parameters["loggingLevel"] = "none"
        queryInput["data"] = cmdHistory.toJsObject()
        let query = BuiltinViews.getCommandHistoryLogQuery()
        let queryResults = ViewRenderer.render(query, queryInput)
        let expectedQueryResults = "---\n{}\n..."
        expect(queryResults).to.equal(expectedQueryResults)
    })

    it('should return empty results for loggingLevel = "none" even with an encountered error', () => {
        let funcInfo = new FunctionInfo("Foo")
        let logger = new CommandHistoryLogger(LogLevels.INFO, "/tmp/log-project-1", funcInfo)
        let cmdHistory = new CommandHistory("my command history")
        let pwdCommand = new ShellCommand("cd /root", "", CommandToRun.EXEC, "cd /root")
        pwdCommand.execute()
        cmdHistory.addExecutedCommand(pwdCommand)
        logger.addCommandHistory(cmdHistory)
        let queryInput: any = {}
        queryInput["parameters"] = {}
        queryInput.parameters["loggingLevel"] = "none"
        queryInput["data"] = cmdHistory.toJsObject()
        let query = BuiltinViews.getCommandHistoryLogQuery()
        let queryResults = ViewRenderer.render(query, queryInput)
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
        let queryInput: any = {}
        queryInput["parameters"] = {}
        queryInput.parameters["loggingLevel"] = "error"
        queryInput["data"] = cmdHistory.toJsObject()
        let query = BuiltinViews.getCommandHistoryLogQuery()
        let queryResults = ViewRenderer.render(query, queryInput)
        let expectedQueryResults = "---\n{}\n..."
        expect(queryResults).to.equal(expectedQueryResults)
    })
})