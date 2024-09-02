import { ProjectConfiguration, PackageManagers, ViewRenderer, BuiltinViews, BuildTools, VersionControlTools, Helpers, LogLevels } from "m30pm-lib-common";
import { ToolInfo } from "./tool-info";
import { ShellCommand, CommandToRun, getShell } from "./shell-cmd";
import { CommandHistory } from "./cmd-history";
import { CommandHistoryLogger, FunctionArgument, FunctionInfo } from "./cmd-history-logger";
import { FormattedMessageType, NotifyUserFunction } from "m30pm-lib-common";
import * as yaml from 'js-yaml';

const minGradleVersion = "8.2.0"
const minGitVersion = "2.28.0"
const gitIgnoreContents = "# m30pm .gitignore\ndist/\nnode_modules/\n.logs/\n"

// create project directory using project name (should follow oclif pattern; if no directory exists, create directory; if directory exists and empty, continue project creation; 
// if directory exists and is not empty, return with error stating non-empty directory)
export function initializeProjectDirectory(project: ProjectConfiguration, workingDirectory : string, projectDirectory: string) : CommandHistory {
    const projectName = project.name;
    let cmdHistory = new CommandHistory(`Initialze Project Directory for ${projectName}`)
    
    let lsCmd = new ShellCommand(`Determine if Project Directory ${projectDirectory} Exists`, workingDirectory, CommandToRun.LS, projectName, "-d")
    lsCmd.execute();
    let projectDirectoryFound = lsCmd.success;
    let projectDirectoryCanBeUsed = true;

    if (projectDirectoryFound) {
        cmdHistory.addExecutedCommand(lsCmd);
        let lsCmd2 = new ShellCommand("Determine if Project Name Points to File or Non-Empty Direcory", 
                                      workingDirectory, CommandToRun.LS, projectName, "-A");
        lsCmd2.execute();
        cmdHistory.addExecutedCommand(lsCmd2)
        projectDirectoryCanBeUsed = lsCmd2.success && lsCmd2.stdout === ""
    }

    if (!projectDirectoryFound || !projectDirectoryCanBeUsed) {
        const projectNameParts = projectName.split('/');
        if (projectNameParts.length === 1) {
            let mkdirCmd = new ShellCommand(`Create Project Directory ${projectDirectory}`, 
                                        workingDirectory, CommandToRun.MKDIR, projectName);
            mkdirCmd.execute();
            cmdHistory.addExecutedCommand(mkdirCmd)
        } 
        else {
            let mkdirCmd1 = new ShellCommand(`Create Project Directory ${projectDirectory}, step 1`, 
                                             workingDirectory, CommandToRun.MKDIR, projectNameParts[0], "-p");
            mkdirCmd1.execute();
            cmdHistory.addExecutedCommand(mkdirCmd1)

            let mkdirCmd2 = new ShellCommand(`Create Project Directory ${projectDirectory}, step 2`, 
                                              `${workingDirectory}/${projectNameParts[0]}`, CommandToRun.MKDIR, projectNameParts[1]);
            mkdirCmd2.execute();
            cmdHistory.addExecutedCommand(mkdirCmd2)
        }
    }

    if (projectDirectoryCanBeUsed) {
        let createPackageJsonFileCmd = new ShellCommand("Create package.json File", projectDirectory, CommandToRun.TO_FILE, 
                                                        Helpers.toJsonString(project.toJsObject()), "package.json")
        createPackageJsonFileCmd.execute();
        cmdHistory.addExecutedCommand(createPackageJsonFileCmd);
        if (!createPackageJsonFileCmd.success)
            return cmdHistory;

        let createModelDirCmd = new ShellCommand("Create model/ Directory", projectDirectory, CommandToRun.MKDIR, "model")
        createModelDirCmd.execute();
        cmdHistory.addExecutedCommand(createModelDirCmd);
        if (!createModelDirCmd.success)
            return cmdHistory;

        let createModelDotFileCmd = new ShellCommand("Create Dot File for model/ Directory", `${projectDirectory}/model`, CommandToRun.TO_FILE, 
                                                     "Directory to store top-level model source code\n", ".description")
        createModelDotFileCmd.execute()
        cmdHistory.addExecutedCommand(createModelDotFileCmd)
        if (!createModelDotFileCmd.success)
            return cmdHistory;

        let createViewsDirCmd = new ShellCommand("Create views/queries/ Directories", projectDirectory, CommandToRun.MKDIR, "views/queries", "-p")
        createViewsDirCmd.execute();
        cmdHistory.addExecutedCommand(createViewsDirCmd)
        if (!createViewsDirCmd.success)
            return cmdHistory;

        let createViewsDotFileCmd = new ShellCommand("Create Dot File for views/ Directory", `${projectDirectory}/views`, CommandToRun.TO_FILE, 
                                                     "Directory to store views source code\n", ".description")
        createViewsDotFileCmd.execute()
        cmdHistory.addExecutedCommand(createViewsDotFileCmd)
        if (!createViewsDotFileCmd.success)
        return cmdHistory;

        let createQueriesDotFileCmd = new ShellCommand("Create Dot File for views/queries/ Directory", `${projectDirectory}/views/queries`, CommandToRun.TO_FILE, 
                                                       "Directory to store queries source code\n", ".description")
        createQueriesDotFileCmd.execute()
        cmdHistory.addExecutedCommand(createQueriesDotFileCmd)
        if (!createQueriesDotFileCmd.success)
            return cmdHistory;

        let readmeQuery = BuiltinViews.getReadmeQuery();
        let createReadmeQueryFileCmd = new ShellCommand("Create default README Query File", `${projectDirectory}/views/queries`, CommandToRun.TO_FILE,
                                                         readmeQuery, "README.query.njk");
        createReadmeQueryFileCmd.execute();
        cmdHistory.addExecutedCommand(createReadmeQueryFileCmd);
        if (!createReadmeQueryFileCmd.success)
            return cmdHistory;
        
        let readmeView = BuiltinViews.getReadmeView();
        let createReadmeViewFileCmd = new ShellCommand("Create default README View File", `${projectDirectory}/views`, CommandToRun.TO_FILE,
                                                        readmeView, "README.md.njk");
        createReadmeViewFileCmd.execute();
        cmdHistory.addExecutedCommand(createReadmeViewFileCmd);
        if (!createReadmeViewFileCmd.success)
            return cmdHistory;

        // add readme
        let readmeQueryContents = yaml.load(ViewRenderer.render(readmeQuery, project.toJsObject())) as Object;
        let readmeFileContents = ViewRenderer.render(readmeView, readmeQueryContents);
        let createReadmeFileCmd = new ShellCommand("Save Generated README.md File", projectDirectory, CommandToRun.TO_FILE,
                                                   readmeFileContents, "README.md");
        createReadmeFileCmd.execute();
        cmdHistory.addExecutedCommand(createReadmeFileCmd);
        if (!createReadmeViewFileCmd.success)
            return cmdHistory
    }

    return cmdHistory;
}

