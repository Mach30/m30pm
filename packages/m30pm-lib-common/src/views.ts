import nunjucks from 'nunjucks'
import fs from 'fs'
import path from 'path'

//run nunjucks.renderString()

export class BuiltinViews {
    public static getProjectStatusView() : string {
        return BuiltinViews.readResourceSync("projectStatusView.njk");
    }

    private static readResourceSync(resourceName: string) : string {
        return fs.readFileSync(path.resolve(__dirname, "resources/", resourceName), "utf8").toString();
    }
}

export class ViewRenderer {

    public static render(template: string, context: object) : string {
        return nunjucks.renderString(template, context)
    }
}