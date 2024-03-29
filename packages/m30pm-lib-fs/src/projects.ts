import { ProjectConfiguration } from "m30pm-lib-common";
import * as shell from 'shelljs'

export function createProject(project: ProjectConfiguration) {
    console.log(`Creating ${project.name}...`)
    //verify package manager, build tool, and version control tool are installed using shell.which()
    //create project directory using project name (should follow oclif pattern; if no directory exists, create directory; if directory exists and empty, continue project creation; if directory exists and is not empty, exit with error stating non-empty directory)
    shell.mkdir(project.name)
    //in project directory, generate selected tool scaffolding (a.k.a., for npm or yarn) (including .npmrc or .yarnrc) for a mono repo (a.k.a., npm/yarn workspaces) as per
    //in project directory, install linkml schema project (using npm install linkml-schema --save-dev) blocked on
    //add support for adding linkml-schema as package dependency #17
    //in project directory, generate scaffolding for build tool (a.k.a., gradle init with gradle file included - s.a., for base set of templates for generating documentation)
    //in project directory, generate scaffolding for version control tool (a.k.a., git, s.a., .gitignore)
    //perform "best practice" git operations for newly generated project scaffolding git add . git commit -m "Initial commit" (with expanded commit description s.a., "project generated from...")
    //print out user git command for setting up remote origin (e.g., git remote add origin <git-url>)
    
}

