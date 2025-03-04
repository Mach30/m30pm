import { marked } from 'marked';
import chalk from 'chalk';
import { CardinalOptions } from 'cardinal';
import colors from 'ansicolors';
import TerminalRenderer from 'marked-terminal';
import { FormattedMessageType, NotifyUserFunction } from '@mach30/m30pm-lib-common'

const defaultMarkedTerminalOptions = {
    blockquote: chalk.visible,
    html: chalk.visible,
    heading: chalk.whiteBright.bold,
    firstHeading: chalk.whiteBright.underline.bold,
    codespan: chalk.bgHex('#3B3B3B').italic,
    del: chalk.gray.strikethrough,
    link: chalk.blueBright,
    href: chalk.blueBright.underline,
    unescape: true,
    emoji: false,
    width: 120,
    showSectionPrefix: false,
    reflowText: true,
    tab: 4,
    tableOptions: {
        style: {
            head: ['bold']
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
        marked.setOptions({renderer: new TerminalRenderer(defaultMarkedTerminalOptions, codeHighlightTheme)})
        console.log(marked.parse(mdString))
    }

    public static logWarn(mdString: string) {
        let warnOptions: any = defaultMarkedTerminalOptions
        warnOptions["firstHeading"] = chalk.yellowBright.underline.bold
        warnOptions["em"] = chalk.yellowBright.italic
        marked.setOptions({renderer: new TerminalRenderer(warnOptions, codeHighlightTheme)})
        console.log(marked.parse(mdString))
    }

    public static logError(mdString: string) {
        let errorOptions: any = defaultMarkedTerminalOptions
        errorOptions["firstHeading"] = chalk.redBright.underline.bold
        errorOptions["em"] = chalk.yellowBright.italic
        errorOptions["strong"] = chalk.redBright.bold
        marked.setOptions({renderer: new TerminalRenderer(errorOptions, codeHighlightTheme)})
        console.log(marked.parse(mdString))
    }

    public static notifyUserOnConsole: NotifyUserFunction = function(mdFormattedMessage: string, messageType: FormattedMessageType) {
        switch(messageType) {
            case FormattedMessageType.NORMAL: {
                mdStdout.log(mdFormattedMessage)
                break
            }
            case FormattedMessageType.WARNING: {
                mdStdout.logWarn(mdFormattedMessage)
                break
            }
            case FormattedMessageType.ERROR: {
                mdStdout.logError(mdFormattedMessage)
                break
            }
        }
    }
}