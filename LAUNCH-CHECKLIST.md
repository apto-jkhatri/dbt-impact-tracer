# 🚀 dbt Impact Tracer - Launch Checklist

## Pre-Launch (You Now)

### Step 1: Prepare Your Code
```bash
# Clone/create your repo
mkdir dbt-impact-tracer
cd dbt-impact-tracer
git init

# Copy the files from this guide:
# - package.json
# - README.md
# - LICENSE (choose MIT or Apache 2.0)
# - Your React component code into src/

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

### Step 2: Create GitHub Repository

**Option A: Web UI (Easiest)**
1. Go to https://github.com/new
2. Repository name: `dbt-impact-tracer`
3. Description: "Visualize dbt dependency paths and run only the models affected by your changes"
4. Choose **Public**
5. Add `.gitignore` (select Node.js template)
6. Add license (MIT)
7. Click "Create repository"

**Option B: GitHub CLI**
```bash
gh repo create dbt-impact-tracer --public --source=. --remote=origin --push
```

### Step 3: Set Up Repository Files

Create these files in your repo root:

**`.gitignore`** (if not auto-created)
```
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
```

**`LICENSE`** (copy MIT or Apache 2.0 from github.com/licenses/)

**`.github/workflows/cicd.yml`** (see provided template)

**`CONTRIBUTING.md`**
```markdown
# Contributing

Thanks for your interest! 

## Development Setup
```bash
npm install
npm run dev
npm test
```

## Making Changes
1. Fork repo
2. Create branch: `git checkout -b feature/my-feature`
3. Make changes
4. Write tests
5. Run `npm test` and `npm run lint`
6. Push and create PR

## Code Style
- ESLint + Prettier
- Run `npm run format` to auto-format
```

**`CODE_OF_CONDUCT.md`**
```markdown
# Contributor Covenant Code of Conduct

## Our Pledge

We are committed to providing a welcoming environment for all contributors...

## Our Standards

Examples of behavior that contributes to a positive environment:
- Using welcoming and inclusive language
- Being respectful of differing opinions
- Accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Unacceptable behavior includes:
- Harassment of any kind
- Discriminatory language
- Personal attacks

## Enforcement

Report conduct issues to [your-email]
```

### Step 4: Set Up Secrets for CI/CD

Go to **Settings → Secrets and variables → Actions**

Add these secrets:

1. **`NPM_TOKEN`**
   - Generate at https://www.npmjs.com/settings/tokens
   - Create "Automation" token
   - Paste here

2. **`VERCEL_TOKEN`** (optional, for demo deployment)
   - Create at https://vercel.com/account/tokens
   - Create new token
   - Paste here

### Step 5: Push to GitHub

```bash
git add .
git commit -m "Initial commit: dbt impact tracer"
git branch -M main
git remote add origin https://github.com/your-username/dbt-impact-tracer.git
git push -u origin main
```

### Step 6: Enable GitHub Pages (for documentation)

1. Go to **Settings → Pages**
2. Source: Deploy from a branch
3. Branch: `main` → folder `./docs`
4. Custom domain: `dbt-impact-tracer.dev` (optional, costs $12/yr)

---

## Launch Week

### Day 1: Verify Everything Works
- [ ] GitHub Actions tests pass
- [ ] Build succeeds
- [ ] Demo deploys (if using Vercel)
- [ ] README is complete

### Day 2: Create Release

```bash
# Tag version
git tag -a v1.0.0 -m "First release: dbt impact tracer"
git push origin v1.0.0

# GitHub Action auto-publishes to npm
```

**Or manually publish to npm:**
```bash
npm login  # Enter npm credentials
npm publish
```

Verify: https://www.npmjs.com/package/dbt-impact-tracer

### Day 3-4: Announce

#### Post on GitHub Discussions
1. Go to your repo → **Discussions** tab
2. New discussion
3. Title: "Introducing dbt Impact Tracer!"
4. Write announcement (see template below)

#### Post in dbt Community Slack
- Channel: `#tools-discussion`
- Message:
```
🎉 New tool: dbt Impact Tracer

Trace impact paths in your dbt project and run only the models you need to rebuild.

Upload your manifest.json → Select source & target models → Get optimized dbt build command

Demo: https://dbt-impact-tracer.dev
GitHub: https://github.com/your-username/dbt-impact-tracer
npm: npm install -g dbt-impact-tracer

Open source, MIT licensed. Feedback welcome!
```

#### Tweet/X Post
```
🎉 Introducing dbt Impact Tracer! 📊

Stop rebuilding 240 models when you only changed 4.

✨ Features:
📁 Upload manifest.json
🎯 Select source & target models
🚀 Get optimized dbt build command

Zero installation: https://dbt-impact-tracer.dev
Open source: https://github.com/your-username/dbt-impact-tracer

@getdbt #dataengineering
```

#### Post on Reddit
- Subreddit: `r/dataengineering`
- Title: "Built a tool to optimize dbt builds: dbt Impact Tracer"
- Post link + description
- Be genuine, not spammy

#### Add to Awesome Lists
- Edit: https://github.com/dbt-labs/awesome-dbt
- Add: `[dbt Impact Tracer](https://github.com/your-username/dbt-impact-tracer) - Visualize and trace dbt dependencies`
- Create PR

#### Submit to dbt Package Hub (Optional)
- If applicable: https://hub.getdbt.com/
- or write blog post

---

## Post-Launch

### Week 1-2: Monitor & Respond
- [ ] Watch GitHub Issues
- [ ] Answer questions in Discussions
- [ ] Fix any bugs reported
- [ ] Update README based on feedback

### Month 1: Build Community
- [ ] Respond to all PRs within 24h
- [ ] Write blog post about the algorithm
- [ ] Create demo video (short clip)
- [ ] Add examples to docs

### Ongoing
- [ ] Keep dependencies updated (`npm audit`)
- [ ] Monitor GitHub Trending (celebratory!)
- [ ] Quarterly releases with new features
- [ ] Engage with users

---

## Expected Metrics

**After 1 month:**
- 50-200 GitHub stars ⭐
- 100-500 npm downloads

**After 3 months:**
- 500+ GitHub stars
- 1000+ npm downloads
- Mentions in dbt blogs/newsletters

**After 1 year:**
- 1000+ stars
- Featured in dbt ecosystem

---

## Troubleshooting

### "npm publish fails"
```bash
# Check you're logged in
npm whoami

# If not:
npm login

# Try again
npm publish
```

### "GitHub Actions don't trigger"
- Check `.github/workflows/` files are correctly named
- Verify secrets are set (Settings → Secrets)
- Check branch protection rules aren't blocking

### "Vercel deployment fails"
- Install Vercel CLI: `npm i -g vercel`
- Link project: `vercel link`
- Set environment variables in Vercel dashboard

---

## Support

Need help with any of this? I can:
- Write your GitHub documentation
- Set up the CI/CD pipeline
- Create sample issues/discussions
- Write your launch announcements
- Set up automated releases

Just ask! 🚀
