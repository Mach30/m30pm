import nunjucks from 'nunjucks'

//run nunjucks.renderString()

export class ViewRenderer {

    public static render(template: string, context: object) : string {
        return nunjucks.renderString(template, context)
    }
}