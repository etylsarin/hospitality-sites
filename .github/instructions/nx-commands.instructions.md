---
description: 'NX workspace commands and conventions for all development tasks'
applyTo: '**'
---

# NX Workspace Commands Guide

## 🚨 Critical Rule

**NEVER use generic npm/npx/jest commands in this NX workspace. Always use yarn nx commands.**

## Required Commands

### Testing

```bash
yarn nx run <project-name>:test
yarn nx run <project-name>:test --coverage
yarn nx run <project-name>:test -u  # update snapshots
yarn nx affected -t test
```

### Linting

```bash
yarn nx run <project-name>:lint --fix
yarn nx run <project-name>:lint-styles --fix
yarn nx affected -t lint
```

### Building

```bash
yarn nx run <project-name>:build
yarn nx affected -t build
```

### Serving/Development

```bash
yarn nx run <project-name>:serve
yarn nx run <project-name>:dev
```

### Code Generation

```bash
yarn nx generate <generator-name>
yarn nx g <generator-name>
```

### Affected Command Pattern

```bash
yarn nx affected -t <target>
```

## ❌ Forbidden Commands

```bash
# Never use these in this NX workspace:
npm test | npm run test | npm run lint | npm run build
npm run dev | npm start | npx jest | npx eslint
jest --coverage | eslint --fix
```

## Requirements by Task

### Testing

- **Minimum Coverage**: 95% for all new components and functions
- **Coverage Reports**: Generated in `reports/coverage/jest/` folder after running tests
- **Coverage Check**: Always verify coverage meets requirements before considering task complete

### Linting

- **Code Linting**: Use `yarn nx run <project-name>:lint --fix` for TypeScript/JavaScript files
- **Style Linting**: Use `yarn nx run <project-name>:lint-styles --fix` for CSS/SCSS files
- **Auto-fix**: Always use `--fix` flag to automatically resolve fixable issues

### Building

- **Production Builds**: Use `yarn nx run <project-name>:build` for production builds
- **Development**: Use `yarn nx run <project-name>:serve` for development servers
- **Affected Strategy**: Use `yarn nx affected -t build` when changes affect multiple projects

## Best Practices

1. **Command Structure**: Always use `yarn nx run <project-name>:<target>` format
2. **Affected Strategy**: Use `yarn nx affected -t <target>` when changes affect multiple projects
3. **Project Names**: Use exact project names as defined in `project.json` files
4. **Parallel Execution**: NX automatically optimizes task execution and caching
5. **Error Handling**: Review NX output for detailed error messages and suggestions

## Workspace Structure

- **Apps**: Located in `apps/` directory (tastebeer.eu, tastecoffee.eu, cms-studio, backend)
- **Libraries**: Located in `libs/` directory
- **UI Components**: Reusable UI components in `libs/ui-kit/`
- **Data Queries**: Sanity queries and data fetching in `libs/queries/`

## CI/CD Integration

- All tasks must pass before any PR can be merged
- Coverage requirements are enforced in CI pipeline, the coverage must not drop comparing the previous commit
- Failed builds, tests, or linting will block deployment
- NX affected commands optimize CI performance by only running tasks for changed code

Remember: Following these NX workspace conventions ensures consistency across the entire development team, maintains code quality standards, and leverages NX's powerful caching and affected change detection.
