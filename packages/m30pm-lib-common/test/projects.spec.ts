import { expect } from "@oclif/test";
import { ProjectConfiguration } from "../src/projects";

describe("Project Configuration Tests", () => {
    it("should return true for the example project", () => {
        const project = new ProjectConfiguration("my-project", "My New m30ml Project", "CC-BY-4.0", "npm", "git", "gradle")
        expect(project.isValid()).to.equal(true)
    })
})