// in project directory, generate selected tool scaffolding (a.k.a., for npm or yarn) 
// (including .npmrc or .yarnrc) for a mono repo (a.k.a., npm/yarn workspaces)
export function generatePackageManagerScaffolding(project: ProjectConfiguration, projectDirectory : string) : CommandHistory {
    let cmdHistory = new CommandHistory(`Generate Package Manager Scaffolding for ${project.name}`)

    let mkdirPackagesCmd = new ShellCommand("Create packages Directory", projectDirectory, CommandToRun.MKDIR, "packages");
    mkdirPackagesCmd.execute();
    cmdHistory.addExecutedCommand(mkdirPackagesCmd)
    if (!mkdirPackagesCmd.success)
        return cmdHistory;
    
    let createPackagesDotFileCmd = new ShellCommand("Create Dot File for packages/ Directory", `${projectDirectory}/packages`, CommandToRun.TO_FILE, 
                                                    "Directory to store sub-projects within\n", ".description")
    createPackagesDotFileCmd.execute()
    cmdHistory.addExecutedCommand(createPackagesDotFileCmd)
    if (!createPackagesDotFileCmd.success)
        return cmdHistory;

    let rcOptionsData : any = {}
    rcOptionsData["rcOptions"] = project.getInitialRcOptions();
    let rcFileContents = "";
    let rcFileName = ""
        
    if (project.packageManager == PackageManagers.NPM) {
        rcFileContents = ViewRenderer.render(BuiltinViews.getNpmRcFileView(), rcOptionsData)
        rcFileName = ".npmrc"
    }
    else if (project.packageManager == PackageManagers.YARN) {
        rcFileContents = ViewRenderer.render(BuiltinViews.getYarnRcYamlFileView(), rcOptionsData)
        rcFileName = ".yarnrc.yml"
    }
    else {
        // no options to save
    }

    if (rcFileContents !== "") {
        let saveRcFileCmd = new ShellCommand(`Save RC File ${rcFileName}`, projectDirectory, 
                                             CommandToRun.TO_FILE, rcFileContents, rcFileName)
        saveRcFileCmd.execute()
        cmdHistory.addExecutedCommand(saveRcFileCmd)
    }

    return cmdHistory;
}

