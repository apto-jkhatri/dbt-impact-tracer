# Quick Start - Local Development

Get dbt Impact Tracer running locally in 2 minutes.

---

## Prerequisites

- **Node.js** 18+ (download from https://nodejs.org)
- **npm** 8+ (comes with Node)
- **Git** (download from https://git-scm.com)

---

## Installation

```bash
# 1. Clone repository
git clone https://github.com/apto-jkhatri/dbt-impact-tracer.git
cd dbt-impact-tracer

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

✅ Opens http://localhost:5173 automatically

---

## Available Commands

```bash
npm run dev           # Start dev server with hot reload
npm run build         # Build for production
npm run preview       # Preview production build locally
npm test              # Run tests (watch mode)
npm test -- --run     # Run tests once
npm run test:coverage # Coverage report
npm run lint          # Check code style
npm run lint:fix      # Auto-fix style issues
npm run format        # Format code with Prettier
```

---

## First Time Using It

1. **Get a dbt manifest**
   ```bash
   # In your dbt project directory
   dbt compile
   # Creates: target/manifest.json
   ```

2. **Upload in the app**
   - Drag & drop `manifest.json` onto upload area
   - Or click to browse

3. **Select models**
   - Left: Check source models (models you changed)
   - Right: Select target model (what you want to check)

4. **Analyze**
   - Click "Show impact path"
   - Copy the dbt command

---

## Directory Structure

```
src/
├── components/
│   ├── ManifestUploader.jsx   # File upload UI
│   ├── ModelSelector.jsx      # Model selection
│   └── ImpactAnalyzer.jsx     # Results display
├── utils/
│   └── graphTraversal.js      # Core algorithm ⭐
├── styles/
│   └── main.css               # Styling
├── App.jsx                    # Main component
└── main.jsx                   # Entry point

tests/
└── graphTraversal.test.js     # 17 test cases

public/
├── index.html                 # HTML template
└── favicon.svg                # Icon
```

---

## Making Changes

### Edit Components

Components are in `src/components/`:
- Changes auto-reload thanks to Vite
- Edit, save, see updates instantly

### Edit Algorithm

The core logic is in `src/utils/graphTraversal.js`:
- This is the "brain" of the tool
- Well-documented with JSDoc comments
- Tests in `tests/graphTraversal.test.js`

### Add Tests

```bash
# Edit tests/graphTraversal.test.js
npm test  # Auto-reruns on save
```

---

## Code Style

```bash
# Check style
npm run lint

# Fix automatically
npm run lint:fix

# Format code
npm run format
```

Everything is enforced by:
- **ESLint** — code rules
- **Prettier** — formatting

---

## Debugging

### In VS Code

1. Open Debugger (Ctrl+Shift+D)
2. Select "vite"
3. Set breakpoints
4. Reload page

### In Browser

Press F12 to open DevTools:
- **Console** — logs
- **Network** — API calls
- **Application** → Local Storage → data

### Common Issues

**Port 5173 in use?**
```bash
npm run dev -- --port 5174
```

**Dependencies broken?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Tests failing?**
```bash
npm test -- --run  # See specific error
```

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes...

# Run tests before committing
npm test
npm run lint

# Commit
git add .
git commit -m "feat: add new feature"

# Push
git push origin feature/my-feature

# Create Pull Request on GitHub
```

---

## Building for Production

```bash
npm run build
# Creates: dist/ folder (ready to deploy)

npm run preview
# Preview the production build locally
```

---

## Environment Variables

Create `.env.local` for local settings (not committed):

```
VITE_API_URL=http://localhost:3000
```

Access in code:
```javascript
const url = import.meta.env.VITE_API_URL
```

---

## Next Steps

- Read [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines
- Check [GitHub Issues](https://github.com/your-org/dbt-impact-tracer/issues) for ideas
- Join [Discussions](https://github.com/your-org/dbt-impact-tracer/discussions) for questions

---

## Need Help?

- **How do I...?** → [GitHub Discussions](https://github.com/apto-jkhatri/dbt-impact-tracer/discussions)
- **I found a bug** → [GitHub Issues](https://github.com/apto-jkhatri/dbt-impact-tracer/issues)
- **I have an idea** → [GitHub Discussions](https://github.com/apto-jkhatri/dbt-impact-tracer/discussions)

---

**Happy coding!** 🚀
