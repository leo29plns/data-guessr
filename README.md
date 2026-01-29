# DataGuessr

## Prerequisites

This project requires the following tools to be installed on your system:

- **pnpm**  
  [https://pnpm.io/installation](https://pnpm.io/installation)

## Installation

Clone the repository, then install dependencies:

```bash
git clone git@github.com:leo29plns/data-guessr.git
cd data-guessr
pnpm install
```

Node.js will be managed via **pnpm**. Husky hooks ensure the correct Node version is installed automatically when checking out the project.

## Development

Start a local development server:

```bash
pnpm run dev
```

## Quality Checks

This project uses **Biome**, **TypeScript**, and **Vitest** for code quality and testing. Git hooks enforce checks before commits.

## Available Scripts

All available `pnpm run` commands are listed below:

| Command               | Description                                           |
|-----------------------|-------------------------------------------------------|
| `pnpm run dev`        | Start a local development server using `live-server`. |
| `pnpm run lint`       | Run Biome linting checks.                             |
| `pnpm run lint:fix`   | Run Biome linting and automatically fix issues.       |
| `pnpm run format`     | Check code formatting with Biome.                     |
| `pnpm run format:fix` | Format code using Biome and apply changes.            |
| `pnpm run type-check` | Run type checking (`tsc`).                            |
| `pnpm run check`      | Run Biome checks and type checking.                   |
| `pnpm run check:fix`  | Run Biome checks and automatically apply fixes.       |
| `pnpm run test`       | Run the test suite using Vitest.                      |
| `pnpm run prepare`    | Install Git hooks via Husky.                          |

## Git Hooks

Husky is configured with the following hooks:

- **commit-msg**: Enforces conventional commits using Commitlint.
- **pre-commit**: Runs full project checks before allowing a commit.
- **post-checkout**: Ensures the correct Node.js version is installed via nvm and installs dependencies.

## License

See [LICENCE.md](./LICENSE)
