# Contributing to Pediment

## How to Contribute

### Reporting Bugs
1. Check existing issues first
2. Include: environment, steps to reproduce, expected vs actual
3. Add label: `bug`

### Suggesting Enhancements
1. Use case, proposed solution, alternatives considered
2. Add label: `enhancement`

### Good First Issues
Look for issues labeled `good first issue`.

## Development Setup

### Prerequisites
- Bun 1.3+
- Node.js 22+ (for npm publish)

### Fork & Clone
```bash
git clone https://github.com/YOUR_USERNAME/pediment.git
cd pediment
bun install
```

### Running Locally
```bash
# Tokens package
cd packages/tokens && ls src/

# Components package
cd packages/components && ls src/

# Development with a consuming project
cd ../crawlkit/web && npm run dev
```

## Pull Request Process

1. Create an issue first (for non-trivial changes)
2. Branch naming: `feat/`, `fix/`, `docs/`
3. PR checklist:
   - [ ] Tests pass
   - [ ] Lint passes
   - [ ] Documentation updated
4. Review timeline: expect response within 7 days

## Style Guide

### CSS
- Use pediment design tokens (CSS custom properties)
- Follow Spatial Materialism + Amoebic UI patterns
- Use `@layer base, components, utilities` for Tailwind v4

### TypeScript
- Strict TypeScript mode
- Biome for formatting
- No `any` types

### Commits
```
feat: add new component
fix: resolve CSS issue in theme toggle
docs: update token documentation
```
