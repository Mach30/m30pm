import { marked } from 'marked';
import { markedTerminal } from 'marked-terminal';
import chalk from 'chalk';
import { CardinalOptions } from 'cardinal';
import { colors } from 'ansicolors';

const defaultMarkedTerminalOptions = {
    blockquote: chalk.visible,
    html: chalk.visible,
    heading: chalk.whiteBright.bold,
    firstHeading: chalk.whiteBright.underline.bold,
    codespan: chalk.bgGray,
    del: chalk.gray.strikethrough,
    link: chalk.blueBright,
    href: chalk.blueBright.underline,
    unescape: true,
    emoji: false,
    width: 80,
    showSectionPrefix: false,
    reflowText: true,
    tab: 4,
    tableOptions: {
        style: {
            head: ['bold', 'bgGrey']
        }
    }
};

const codeHighlightTheme: CardinalOptions = {
    theme: {
        keyword: colors.brightBlue,
        string: colors.brightRed,
        literal: colors.brightBlue,
        default: colors.grey
    }
}; 

export class mdStdout {

    public static log(mdString: string) {
        marked.use({renderer: markedTerminal(defaultMarkedTerminalOptions, codeHighlightTheme)})
        console.log(marked.parse(mdString))
    }

    public static logWarn(mdString: string) {
        //
    }

    public static logError(mdString: string) {
        //
    }

}