import { expect } from "@oclif/test";
import { ViewRenderer } from "../src/views";
import exp from "constants";

describe("ViewRenderer Tests", () => {
    it('should return hello world for example template and data', () => {
        const template = 'Hello {{ username }}!'
        const context = { username: 'World' }
        const result = ViewRenderer.render(template, context)
        expect(result).to.equal('Hello World!')
    })
    it('should return hello world for example template and typescript object', () => {
        //TODO
    })
})