export function initializeBuildTool(project: ProjectConfiguration, projectDirectory: string,  buildToolPath: string) : CommandHistory {
    let cmdHistory = new CommandHistory(`Initialize Build Tool for ${project.name}`)

    if (project.buildTool === BuildTools.GRADLE) {
        //`gradle init` prompts for project type (basic), dsl (Groovy), project name, Generate build using new API and behavior (--no-incubating)
        let gradleInitCmd = new ShellCommand("Run gradle init", projectDirectory, CommandToRun.EXEC,
                                         `${buildToolPath} init --type basic --dsl groovy --project-name ${project.name} --no-incubating`)
        gradleInitCmd.execute();
        cmdHistory.addExecutedCommand(gradleInitCmd);

        // put render new build file here
        let buildQuery = BuiltinViews.getBuildQuery();
        let createBuildFileQueryFileCmd = new ShellCommand("Create default build.gradle Query File", `${projectDirectory}/views/queries`, CommandToRun.TO_FILE,
                                                           buildQuery, "build.query.njk");
        createBuildFileQueryFileCmd.execute();
        cmdHistory.addExecutedCommand(createBuildFileQueryFileCmd);
        if (!createBuildFileQueryFileCmd.success)
            return cmdHistory;
        
        let buildView = BuiltinViews.getBuildView()
        let createBuildFileViewFileCmd = new ShellCommand("Create default build.gradle View File", `${projectDirectory}/views`, CommandToRun.TO_FILE,
                                                          buildView, "build.gradle.njk");
        createBuildFileViewFileCmd.execute();
        cmdHistory.addExecutedCommand(createBuildFileViewFileCmd);
        if (!createBuildFileViewFileCmd.success)
            return cmdHistory;
        
        let buildQueryContents = yaml.load(ViewRenderer.render(buildQuery, {})) as Object;
        let buildFileContents = ViewRenderer.render(buildView, buildQueryContents);
        let createBuildFileCmd = new ShellCommand("Save Generated build.gradle File", projectDirectory, CommandToRun.TO_FILE,
                                                   buildFileContents, "build.gradle");
        createBuildFileCmd.execute();
        cmdHistory.addExecutedCommand(createBuildFileCmd);
        if (!createBuildFileCmd.success)
            return cmdHistory
    }

    return cmdHistory;
}

export function initializeVersionControlTool(project : ProjectConfiguration, projectDirectory: string, versionControlToolPath : string) : CommandHistory {
    let cmdHistory = new CommandHistory(`Initialize Version Control Tool for ${project.name}`)

    if (project.versionControlTool === VersionControlTools.GIT) {
        //in project directory, generate scaffolding for version control tool (a.k.a., git, s.a., .gitignore)
        let vctInitCmd = new ShellCommand("Initialize git Repository", projectDirectory, CommandToRun.EXEC,
                                          `${versionControlToolPath} init --initial-branch=main`)
        vctInitCmd.execute();
        cmdHistory.addExecutedCommand(vctInitCmd);
        if (!vctInitCmd.success)
            return cmdHistory;
   
        //perform "best practice" git operations for newly generated project scaffolding git add . git commit -m "Initial commit" (with expanded commit description s.a., "project generated from...")
        let createGitIgnoreFileCmd = new ShellCommand("Create m30pm .gitignore File", projectDirectory, CommandToRun.TO_FILE,
                                                      gitIgnoreContents, ".gitignore")
        createGitIgnoreFileCmd.execute()
        cmdHistory.addExecutedCommand(createGitIgnoreFileCmd)
        if (!createGitIgnoreFileCmd.success)
            return cmdHistory;

        let vctAddDotCmd = new ShellCommand("Add New Project Content to Commit", projectDirectory, CommandToRun.EXEC,
                                            `${versionControlToolPath} add .`)
        vctAddDotCmd.execute();
        cmdHistory.addExecutedCommand(vctAddDotCmd);
        if (!vctAddDotCmd.success)
            return cmdHistory;

        let vctCommitInitialCommitCmd = new ShellCommand("Make Initial Commit", projectDirectory, CommandToRun.EXEC,
                                                         `${versionControlToolPath} commit -m "Initial commit\n\nCreated by m30pm"`)
        vctCommitInitialCommitCmd.execute();       
    }
    
    return cmdHistory;
}

