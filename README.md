# dbt Impact Tracer

> Built for dbt developers. Stop rebuilding hundreds of models when only a few are actually affected by your change.

**[🚀 Try it now — free, no installation](https://dbt-impact-tracer.vercel.app/)**

---

## Who This Is For

This is a **dev-time productivity tool** for dbt developers.

If you've ever:
- Made a small change to a model and watched `dbt build -s model+` rebuild 200+ models for 45 minutes
- Wanted to test if your change breaks a specific downstream report without rebuilding everything in between
- Wished `dbt build` was smarter about what it actually needs to run

…this tool is for you.

---

## The Problem It Solves

When you change a dbt model during development and want to verify it correctly flows into a specific downstream model, you usually run something like:

```bash
dbt build -s fct_payments+
```

This rebuilds the **entire downstream lineage** — every model that depends on `fct_payments`, plus all the intermediate transformation models along the way. In larger projects, this can easily mean rebuilding hundreds of models even when only a handful are actually relevant to your change.

**The cost:** time, compute, and slower iteration during development.

---

## What This Tool Does

It finds the **minimal path** between two specific points in your dbt DAG:

- **Source** = the model(s) you changed
- **Target** = the downstream model(s) you want to verify

It returns a ready-to-use `dbt build --select` command containing only the models actually on the path between them — including the intermediate transformations that are required, but skipping everything that isn't.

### Example

| | Models rebuilt | Time |
|---|---|---|
| `dbt build -s fct_payments+` | ~240 | ~45 min |
| With Impact Tracer | 4 | ~3 min |

```bash
# Generated command
dbt build --select fct_payments inter_calc mrr_dashboard
```

That's a **~98% reduction** during development.

---

## How It Works (Under the Hood)

The tool runs a **two-pass graph traversal** on your dbt dependency graph and takes the intersection:

1. **Forward pass (Source → downstream):**  
   Starting from each source model, traverse downstream and collect every model reachable from it.

2. **Backward pass (Target → upstream):**  
   Starting from each target model, traverse upstream and collect every model that feeds into it.

3. **Intersection (source⁺ ∩ ⁺target):**  
   The models that appear in **both** sets are the ones that lie on a real path between source and target. Everything else is noise that `dbt build -s source+` would unnecessarily rebuild.

This runs in **O(V + E)** time, so it's fast even on projects with 1000+ models.

---

## How to Use It

### Step 1 — Generate your manifest

```bash
cd your_dbt_project
dbt compile
```

This creates `target/manifest.json`. It contains your project's full dependency graph.

### Step 2 — Open the app

Go to **[dbt-impact-tracer.vercel.app](https://dbt-impact-tracer.vercel.app/)** and upload `target/manifest.json`.

Your manifest **never leaves your browser** — everything runs locally on the client side.

### Step 3 — Select models

You'll see **two panels** side by side:

#### Left panel — Source models (what you changed)
- Lists every model in your project with a checkbox
- Tick **one or more** models that you've changed
- Use the search box to filter through hundreds of models

#### Right panel — Target models (what you want to verify)
- Same list, with checkboxes
- Tick **one or more** downstream models you want to test
- Multi-select is supported — you can verify the impact on several reports at once

### Step 4 — Trace the impact

Click **"Show impact path"** and you'll get:

- 📊 **Stats:** how many models would be rebuilt with `source+` vs. just the impact path
- 🔀 **Interactive DAG:** color-coded visualization of the dependency chain (sources in blue, intermediates in gray, targets in green)
- 📋 **Ready-to-copy command:** the optimized `dbt build --select ...`

### Step 5 — Run it

Paste the command into your terminal and run. Done.

```bash
dbt build --select fct_payments inter_calc mrr_dashboard
```

### Bonus — Reset and try again

- **"Reset selections"** clears your picks but keeps the manifest loaded, so you can quickly explore other source → target combinations without re-uploading
- **"Upload new manifest"** starts over with a fresh manifest

---

## Why Use This Instead of `dbt build -s model+`

| `dbt build -s model+` | dbt Impact Tracer |
|---|---|
| Rebuilds **everything** downstream | Rebuilds **only what's needed** for your target |
| No visibility into what'll run | Interactive DAG shows exactly what'll run |
| Slow during dev iteration | Fast — focused on the path you care about |
| Hard to plan focused testing | Built for "I want to check X impacts Y" |

This tool isn't a replacement for `dbt build` in production. It's a **development accelerator** for when you're iterating on changes and want fast, targeted feedback.

---

## Run Locally (Optional)

If you'd rather run it on your own machine:

```bash
git clone https://github.com/apto-jkhatri/dbt-impact-tracer.git
cd dbt-impact-tracer
npm install
npm run dev
```

Opens at http://localhost:5173

---

## Privacy

- ✅ Your `manifest.json` is processed **entirely in your browser**
- ✅ Nothing is uploaded to any server
- ✅ No model names, project info, or schema details ever leave your machine
- ✅ Only anonymous, aggregate page-view stats are collected (via Vercel Web Analytics — no cookies)

---

## Contributing

Found a bug or have an idea? Open an issue or submit a PR.  
See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

MIT License — see [LICENSE](./LICENSE)

---

## Acknowledgments

Built for the dbt community.

Special thanks to my coworkers at **Aptologics** who tested this tool during development and gave the early feedback that shaped it.

---

## Support

- 🐛 [Report Issues](https://github.com/apto-jkhatri/dbt-impact-tracer/issues)
- ❤️ [Sponsor on GitHub](https://github.com/sponsors/apto-jkhatri)

---

**Made with ❤️ by [Jaydeep Khatri](https://www.linkedin.com/in/jaydeepkhatri/)**
