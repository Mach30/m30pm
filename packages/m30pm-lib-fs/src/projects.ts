import { ProjectConfiguration, PackageManagers, ViewRenderer, BuiltinViews, BuildTools, VersionControlTools, Helpers } from "m30pm-lib-common";
import { ToolInfo } from "./tool-info";
import { ShellCommand, CommandToRun } from "./shell-cmd";
import { CommandHistory } from "./cmd-history";
import * as sh from 'shelljs'

sh.config.silent = true;
const minGradleVersion = "8.2.0"
let _projectDirectory = ""

// create project directory using project name (should follow oclif pattern; if no directory exists, create directory; if directory exists and empty, continue project creation; 
// if directory exists and is not empty, return with error stating non-empty directory)
export function initializeProjectDirectory(project: ProjectConfiguration) : CommandHistory {
    const projectName = project.name;
    let cmdHistory = new CommandHistory(`Initialze Project Directory for ${projectName}`)
    let pwdCmd = new ShellCommand("Get Current Working Directory", "", CommandToRun.PWD)
    pwdCmd.execute();
    cmdHistory.addExecutedCommand(pwdCmd);
    let workingDirectory = pwdCmd.stdout;
    _projectDirectory = `${workingDirectory}/${projectName}`
    
    let lsCmd = new ShellCommand(`Determine if Project Directory ${_projectDirectory} Exists`, workingDirectory, CommandToRun.LS, projectName, "-d")
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
        let mkdirCmd = new ShellCommand(`Create Project Directory ${_projectDirectory}`, 
                                        workingDirectory, CommandToRun.MKDIR, projectName);
        mkdirCmd.execute();
        cmdHistory.addExecutedCommand(mkdirCmd)
    }

    if (projectDirectoryCanBeUsed) {
        let createPackageJsonFileCmd = new ShellCommand("Create package.json File", _projectDirectory, CommandToRun.TO_FILE, 
                                                        Helpers.toJsonString(project.toJsObject()), "package.json")
        createPackageJsonFileCmd.execute();
        cmdHistory.addExecutedCommand(createPackageJsonFileCmd);
    }

    return cmdHistory;
}

// in project directory, generate selected tool scaffolding (a.k.a., for npm or yarn) 
// (including .npmrc or .yarnrc) for a mono repo (a.k.a., npm/yarn workspaces)
export function generatePackageManagerScaffolding(project: ProjectConfiguration, projectDirectory : string) : any {
    let cmdHistory = new CommandHistory(`Generate Package Manager Scaffolding for ${project.name}`)

    let mkdirPackagesCmd = new ShellCommand("Create packages Directory", projectDirectory, CommandToRun.MKDIR, "packages");
    mkdirPackagesCmd.execute();
    cmdHistory.addExecutedCommand(mkdirPackagesCmd)
    if (!mkdirPackagesCmd.success)
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

export function initializeBuildTool(project: ProjectConfiguration, projectDirectory: string,  buildToolPath: string) : any {
    let cmdHistory = new CommandHistory(`Initialize Build Tool for ${project.name}`)

    if (project.buildTool === BuildTools.GRADLE) {
        //`gradle init` prompts for project type (basic), dsl (Groovy), project name, Generate build using new API and behavior (--no-incubating)
        let gradleInitCmd = new ShellCommand("Run gradle init", projectDirectory, CommandToRun.EXEC,
                                         `${buildToolPath} init --type basic --dsl groovy --project-name ${project.name} --no-incubating`)
        gradleInitCmd.execute();
        cmdHistory.addExecutedCommand(gradleInitCmd);
    }

    return cmdHistory;
}

export function initializeVersionControlTool(project : ProjectConfiguration, projectDirectory: string, versionControlToolPath : string) : any {
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
    public static createProject(project: ProjectConfiguration) : any {
        let results : any = {};
        results["projectToCreate"] = project.name;
        results["success"] = true;
        results["message"] = `Project ${project.name} initialized`;

        //verify package manager, build tool, and version control tool are installed 
        const pmInfo = new ToolInfo(project.packageManager.toString())
        results["packageManager"] = pmInfo.toJsObject()
        if (!pmInfo.verifiedVersion) {
            results.success = false;
            results.message = `Cannot ${pmInfo.cmdHistory.description}`
            return results
        }

        const btInfo = new ToolInfo(project.buildTool.toString(), minGradleVersion)
        results["buildTool"] = btInfo.toJsObject();
        if (!btInfo.verifiedVersion) {
            results.success = false;
            results.message = `Cannot ${btInfo.cmdHistory.description}`
            return results
        } 

        const vctInfo = new ToolInfo(project.versionControlTool.toString())
        if (!vctInfo.verifiedVersion) {
            results.success = false;
            results.message = `Cannot ${vctInfo.cmdHistory.description}`;
            return results;
        }

        results["initializations"] = {};
        let projectDirectoryCommands = initializeProjectDirectory(project);
        results.initializations["projectDirectory"] = projectDirectoryCommands.toJsObject();
        if (!projectDirectoryCommands.success) {
            results.success = false;
            results.message = `Cannot ${projectDirectoryCommands.description}`;
            return results;
        }

        let packageMangerScaffoldingCommands = generatePackageManagerScaffolding(project, _projectDirectory)
        results.initializations["packageMangerScaffolding"] = packageMangerScaffoldingCommands.toJsObject();
        if (!packageMangerScaffoldingCommands.success) {
            results.success = false;
            results.message = `Cannot ${packageMangerScaffoldingCommands.description}`;
            return results;
        }
        
        // initialize build tool
        let builtToolCommands = initializeBuildTool(project, _projectDirectory, btInfo.path);
        results.initializations["buildTool"] = builtToolCommands.toJsObject();
        if (!builtToolCommands.success) {
            results.success = false;
            results.message = `Cannot ${builtToolCommands.description}`;
            return results;
        }

        // initialize version control tool
        let versionControlToolCommands = initializeVersionControlTool(project, _projectDirectory, vctInfo.path)
        results.initializations["versionControlTool"] = versionControlToolCommands.toJsObject();
        if (!versionControlToolCommands.success) {
            results.success = false;
            results.message = `Cannot ${versionControlToolCommands.description}`;
            return results;
        }

        results["nextSteps"] = [];
        results.nextSteps[0] = getVctNextStep(project.versionControlTool);

        // if we got here, the project has been initialized, so all we have to do is return the results
        return results;
    }
}
