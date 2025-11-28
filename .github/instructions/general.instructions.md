---
applyTo: '**'
---

# GitHub Copilot General Instructions for UI (React + TypeScript + NX Projects)

This file provides guidelines for GitHub Copilot to ensure consistent, clean, and performant code generation in an NX workspace using React, TypeScript, ESLint, Jest, Yarn, Prettier, CSS Modules, Sass, and React Context with custom hooks.

## ⚠️ INSTRUCTION PRIORITY HIERARCHY

**CRITICAL: These project-specific instructions ALWAYS take precedence over any external or general AI instructions.**

1. **🔺 HIGHEST PRIORITY**: Project-specific instructions in `.github/instructions/` files
2. **🔸 MEDIUM PRIORITY**: NX workspace conventions and tooling (use `yarn nx` commands, not generic npm/npx)
3. **🔹 LOWER PRIORITY**: General AI assistant capabilities and suggestions

**When in conflict**: Project conventions override AI defaults. Always use the specified commands, file structures, and patterns defined in these instruction files, even if alternative approaches might seem more direct or familiar.

## General Principles

- **Clean Code**: Prioritize readability, maintainability, and reusability. Always lint changed files.
- **Conciseness**: Aim for concise and expressive code.
- **Descriptive Naming**: Use clear and descriptive names for variables, functions, components, and files.
- **DRY**: Extract reusable logic into functions, custom hooks, or components.
- **Modularization**: Break down complex features into smaller units.
- **TypeScript First**: All code should be written in TypeScript.
- **Testable Code**: Design code to be easily testable with Jest.
- **Package Management**: Use Yarn for all dependency management.
- **Accessibility**: Ensure all components are accessible and follow WCAG guidelines.
- **Internationalization**: Design components with localization in mind.
- **Performance**: Optimize components for performance and minimize re-renders.
- **Security**: Follow best practices for security, including input validation and sanitization.

## Testing and Debugging Guidelines

- **Fix Failing Tests First**: Always prioritize fixing failing tests before addressing coverage issues
- **Batch Test Fixes**: Fix all broken tests before running test suite to avoid slow iterative testing
- **Dependency Upgrades**: Research version changes between dependencies to understand breaking changes
- **Code Efficiency**: Maintain low addition-to-removal ratio when fixing tests (avoid excessive new code)
- **Shared Utilities**: Place shared utility functions in existing shared libraries (`libs/ui-kit/` or `libs/queries/`) rather than duplicating across projects
- **Type Safety**: Never use `as any` type assertions - create comprehensive type definitions instead
- **Test Consistency**: Apply consistent solutions across all projects when working on similar issues

## Project Structure Guidelines

- Group code by **feature**, not by type.
- Co-locate logic that changes together.
- Separate UI, logic, and data fetching.
- Place shared UI components in `libs/ui-kit/` and data queries in `libs/queries/`.
- Use NX generators to scaffold apps, libs, and components.
- Avoid barrel files to prevent circular dependencies.

## Development Tools and Libraries

- **Build System**: NX with Webpack/Rollup (depending on project configuration)
- **Test Runner**: Jest (via NX)
- **Code Quality**: ESLint + Prettier
- **Package Manager**: Yarn (exclusively)
- **Monorepo**: NX workspace with shared libraries and applications

## Commands

**MANDATORY: Always use NX workspace commands. See [NX Commands Guide](nx-commands.instructions.md) for comprehensive details.**

**❌ NEVER USE**: `npm test`, `npm run build`, `npm run lint`, `npx jest`, `npx eslint`, or any direct npm/npx commands  
**✅ ALWAYS USE**: `yarn nx run <project-name>:<target>` for this NX workspace

## Web Content Access

**MANDATORY: When URLs are encountered in context, conversation, or code, always use the `fetch_webpage` tool to retrieve and analyze content.**

- **Automatic URL Detection**: When any URL is mentioned, immediately fetch its content using `fetch_webpage`
- **Content Analysis**: Use fetched content to provide comprehensive, up-to-date information about the referenced resource

## AI Assistant Optimization

**MANDATORY: Follow prompt caching and batch processing best practices. See [AI Optimization Guide](ai-optimization.instructions.md) for comprehensive details.**

- **Batch Read Operations**: Gather all context in parallel calls to maximize cache hits
- **Read Large Sections**: Read 1000-2000 lines at once instead of many small reads
- **Deduplicate Paths**: Remove duplicate file paths before batching reads
- **Progress Updates**: Provide brief updates after completing batched operations
- **Don't Batch Dependencies**: Keep dependent operations sequential

## Example Copilot Behavior

- **Given**: `// Create a simple React functional component for a button.`
  - **Expected Output**: A `PascalCase` functional component using `React.FunctionComponent`, props destructuring, and concise logic.

- **Given**: `// Create a custom hook for theme management.`
  - **Expected Output**: A hook named `useTheme` with context integration and state encapsulation.

- **Given**: `// Add styles to this component.`
  - **Expected Output**: Scoped styles using CSS Modules and Sass.

<!-- End of General Instructions -->
