import nunjucks from 'nunjucks'
import fs from 'fs'
import path from 'path'

//run nunjucks.renderString()

export class BuiltinViews {
    public static getHello() : string {
        const hello = fs.readFileSync(path.resolve(__dirname, "resources/hello.njk"), "utf8").toString();
        return hello
    }
}

export class ViewRenderer {

    public static render(template: string, context: object) : string {
        return nunjucks.renderString(template, context)
    }
}