# dbt Impact Tracer

> Run only the dbt models affected by your changes. Stop rebuilding everything.

---

## The Problem

In large dbt projects (100+ models), a small change to one model can trigger a massive rebuild. Running `dbt build -s model+` often rebuilds 200+ models when only 4 actually need updating.

**This wastes time, compute, and slows down development.**

## The Solution

dbt Impact Tracer analyzes your project's dependency graph and tells you exactly which models to rebuild. You get a ready-to-use `dbt build --select` command with only the models that matter.

**Result:** 98% faster builds during development.

---

## How It Helps During Development

When you're working on a dbt project:

1. You change a model (e.g., `fct_payments`)
2. You want to test if it breaks a downstream model (e.g., `union_mrr`)
3. Instead of rebuilding everything, this tool finds the minimal path between them
4. You run only those 4-5 models instead of 240

**Before:** 45 minutes waiting for a full rebuild  
**After:** 2-3 minutes for targeted rebuild

---

## Try It Now (Free, No Installation)

**[Open dbt Impact Tracer](https://dbt-impact-tracer.dev)**

Use the hosted version directly in your browser. No setup, no installation, completely free.

Your manifest.json never leaves your browser—everything runs locally.

---

## How to Use

### Step 1: Get your manifest

```bash
cd your_dbt_project
dbt compile
```

This creates `target/manifest.json`.

### Step 2: Upload it

Open [dbt-impact-tracer.dev](https://dbt-impact-tracer.dev) and upload your manifest.

### Step 3: Select models

- **Left side:** Check the models you changed (source models)
- **Right side:** Select the model you want to verify (target model)

### Step 4: Get your command

Click **"Show impact path"** and copy the generated command:

```bash
dbt build --select fct_payments inter_calc union_mrr
```

### Step 5: Run it

Paste and run. Done.

---

## Example

**Without Impact Tracer:**
```bash
dbt build -s fct_payments+
# Rebuilds 240 models
# Takes 45 minutes
```

**With Impact Tracer:**
```bash
dbt build --select fct_payments inter_calc union_mrr
# Rebuilds 4 models
# Takes 3 minutes
```

---

## Run Locally (Optional)

If you prefer running it on your machine:

```bash
git clone https://github.com/apto-jkhatri/dbt-impact-tracer.git
cd dbt-impact-tracer
npm install
npm run dev
```

Opens at http://localhost:5173

---

## How It Works

The tool uses a two-pass graph traversal:

1. **Backward pass:** From target, find all upstream dependencies
2. **Forward pass:** From sources, find all downstream models
3. **Intersection:** Models in both sets = the minimal rebuild path

This runs in O(V+E) time, so it's fast even for 1000+ model projects.

---

## Contributing

Found a bug or have an idea? Open an issue or submit a PR.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

MIT License - see [LICENSE](./LICENSE)

---

## Acknowledgments

Built for the dbt community.

Special thanks to my coworkers at **Aptologics** who tested this tool and provided valuable feedback during development.

---

## Support

- 🐛 [Report Issues](https://github.com/apto-jkhatri/dbt-impact-tracer/issues)
- ❤️ [Sponsor on GitHub](https://github.com/sponsors/apto-jkhatri)
- ☕ [Buy Me a Coffee](https://www.buymeacoffee.com/aptojkhatri)

---

**Made with ❤️ by [Jaydeep Khatri](https://www.linkedin.com/in/jaydeepkhatri/)**
