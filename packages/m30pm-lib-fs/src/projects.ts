import { ProjectConfiguration, PackageManagers, ViewRenderer, BuiltinViews, BuildTools, VersionControlTools, Helpers } from "m30pm-lib-common";
import { ToolInfo } from "./tool-info";
import { ShellCommand, CommandToRun } from "./shell-cmd";
import { CommandHistory } from "./cmd-history";
import * as sh from 'shelljs'

sh.config.silent = true;
const minGradleVersion = "8.2.0"
let projectDirectory = ""

// create project directory using project name (should follow oclif pattern; if no directory exists, create directory; if directory exists and empty, continue project creation; 
// if directory exists and is not empty, return with error stating non-empty directory)
export function initializeProjectDirectory(project: ProjectConfiguration) : CommandHistory {
    const projectName = project.name;
    let cmdHistory = new CommandHistory(`Initialze Project Directory for ${projectName}`)
    let pwdCmd = new ShellCommand("Get Current Working Directory", "", CommandToRun.PWD)
    pwdCmd.execute();
    cmdHistory.addExecutedCommand(pwdCmd);
    let workingDirectory = pwdCmd.stdout;
    projectDirectory = `${workingDirectory}/${projectName}`
    
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
        let mkdirCmd = new ShellCommand(`Create Project Directory ${projectDirectory}`, 
                                        workingDirectory, CommandToRun.MKDIR, projectName);
        mkdirCmd.execute();
        cmdHistory.addExecutedCommand(mkdirCmd)
    }

    if (projectDirectoryCanBeUsed) {
        let createPackageJsonFileCmd = new ShellCommand("Create package.json File", projectDirectory, CommandToRun.TO_FILE, 
                                                        Helpers.toJsonString(project.toJsObject()), "package.json")
        createPackageJsonFileCmd.execute();
        cmdHistory.addExecutedCommand(createPackageJsonFileCmd);
    }
    return cmdHistory;
    }

// in project directory, generate selected tool scaffolding (a.k.a., for npm or yarn) 
// (including .npmrc or .yarnrc) for a mono repo (a.k.a., npm/yarn workspaces)
export function generatePackageManagerScaffolding(project: ProjectConfiguration, projectDirectory : string) : any {
    let results : any = {}
    results["rcFileName"] = ""

    sh.cd(projectDirectory)
    sh.mkdir("packages")

    let rcOptionsData : any = {}
    rcOptionsData["rcOptions"] = project.getInitialRcOptions();
        
    if (project.packageManager == PackageManagers.NPM) {
        const rcFileContents = ViewRenderer.render(BuiltinViews.getNpmRcFileView(), rcOptionsData)
        const rcFile = new sh.ShellString(rcFileContents)
        results.rcFileName = ".npmrc"
        rcFile.to(results.rcFileName)
    }
    else if (project.packageManager == PackageManagers.YARN) {
        const rcFileContents = ViewRenderer.render(BuiltinViews.getYarnRcYamlFileView(), rcOptionsData)
        const rcFile = new sh.ShellString(rcFileContents)
        results.rcFileName = ".yarnrc.yml"
        rcFile.to(results.rcFileName)
    }
    else {
        // no options to save
    }

    return results;
}

export function initializeBuildTool(project: ProjectConfiguration, projectDirectory: string,  buildToolPath: string) : any {
    let results : any = {};
    results["btInitialized"] =  true;
    results["stdout"] = "";
    results["stderr"] = "";
    
    sh.cd(projectDirectory)
    if (project.buildTool === BuildTools.GRADLE) {
        //`gradle init` prompts for project type (basic), dsl (Groovy), project name, Generate build using new API and behavior (--no-incubating)
        let btInit = sh.exec(`${buildToolPath} init --type basic --dsl groovy --project-name ${project.name} --no-incubating`);
        results.btInitialized = btInit.code === 0;
        results.stdout = btInit.stdout;
        results.stderr = btInit.stderr;
        return results;
    }
    else {
        results.btInitialized = false;
        return results;
    }
}

