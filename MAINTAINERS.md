# Release Process

- Close all issues for planned release
- Checkout and pull `main` branch in git from origin
- Run `npm version <semver-pre-release, e.g., 1.0.0>` (Update in package.json to be a semver pre-release, then commit, tag with semver pre-release and auto run `git push && git push --tags`)
  - Triggers CI build from tag to call `npm run publish` (Publish node package to npm registry)
- Verify pre-released package
  - Create a temporary node project
  - In temporary project, run `npm install m30pm`
  - Inspect that m30pm CLI app is installed as expected
- Run `npm version <semver-release, e.g., 1.0.0>` (Update in package.json to be a semver release, then commit, tag with semver release and auto run `git push && git push --tags`)
  - Triggers CI build from tag to call `npm run publish` (Publish node package to npm registry)
- Create new release (on GitHub)
  - select (final release) tag
  - auto-generate release notes
  - publish final release

