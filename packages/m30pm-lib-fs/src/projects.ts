import { ProjectConfiguration, PackageManagers } from "m30pm-lib-common";
import * as sh from 'shelljs'
import semver from 'semver';

sh.config.silent = true;
const minGradleVersion = "8.2"

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
        results["toolVersion"] = versionSearch ? versionSearch[0] : "";
    }

    return results;
}

export function createProject(project: ProjectConfiguration) : any {
    let results : any = {};
    results["projectToCreate"] = project.name;
    results["success"] = true;
    results["message"] = "";
//REMOVE    console.log(`Creating ${project.name}...`)
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
        if (!semver.gte(results.buildTool.toolVersion, minGradleVersion)) {
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
/*    
    const pmPath = sh.which(project.packageManager.toString())
    if (!pmPath) {
        console.log(`Package manager (${project.packageManager.toString()}) not found`);
        sh.exit(1);
    }
    else {
        let pmVersion = sh.exec(`${pmPath.toString()} --version`).trim()
        console.log(`Found package manager (${project.packageManager.toString()} v${pmVersion.toString()}) at ${pmPath}`)
    }
    const btPath = sh.which(project.buildTool.toString())
    if (!btPath) {
        console.log(`Build tool (${project.buildTool.toString()}) not found`);
        sh.exit(1);
    }
    else {
        let btVersion = sh.exec(`${btPath.toString()} --version`).grep("Gradle").trim().split(" ")[1]
        console.log(`Found build tool (${project.buildTool.toString()} v${btVersion.toString()}) at ${btPath}`)
    }
    const vctPath = sh.which(project.versionControlTool.toString())
    if (!vctPath) {
        console.log(`Version control tool (${project.versionControlTool.toString()}) not found`);
        sh.exit(1);
    }
    else {
        let vctVersion = sh.exec(`${vctPath.toString()} --version`).trim().split(" ")[2]
        console.log(`Found version control tool (${project.versionControlTool.toString()} v${vctVersion.toString()}) at ${vctPath}`)
    }
 */  

    //create project directory using project name (should follow oclif pattern; if no directory exists, create directory; if directory exists and empty, continue project creation; if directory exists and is not empty, exit with error stating non-empty directory)
    // refactor
    const projectPath = sh.ls("-d", project.name);
    if (projectPath.length) {
        const projectContents = sh.ls("-A", projectPath.toString())
        if (projectContents.length) {
            results.success = false;
            results.message = `Cannot create project, ${projectPath} is not empty`;
            return results;
        }
    }
    else {
        sh.mkdir(project.name)
    }

    //in project directory, generate selected tool scaffolding (a.k.a., for npm or yarn) (including .npmrc or .yarnrc) for a mono repo (a.k.a., npm/yarn workspaces)
    // refactor
    sh.cd(project.name)
    let packageFile = new sh.ShellString(project.getJsonString())
    packageFile.to("package.json")
    sh.mkdir("packages")
    let rcFile = new sh.ShellString(project.getRcContents())
    if (project.packageManager == PackageManagers.NPM) {
        rcFile.to(".npmrc")
    }
    else if (project.packageManager == PackageManagers.YARN) {
        rcFile.to(".yarnrc.yml")
    }
    else {
        console.log("Invalid package manager")
        sh.exit(1)
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

