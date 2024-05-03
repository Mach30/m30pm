import { ProjectConfiguration, PackageManagers } from "m30pm-lib-common";
import * as sh from 'shelljs'

sh.config.silent = true;

export function createProject(project: ProjectConfiguration) {
    console.log(`Creating ${project.name}...`)
    //verify package manager, build tool, and version control tool are installed using sh.which()
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
    //create project directory using project name (should follow oclif pattern; if no directory exists, create directory; if directory exists and empty, continue project creation; if directory exists and is not empty, exit with error stating non-empty directory)
    const projectPath = sh.ls("-d", project.name);
    if (projectPath.length) {
        const projectContents = sh.ls("-A", projectPath.toString())
        if (projectContents.length) {
            console.log(`Cannot create project, ${projectPath} is not empty`)
            sh.exit(1)
        }
    }
    else {
        sh.mkdir(project.name)
    }
    //in project directory, generate selected tool scaffolding (a.k.a., for npm or yarn) (including .npmrc or .yarnrc) for a mono repo (a.k.a., npm/yarn workspaces)
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
    //in project directory, generate scaffolding for build tool (a.k.a., gradle init with gradle file included - s.a., for base set of templates for generating documentation)
    //`gradle init` prompts for project type (basic), dsl (Groovy), project name, Generate build using new API and behavior (--no-incubating)
    let btInit = sh.exec(`${btPath.toString()} init --type basic --dsl groovy --project-name ${project.name} --no-incubating`)
    //in project directory, generate scaffolding for version control tool (a.k.a., git, s.a., .gitignore)
    //perform "best practice" git operations for newly generated project scaffolding git add . git commit -m "Initial commit" (with expanded commit description s.a., "project generated from...")
    //print out user git command for setting up remote origin (e.g., git remote add origin <git-url>)
    
}