export function getVctNextStep(versionControlTool : VersionControlTools) : string {
    if (versionControlTool === VersionControlTools.GIT)
        return "git remote add origin <git-url> && git push -u origin main";
    else   
        return "";
}

export class Projects {
    public static createProject(project: ProjectConfiguration, notifyUser: NotifyUserFunction) {
        let pwdCmd = new ShellCommand("Get Current Working Directory", "", CommandToRun.PWD)
        pwdCmd.execute();
        let workingDirectory = pwdCmd.stdout
        let projectDirectory = `${workingDirectory}/${project.name}`

        let funcInfo = new FunctionInfo("createProject")
        funcInfo.addArgument(new FunctionArgument("project", project.toJsObject()))
        let logger = new CommandHistoryLogger(LogLevels.DEBUG, projectDirectory, funcInfo)

        notifyUser(`# Creating Project ${project.name}`, FormattedMessageType.NORMAL)

        //verify package manager, build tool, and version control tool are installed 
        const pmInfo = new ToolInfo(project.packageManager.toString())
        logger.addCommandHistory(pmInfo.cmdHistory)

        let pmMessage = formatToolInfoMessage(pmInfo, "Package Manager")        
        notifyUser(pmMessage, pmInfo.verifiedVersion ? FormattedMessageType.NORMAL : FormattedMessageType.ERROR)

        let minBtVersion = "0.0.0";
        if (project.buildTool === BuildTools.GRADLE)
            minBtVersion = minGradleVersion;
        const btInfo = new ToolInfo(project.buildTool.toString(), minBtVersion)
        logger.addCommandHistory(btInfo.cmdHistory)

        let btMessage = formatToolInfoMessage(btInfo, "Build Tool")
        notifyUser(btMessage, btInfo.verifiedVersion ? FormattedMessageType.NORMAL : FormattedMessageType.ERROR)


        let minVctVersion = "0.0.0";
        if (project.versionControlTool === VersionControlTools.GIT)
            minVctVersion = minGitVersion;
        const vctInfo = new ToolInfo(project.versionControlTool.toString(), minVctVersion)
        logger.addCommandHistory(vctInfo.cmdHistory)

        let vctMessage = formatToolInfoMessage(vctInfo, "Version Control Tool")
        notifyUser(vctMessage, vctInfo.verifiedVersion ? FormattedMessageType.NORMAL : FormattedMessageType.ERROR)

        // ensure all required tools are verified before continuing
        if (!pmInfo.verifiedVersion || !btInfo.verifiedVersion || !vctInfo.verifiedVersion)
            return

        let projectDirectoryCommands = initializeProjectDirectory(project, workingDirectory, projectDirectory);
        logger.addCommandHistory(projectDirectoryCommands)

        let projectDirectoryMessage = ""
        if (projectDirectoryCommands.success) {
            projectDirectoryMessage += `## ${projectDirectoryCommands.description}\n`
            projectDirectoryMessage += `Created directory \`${projectDirectory}\`\n`
        } else {
            projectDirectoryMessage += `# Cannot ${projectDirectoryCommands.description}\n`
            projectDirectoryCommands.executedCommands.forEach((cmd: any) => {
                if (!cmd.success) {
                    projectDirectoryMessage += `| Failed Command Property | Value |\n`
                    projectDirectoryMessage += `|---------|-------|\n`
                    projectDirectoryMessage += `| description | ${cmd.description} |\n`
                    projectDirectoryMessage += `| executedStatus | ${cmd.executedStatus} |\n`
                    projectDirectoryMessage += `| workingDirectory | ${cmd.workingDirectory} |\n`
                    projectDirectoryMessage += `| command | ${cmd.command} |\n`
                    projectDirectoryMessage += `| commandLine | ${cmd.commandLine} |\n`
                    projectDirectoryMessage += `| additionalOptions | ${cmd.additionalOptions} |\n`
                    projectDirectoryMessage += `| successExitCode | ${cmd.successExitCode} |\n`
                    projectDirectoryMessage += `| success | ${cmd.success} |\n`
                    projectDirectoryMessage += `| exitCode | ${cmd.exitCode} |\n`
                    projectDirectoryMessage += `| stdout | ${cmd.stdout} |\n`
                    projectDirectoryMessage += `| stderr | ${cmd.stderr} |\n`
                }
            })
        }

        notifyUser(projectDirectoryMessage, projectDirectoryCommands.success ? FormattedMessageType.NORMAL : FormattedMessageType.ERROR)
        if (!projectDirectoryCommands.success)
            return

        // generate package manager scaffolding
        let packageMangerScaffoldingCommands = generatePackageManagerScaffolding(project, projectDirectory)
        logger.addCommandHistory(packageMangerScaffoldingCommands)

        let logFilePath = `${logger.logFileDirectory}/${logger.logFileName}`
        let pmScaffoldingMessage = formatInitializationMessage(packageMangerScaffoldingCommands, logFilePath)
        notifyUser(pmScaffoldingMessage, packageMangerScaffoldingCommands.success ? FormattedMessageType.NORMAL : FormattedMessageType.ERROR)
        if (!packageMangerScaffoldingCommands.success) {
            logger.writeLog()
            return
        }
        
        // initialize build tool
        let buildToolCommands = initializeBuildTool(project, projectDirectory, btInfo.path);
        logger.addCommandHistory(buildToolCommands)

        let btInitMessage = formatInitializationMessage(buildToolCommands, logFilePath)
        notifyUser(btInitMessage, buildToolCommands.success ? FormattedMessageType.NORMAL : FormattedMessageType.ERROR)
        if (!buildToolCommands.success) {
            logger.writeLog()
            return
        }

        // initialize version control tool
        let versionControlToolCommands = initializeVersionControlTool(project, projectDirectory, vctInfo.path)
        logger.addCommandHistory(versionControlToolCommands)

        let vctInitMessage = formatInitializationMessage(versionControlToolCommands, logFilePath)
        notifyUser(vctInitMessage, versionControlToolCommands.success ? FormattedMessageType.NORMAL : FormattedMessageType.ERROR)
        if (!versionControlToolCommands.success) {
            logger.writeLog()
            return
        }

        let vctNextStep = getVctNextStep(project.versionControlTool);
        let nextSteps = "";
        nextSteps += `# Project ${project.name} Created\n`
        nextSteps += "## Next Steps\n"
        nextSteps += `- Change to Project Directory: \`cd ${project.name}\`\n`
        if (vctNextStep !== '')
            nextSteps += `- Complete Version Control Initialization: \`${vctNextStep}\`\n`

        notifyUser(nextSteps, FormattedMessageType.NORMAL)
        logger.writeLog()
    }
}

function formatToolInfoMessage(tool: ToolInfo, toolType: string) : string {
    let message: string = "";
    if (tool.verifiedVersion) {
        message += `## ${tool.cmdHistory.description} (${toolType})\n`
        message += `Found ${toolType}: ${tool.name} v${tool.version} at \`${tool.path}\``
    } else {
        message += `# Cannot ${tool.cmdHistory.description} (${toolType})\n`
        if (!tool.installed)
            message += `${tool.name} not installed\n`
        else
            message += `Found ${toolType}: **${tool.name} v${tool.version} (min version is ${tool.minVersion})** at:\n  \`${tool.path}\` \n`
    }

    return message
}

function formatInitializationMessage(initializationCommands: CommandHistory, logFileName: string) : string {
    let message: string = "";
    if (initializationCommands.success) {
        message += `## ${initializationCommands.description}\n`
        message += `Complete\n`
    } else {
        message += `# Cannot ${initializationCommands.description}\n`
        message += `See logs for details\n-\`${logFileName}.md\`\n-\`${logFileName}.yaml\`\n`
    }

    return message
}