# Copilot Instructions

## Package manager

- This repository's CI uses pnpm (see `.github/workflows/deploy.yml`). Automated agents MUST prefer `pnpm` for installing and managing packages to maintain parity with CI.
- Use these commands in generated code or instructions:
  - Install deps: `pnpm install`
  - Add a dependency: `pnpm add <pkg>` or `pnpm add -D <pkg>` for dev deps
  - Remove a dependency: `pnpm remove <pkg>`
  - Run scripts: `pnpm start`, `pnpm test`, `pnpm run build`
- If your edit includes changes to `package.json`, the agent should also update the lockfile by running `pnpm install` and ensure the project still builds (`pnpm run build`) before committing.

## PR and Commit Convention

- PR title and commit messages MUST follow Conventional Commits (https://www.conventionalcommits.org/).
- The PR title should describe what the change does. Use the conventional-commit prefix as the PR title prefix.
- For commits, use the commit body to explain why the change was made and any important implementation notes.
- PR descriptions should be concise: what changed, why, and any migration steps or risk notes. Reference related issues using `#<issue-number>`.
