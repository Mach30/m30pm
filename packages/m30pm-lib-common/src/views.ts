import nunjucks from 'nunjucks'
import fs from 'fs'
import path from 'path'

//run nunjucks.renderString()

export class BuiltinViews {
    public static getCommandHistoryLogQuery(): string {
        return BuiltinViews.readResourceSync("cmd-history-log.query.njk");
    }

    public static getProjectStatusView() : string {
        return BuiltinViews.readResourceSync("projectStatusView.njk");
    }

    public static getNpmRcFileView() : string {
        return BuiltinViews.readResourceSync("npmRcFileView.njk");
    }

    public static getYarnRcYamlFileView() : string {
        return BuiltinViews.readResourceSync("yarnRcYamlFileView.njk");
    }

    public static getReadmeQuery() : string {
        return BuiltinViews.readResourceSync("README.query.njk")
    }

    public static getReadmeView() : string {
        return BuiltinViews.readResourceSync("README.md.njk")
    }

    public static getBuildQuery() : string {
        return BuiltinViews.readResourceSync("build.query.njk")
    }

    public static getBuildView() : string {
        return BuiltinViews.readResourceSync("build.gradle.njk")
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