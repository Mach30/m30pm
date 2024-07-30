import { ProjectConfiguration, PackageManagers, ViewRenderer, BuiltinViews } from "m30pm-lib-common";
import * as sh from 'shelljs'
import semver from 'semver';

sh.config.silent = true;
const minGradleVersion = "8.2.0"

export function getShell() : any {
    return sh;
}

export function testTool(toolName: string) : any {
    let results:any = {};
    results["toolName"] = toolName;
    results["toolPath"] = "";
    results["toolVersion"] = "";

    const toolPath = sh.which(toolName);
    results["toolFound"] = toolPath ? true : false;
    if (results["toolFound"]) {
        results["toolPath"] = toolPath?.toString()
        const versionStringRegEx = /[0-9]+(\.[0-9]+)+/;
        const versionSearch = sh.exec(`${results["toolPath"]} --version`).toString().match(versionStringRegEx);
        const versionString = versionSearch ? versionSearch[0] : "";
        results["toolVersion"] = semver.coerce(versionString)?.toString();
    }

    return results;
}

export function verifyMinToolVersion(toolInfo: any, minVersion: string) : any {
    let results : any = {};
    const toolVersion = toolInfo.toolVersion;

    results["toolName"] = toolInfo.toolName;
    results["toolVersion"] = toolVersion;
    results["minVersion"] = minVersion;
    results["passedMinVersionCheck"] = false;

    if (toolInfo.toolFound)
        results["passedMinVersionCheck"] = semver.gte(toolVersion, minVersion);
    
    return results;
}

// create project directory using project name (should follow oclif pattern; if no directory exists, create directory; if directory exists and empty, continue project creation; 
// if directory exists and is not empty, return with error stating non-empty directory)
export function createProjectDirectory(project: ProjectConfiguration) : any {
    let results : any = {}
    const projectName = project.name;
    results["path"] = `${sh.pwd().toString()}/${projectName}`;
    results["empty"] = true;
    results["contents"] = ""

    const projectPath = sh.ls("-d", projectName);
    if (projectPath.length) {
        const projectContents = sh.ls("-A", projectPath.toString())
        if (projectContents.length) {
            results.empty = false;
            results.contents = projectContents.toString();
            return results;
        }
        else {
            sh.cd(projectName);
            let packageFile = new sh.ShellString(JSON.stringify(project.toJsObject(), null, 2)) 
            packageFile.to("package.json");
            return results;
        }
    }
    else {
        sh.mkdir(projectName);
        sh.cd(projectName);
        let packageFile = new sh.ShellString(JSON.stringify(project.toJsObject(), null, 2)) 
        packageFile.to("package.json");
        return results;
    }
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

export function createProject(project: ProjectConfiguration) : any {
    let results : any = {};
    results["projectToCreate"] = project.name;
    results["success"] = true;
    results["message"] = "";

    //verify package manager, build tool, and version control tool are installed 
    results["packageManager"] = testTool(project.packageManager.toString());
    if (!results.packageManager.toolFound) {
        results.success = false;
        results.message = `Cannot find package manager ${results.packageManager.toolName}`
        return results
    }

    results["buildTool"] = testTool(project.buildTool.toString());
    if (!results.buildTool.toolFound) {
        results.success = false;
        results.message = `Cannot find build tool ${results.buildTool.toolName}`
        return results
    } else if (results.buildTool.toolName === 'gradle') {
        // ensure min version of gradle is met
        results.buildTool["verifyMinToolVersion"] = verifyMinToolVersion(results.buildTool, minGradleVersion)
        if (!results.buildTool.verifyMinToolVersion.passedMinVersionCheck) {
            results.success = false;
            results.message = `Gradle version must be >= v${minGradleVersion}`;
            return results;
        }
    }

    results["versionControlTool"] = testTool(project.versionControlTool.toString());
    if (!results.versionControlTool.toolFound) {
        results.success = false;
        results.message = `Cannot find version control tool ${results.versionControlTool.toolName}`;
        return results;
    }

    
    results["projectPath"] = createProjectDirectory(project)
    if (!results.projectPath.empty) {
        results.success = false;
        results.message = `Cannot create project, ${results.projectPath.path} is not empty`;
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
    //`gradle init` prompts for project type (basic), dsl (Groovy), project name, Generate build using new API and behavior (--no-incubating)
    let btInit = sh.exec(`${results.buildTool.toolPath} init --type basic --dsl groovy --project-name ${project.name} --no-incubating`)
    //in project directory, generate scaffolding for version control tool (a.k.a., git, s.a., .gitignore)
    let vctInit = sh.exec(`${results.versionControlTool.toolPath} init --initial-branch=main`)
    //perform "best practice" git operations for newly generated project scaffolding git add . git commit -m "Initial commit" (with expanded commit description s.a., "project generated from...")
    let vctAddDot = sh.exec(`${results.versionControlTool.toolPath} add .`)
    let vctCommitInitialCommit = sh.exec(`${results.versionControlTool.toolPath} commit -m "Initial commit\n\nCreated by m30pm"`)
    //print out user git command for setting up remote origin (e.g., git remote add origin <git-url>)

    //TODO: check results of sh.exec calls (namely lines 64-72)
}

