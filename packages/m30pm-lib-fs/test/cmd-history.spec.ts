import { expect } from "@oclif/test";
import { CommandHistory } from "../src/cmd-history";
import { ShellCommand, CommandToRun } from "../src/shell-cmd";
import { Helpers } from "m30pm-lib-common"
import exp from "constants";

describe("Test CommandHistory class", () => {
    it('should return an empty CommandHistory with success=true for constructor', () => {
        let cmdHistory = new CommandHistory("Test History")
        expect(cmdHistory.description).to.equal("Test History")
        expect(cmdHistory.success).to.equal(true)
        expect(Helpers.toJsonString(cmdHistory.executedCommands)).to.equal("[]")

        let expectedJsObject: any = {};
        expectedJsObject["description"] = "Test History"
        expectedJsObject["success"] = true
        expectedJsObject["executedCommands"] = []
        expect(Helpers.toJsonString(cmdHistory.toJsObject())).to.equal(Helpers.toJsonString(expectedJsObject))
    })

    it('should accept a successful command that has been executed exactly once to the CommandHistory', () => {
        let cmd = new ShellCommand("Find ls", "", CommandToRun.WHICH, "ls")
        cmd.execute()
        let cmdHistory = new CommandHistory("Test History")
        
        expect(cmdHistory.addExecutedCommand(cmd)).to.equal(true)
        expect(cmdHistory.success).to.equal(true)
        expect(Helpers.toJsonString(cmdHistory.executedCommands[0])).to.equal(Helpers.toJsonString(cmd.toJsObject()))
        expect(cmdHistory.executedCommands.length).to.equal(1)
    })

    it('should not accept a command that has not been executed to the CommandHistory', () => {
        let cmd = new ShellCommand("Find ls", "", CommandToRun.WHICH, "ls")
        let cmdHistory = new CommandHistory("Test History")
        
        expect(cmdHistory.addExecutedCommand(cmd)).to.equal(false)
        expect(cmdHistory.success).to.equal(true)
        expect(Helpers.toJsonString(cmdHistory.executedCommands)).to.equal("[]")
        })

    it('should not accept a command that has been executed more than once to the CommandHistory', () => {
        let cmd = new ShellCommand("Find ls", "", CommandToRun.WHICH, "ls")
        cmd.execute()
        cmd.execute()
        let cmdHistory = new CommandHistory("Test History")
        
        expect(cmdHistory.addExecutedCommand(cmd)).to.equal(false)
        expect(cmdHistory.success).to.equal(true)
        expect(Helpers.toJsonString(cmdHistory.executedCommands)).to.equal("[]")
    })

    it('should accept an unsuccessful command that has been executed exactly once to the CommandHistory', () => {
        let cmd = new ShellCommand("Test execute", "/tmp", CommandToRun.EXEC, "pwd -q");
        cmd.execute();
        let cmdHistory = new CommandHistory("Test History")
        
        expect(cmdHistory.addExecutedCommand(cmd)).to.equal(true)
        expect(cmdHistory.success).to.equal(false)
        expect(Helpers.toJsonString(cmdHistory.executedCommands[0])).to.equal(Helpers.toJsonString(cmd.toJsObject()))
    })

    it('should accept two successful commands that have been executed exactly once to the CommandHistory', () => {
        let cmd = new ShellCommand("Find ls", "", CommandToRun.WHICH, "ls")
        let cmd2 = new ShellCommand("Find ls 2", "", CommandToRun.WHICH, "ls")
        cmd.execute()
        cmd2.execute()
        let cmdHistory = new CommandHistory("Test History")
        
        expect(cmdHistory.addExecutedCommand(cmd)).to.equal(true)
        expect(cmdHistory.addExecutedCommand(cmd2)).to.equal(true)
        expect(cmdHistory.success).to.equal(true)
        expect(Helpers.toJsonString(cmdHistory.executedCommands[0])).to.equal(Helpers.toJsonString(cmd.toJsObject()))
        expect(Helpers.toJsonString(cmdHistory.executedCommands[1])).to.equal(Helpers.toJsonString(cmd2.toJsObject()))
        expect(cmdHistory.executedCommands.length).to.equal(2)
    })

    it('should accept a successful and an unsuccessful commands that have been executed exactly once to the CommandHistory', () => {
        let cmd = new ShellCommand("Find ls", "", CommandToRun.WHICH, "ls")
        let cmd2 = new ShellCommand("Test execute", "/tmp", CommandToRun.EXEC, "pwd -q");
        cmd.execute()
        cmd2.execute()
        let cmdHistory = new CommandHistory("Test History")
        
        expect(cmdHistory.addExecutedCommand(cmd)).to.equal(true)
        expect(cmdHistory.addExecutedCommand(cmd2)).to.equal(true)
        expect(cmdHistory.success).to.equal(false)
        expect(Helpers.toJsonString(cmdHistory.executedCommands[0])).to.equal(Helpers.toJsonString(cmd.toJsObject()))
        expect(Helpers.toJsonString(cmdHistory.executedCommands[1])).to.equal(Helpers.toJsonString(cmd2.toJsObject()))
    })

    it('should not accept a second unsuccessful command that has been executed exactly once', () => {
        let cmd = new ShellCommand("Test execute", "/tmp", CommandToRun.EXEC, "pwd -q");
        let cmd2 = new ShellCommand("Test execute 2", "/tmp", CommandToRun.EXEC, "pwd -q");
        cmd.execute()
        cmd2.execute()
        let cmdHistory = new CommandHistory("Test History")
        
        expect(cmdHistory.addExecutedCommand(cmd)).to.equal(true)
        expect(cmdHistory.addExecutedCommand(cmd2)).to.equal(false)
        expect(cmdHistory.success).to.equal(false)
        expect(Helpers.toJsonString(cmdHistory.executedCommands[0])).to.equal(Helpers.toJsonString(cmd.toJsObject()))
        expect(cmdHistory.executedCommands.length).to.equal(1)
    })
})