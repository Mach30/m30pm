import { expect } from "@oclif/test";
import { testTool } from "../src/projects"

describe("m30pm-lib-fs testTool() tests", () => {
    it('should return false, "", and "" for foo', () => {
        const results = testTool("foo")
        expect(results.toolFound).to.equal(false)
        expect(results.toolPath).to.equal("")
        expect(results.toolVersion).to.equal("")
    })

    it('should return true, /usr/bin/ls, and 8.30 for ls', () => {
        const results = testTool("ls")
        expect(results.toolFound).to.equal(true)
        expect(results.toolPath).to.equal("/usr/bin/ls")
        expect(results.toolVersion).to.equal("8.30")
    })

    it('should return true, /usr/bin/git, and 2.45.2 for git', () => {
        const results = testTool("git")
        expect(results.toolFound).to.equal(true)
        expect(results.toolPath).to.equal("/usr/bin/git")
        expect(results.toolVersion).to.equal("2.45.2")
    })

    it('should return true, /usr/local/bin/gradle, and 8.7 for gradle', () => {
        const results = testTool("gradle")
        expect(results.toolFound).to.equal(true)
        expect(results.toolPath).to.equal("/usr/local/bin/gradle")
        expect(results.toolVersion).to.equal("8.7")
    })

    it('should return true, /var/lib/nvm/versions/node/v20.11.1/bin/npm, and 10.2.4 for npm', () => {
        const results = testTool("npm")
        expect(results.toolFound).to.equal(true)
        expect(results.toolPath).to.equal("/var/lib/nvm/versions/node/v20.11.1/bin/npm")
        expect(results.toolVersion).to.equal("10.2.4")
    })
})