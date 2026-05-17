# README

## dbt Impact Tracer

> Visualize dbt dependency paths and run only the models affected by your changes.

**Problem:** With 100+ dbt models, running `dbt build -s model+` can rebuild 200+ models when you only changed one intermediate model.

**Solution:** dbt Impact Tracer finds the **minimal set of models** you actually need to rebuild.

---

## ✨ Features

- 🎯 **Two-way model selection** — Select source models (what you changed) and target model (what you want to verify)
- 📊 **Smart graph traversal** — Finds all paths between sources and target in your dependency graph
- ⚡ **Instant commands** — Auto-generates optimized `dbt build --select` commands
- 🏠 **Works locally** — Everything runs in your browser, no cloud required
- 📦 **Zero external dependencies** — Core algorithm is pure JavaScript
- 🔄 **Offline support** — No analytics, no tracking, completely private

---

## 🚀 Quick Start

### Online Demo (No Installation)

Visit: **[dbt-impact-tracer.dev](https://dbt-impact-tracer.dev)**

### Local Installation

```bash
# Clone repository
git clone https://github.com/your-username/dbt-impact-tracer.git
cd dbt-impact-tracer

# Install dependencies
npm install

# Start development server
npm run dev

# Opens at http://localhost:5173
```

---

## 📖 How to Use

### Step 1: Generate manifest.json

```bash
cd your_dbt_project
dbt compile
# Creates: target/manifest.json
```

### Step 2: Open dbt Impact Tracer

Visit [dbt-impact-tracer.dev](https://dbt-impact-tracer.dev) or run locally

### Step 3: Upload manifest.json

Click the upload area and select your `target/manifest.json` file

### Step 4: Select Models

**Left panel (Source models):**
- Check the models you changed
- Example: `fct_monthly_payments`, `fct_monthly_voip`

**Right panel (Target model):**
- Select one model to check impact
- Example: `union_monthly_mrr_evolution_model`

### Step 5: Trace Impact

Click **"Show impact path"** to see:
- Number of models affected
- Dependency chain visualization
- Optimized `dbt build --select` command

### Step 6: Run in dbt

Copy the command and run:

```bash
dbt build --select fct_monthly_payments fct_monthly_voip inter_calc union_mrr
```

**Instead of 240 models → 4 models** ✅

---

## 📊 Example

### Before (Without Impact Tracer)
```bash
dbt build -s fct_payments+ fct_voip+
# Rebuilds: 240+ models 😱
# Time: 45+ minutes
```

### After (With Impact Tracer)
```bash
dbt build --select fct_payments fct_voip inter_calc union_mrr
# Rebuilds: 4 models ✨
# Time: 2-3 minutes
# Savings: ~98% faster
```

---

## 🔧 How It Works

### Algorithm: Two-Pass Graph Traversal

1. **Backward Pass** — From target, find all dependencies leading to it
2. **Forward Pass** — From sources, find all models reachable from them
3. **Intersection** — Return models in both sets = minimal path

**Time Complexity:** O(V + E) where V = models, E = dependencies

**Space Complexity:** O(V)

### Example

```
Sources:        fct_a, fct_b
                  ↓      ↓
Intermediates:  inter_a, inter_b
                  ↓      ↓
Unrelated:      other_a  (not in path)
                
Target:         union_model ✓

Result: [fct_a, fct_b, inter_a, inter_b, union_model]
Excluded: [other_a] (not reachable from sources)
```

---

## 📦 Distribution

### npm Package
```bash
npm install -g dbt-impact-tracer
dbt-impact-tracer
```

### Vercel Hosting
```
https://dbt-impact-tracer.dev
```

### Docker (Coming Soon)
```bash
docker run -p 5173:5173 dbt-impact-tracer
```

---

## 🛠️ Development

### Setup
```bash
npm install
npm run dev       # Start dev server
npm test          # Run tests (watch)
npm test -- --run # Run tests once
npm run lint      # Check code style
npm run build     # Production build
```

### Project Structure
```
dbt-impact-tracer/
├── src/
│   ├── components/
│   │   ├── ManifestUploader.jsx
│   │   ├── ModelSelector.jsx
│   │   └── ImpactAnalyzer.jsx
│   ├── utils/
│   │   └── graphTraversal.js      # Core algorithm
│   ├── styles/
│   │   └── main.css
│   ├── App.jsx
│   └── main.jsx
├── public/
│   ├── index.html
│   └── favicon.svg
├── tests/
│   └── graphTraversal.test.js
├── .github/
│   └── workflows/
│       └── ci.yml
├── package.json
├── vite.config.js
├── .eslintrc.json
└── README.md
```

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

**Ways to contribute:**
- Report bugs
- Suggest features
- Improve documentation
- Write tests
- Submit code improvements

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file

---

## 🙏 Acknowledgments

Built for the dbt community. Inspired by the need to optimize large dbt projects.

---

## 📞 Support

- 📖 [Documentation](#)
- 🐛 [Report Issues](https://github.com/apto-jkhatri/dbt-impact-tracer/issues)
- 💬 [Discussions](https://github.com/apto-jkhatri/dbt-impact-tracer/discussions)
- 🌐 [Website](https://dbt-impact-tracer.dev)

---

**Made with ❤️ for the dbt community**
