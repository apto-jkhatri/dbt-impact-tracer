# Contributing to dbt Impact Tracer

Thanks for your interest in contributing! We welcome issues, feature requests, and pull requests.

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm 8+

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/apto-jkhatri/dbt-impact-tracer.git
   cd dbt-impact-tracer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Opens http://localhost:5173 in your browser

### Development Commands

```bash
npm run dev          # Start dev server with hot reload
npm test             # Run tests (watch mode)
npm test -- --run    # Run tests once
npm run lint         # Check code style
npm run lint:fix     # Auto-fix style issues
npm run format       # Format code with Prettier
npm run build        # Production build
npm run preview      # Preview production build
```

## Making Changes

### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming:
- `feature/` for new features
- `fix/` for bug fixes
- `docs/` for documentation
- `chore/` for maintenance

### 2. Write Code

**Code Style:**
- ESLint config enforces rules automatically
- Prettier formats code on save
- Run `npm run lint:fix` and `npm run format` before committing

**Component Guidelines:**
- Use functional components with hooks
- Keep components focused and small
- Add comments for complex logic
- Use meaningful variable names

**Algorithm Guidelines:**
- Tests are in `tests/graphTraversal.test.js`
- Document complex algorithms with JSDoc
- Maintain O(V+E) time complexity for graph traversal
- Ensure backward compatibility

### 3. Write Tests

Tests are required for:
- New algorithms or utilities
- Bug fixes (write test that reproduces bug first)
- Edge cases

```bash
npm test  # Watch mode - auto-reruns on file changes
```

Example test:
```javascript
import { describe, it, expect } from 'vitest';
import { analyzeImpactPath } from '../src/utils/graphTraversal';

describe('analyzeImpactPath', () => {
  it('should find simple linear path', () => {
    const models = [
      { uniqueId: 'a', depends_on: [] },
      { uniqueId: 'b', depends_on: ['a'] },
      { uniqueId: 'c', depends_on: ['b'] }
    ];
    
    const result = analyzeImpactPath(new Set(['a']), 'c', models);
    expect(result).toContain('a');
    expect(result).toContain('c');
  });
});
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

Commit message format:
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `test:` tests
- `refactor:` code refactor
- `chore:` maintenance

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Go to GitHub and create a pull request. In the PR description:
- Describe what changed and why
- Reference any related issues (`Fixes #123`)
- Include screenshots for UI changes
- Mention if this breaks anything

## Pull Request Review

A maintainer will review your PR. They may ask for changes. That's normal! Here's what we look for:

- **Code quality** — Follows style guide, no console errors
- **Tests** — New code has tests, all pass
- **Documentation** — Changes are documented
- **Performance** — No performance regressions
- **Backwards compatibility** — No breaking changes (unless major version)

## Testing

### Unit Tests
```bash
npm test                # Watch mode
npm test -- --run      # Single run
npm run test:coverage  # With coverage report
npm run test:ui        # Open UI dashboard
```

Coverage target: **80%+**

### Manual Testing
1. Generate test manifest: `dbt compile` (from any dbt project)
2. Upload manifest in dev app
3. Test selection and analysis

### Real-World Testing
- Test with your own dbt project manifest
- Try edge cases: 
  - Single model
  - Large project (1000+ models)
  - Diamond dependencies
  - Multiple disconnected graphs

## Documentation

Documentation should be added to:
- **README.md** — User-facing features
- **Code comments** — Complex algorithms
- **JSDoc** — Function signatures
- **GitHub Issues/Discussions** — Feature discussions

Example JSDoc:
```javascript
/**
 * Analyze impact path between sources and target
 * @param {Set<string>} sourceIds - Source model IDs
 * @param {string} targetId - Target model ID
 * @param {Array} allModels - All models
 * @returns {Array<string>} - Path model IDs
 */
export function analyzeImpactPath(sourceIds, targetId, allModels) {
  // implementation
}
```

## Reporting Bugs

Found a bug? Please create an issue with:

1. **Clear title** — "Button click doesn't work on mobile"
2. **Description** — What you expected vs. what happened
3. **Steps to reproduce** — Exact steps to recreate
4. **Environment** — OS, browser, Node version
5. **Example manifest** — Attach a sample manifest.json (redacted if needed)

Example:
```
# Button doesn't work on mobile

## Steps to reproduce
1. Open app on iPhone
2. Upload manifest.json
3. Click "Show impact path" button
4. Button doesn't respond

## Expected
Analysis runs and shows results

## Actual
Nothing happens

## Environment
- OS: iOS 16
- Browser: Safari
- Device: iPhone 13
```

## Feature Requests

Have an idea? Open an issue with:
- **What** — What feature do you want?
- **Why** — What problem does it solve?
- **How** — How would you use it?

Example:
```
# Export results as CSV

## What
Add ability to export impact path results as CSV file

## Why
Users want to share results with team members who don't have access to the tool

## How
- "Export CSV" button next to "Download .sh"
- Include: source models, target model, path models, command
```

## Questions?

- **Usage questions** → [GitHub Discussions](https://github.com/apto-jkhatri/dbt-impact-tracer/discussions)
- **Bug reports** → [GitHub Issues](https://github.com/apto-jkhatri/dbt-impact-tracer/issues)
- **Feature ideas** → [GitHub Discussions](https://github.com/apto-jkhatri/dbt-impact-tracer/discussions)

## Release Process (Maintainers)

```bash
# 1. Update version in package.json
npm version patch  # or minor, major

# 2. Create release commit
git add .
git commit -m "chore: bump version to 1.0.1"
git push

# 3. Create GitHub release
# Tag: v1.0.1
# Title: Release 1.0.1
# Description: What changed

# 4. GitHub Actions auto-publishes to npm
```

## License

By contributing, you agree your code will be licensed under the MIT License.

---

**Thank you for contributing! 🎉**
