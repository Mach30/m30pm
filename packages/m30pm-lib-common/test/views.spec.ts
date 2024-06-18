import { expect } from "@oclif/test";
import { ViewRenderer } from "../src/views";
import exp from "constants";

const template = 'Hello {{ username }}!';

class MyClassWithVariable {
    public username: string
    constructor() {
        this.username = "variable"
    }
}

class MyClassWithProperty {
    private _username: string
    constructor() {
        this._username = "property"
    }

    public toJsObject() {
        return ({username: this.username})
    }
    
    public get username() {
        return this._username;
    }
}

class MyClassWithFunction {
    constructor() {
    }

    public toJsObject() {
        return ({username: this.username()})
    }
    
    public username() {
        return "function";
    }
}

describe("ViewRenderer Tests", () => {
    it('should return hello world for example template and data', () => {
        const context = { username: 'World' }
        const result = ViewRenderer.render(template, context)
        expect(result).to.equal('Hello World!')
    })
    it('should return hello variable for example template and typescript object with public variable', () => {
        let myObject = new MyClassWithVariable();
        const result = ViewRenderer.render(template, myObject);
        expect(result).to.equal("Hello variable!");
    })
    it('should return hello variable for example template and typescript object with property', () => {
        let myObject = new MyClassWithProperty();
        const result = ViewRenderer.render(template, myObject.toJsObject());
        expect(result).to.equal("Hello property!");
    })
    it('should return hello variable for example template and typescript object with function', () => {
        let myObject = new MyClassWithFunction();
        const result = ViewRenderer.render(template, myObject.toJsObject());
        expect(result).to.equal("Hello function!");
    })
})