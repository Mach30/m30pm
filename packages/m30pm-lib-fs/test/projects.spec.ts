import { expect } from "@oclif/test";
import { testTool } from "../src/projects"

describe("m30pm-lib-fs testTool() tests", () => {
    it('should return true, /usr/bin/ls, and 8.30 for ls', () => {
        const results = testTool("ls")
        expect(results.toolFound).to.equal(true)
        expect(results.toolPath).to.equal("/usr/bin/ls")
        expect(results.toolVersion).to.equal("8.30")
    })
})