export function initializeVersionControlTool(project : ProjectConfiguration, projectDirectory: string, versionControlToolPath : string) : any {
    let results : any = {};
    results["vctInitialized"] = true;
    results["vctInit"] = {};
    results.vctInit["code"] = 0;
    results.vctInit["stdout"] = ""
    results.vctInit["stderr"] = ""
    results["vctAddDot"] = {};
    results.vctAddDot["code"] = 0;
    results.vctAddDot["stdout"] = ""
    results.vctAddDot["stderr"] = ""
    results["vctInitialCommit"] = {};
    results.vctInitialCommit["code"] = 0;
    results.vctInitialCommit["stdout"] = ""
    results.vctInitialCommit["stderr"] = ""
    results["vctNextStep"] = ""
   
    sh.cd(projectDirectory)
    if (project.versionControlTool === VersionControlTools.GIT) {
        //in project directory, generate scaffolding for version control tool (a.k.a., git, s.a., .gitignore)
        let vctInit = sh.exec(`${versionControlToolPath} init --initial-branch=main`)
        results.vctInitialized = vctInit.code === 0;
        results.vctInit.code = vctInit.code;
        results.vctInit.stdout = vctInit.stdout;
        results.vctInit.stderr = vctInit.stderr;

        if (!results.vctInitialized)
            return results;
   
        //perform "best practice" git operations for newly generated project scaffolding git add . git commit -m "Initial commit" (with expanded commit description s.a., "project generated from...")
        let vctAddDot = sh.exec(`${versionControlToolPath} add .`)
        results.vctInitialized = vctAddDot.code === 0;
        results.vctAddDot.code = vctAddDot.code;
        results.vctAddDot.stdout = vctAddDot.stdout;
        results.vctAddDot.stderr = vctAddDot.stderr;

        if (!results.vctInitialized)
            return results;

        let vctCommitInitialCommit = sh.exec(`${versionControlToolPath} commit -m "Initial commit\n\nCreated by m30pm"`)
        results.vctInitialized = vctCommitInitialCommit.code === 0;
        results.vctInitialCommit.code = vctCommitInitialCommit.code;
        results.vctInitialCommit.stdout = vctCommitInitialCommit.stdout;
        results.vctInitialCommit.stderr = vctCommitInitialCommit.stderr;

        if (!results.vctInitialized)
            return results;
        
        // inform user of next step, running git command for setting up remote origin (e.g., git remote add origin <git-url>)
        results.vctNextStep = "git remote add origin <git-url> && git push -u origin main"
    }
    else {
        results.vctInitialized = false;
        return results;
    }
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

        results["packageMangerScaffolding"] = generatePackageManagerScaffolding(project, results.projectPath.path)
        if (results.rcFileName === "") {
            results.success = false;
            results.message = `Invalid package manager ${project.packageManager.toString()}`;
            return results;
        }
        

        // refactor bt and vct separately
        //in project directory, generate scaffolding for build tool (a.k.a., gradle init with gradle file included - s.a., for base set of templates for generating documentation)

        // initialize build tool
        results.buildTool["initialization"] = initializeBuildTool(project, results.projectPath.path, results.buildTool.toolPath);
        if (!results.buildTool.initialization.btInitialized && project.buildTool !== BuildTools.INVALID_BT) {
            results.success = false;
            results.message = `Failed to initialize build tool ${project.buildTool.toString()}`;
            return results;
        }

        // initialize version control tool
        results.versionControlTool["initialization"] = initializeVersionControlTool(project, results.projectPath.path, results.versionControlTool.toolPath)
        if (!results.versionControlTool.initialization.vctInitialized && project.versionControlTool !== VersionControlTools.INVALID_VCT) {
            results.success = false;
            results.message = `Failed to initialize version control tool ${project.versionControlTool.toString()}`;
            return results;
        }

        // if we got here, the project has been initialized, so all we have to do is return the results
        return results;
    }
}
