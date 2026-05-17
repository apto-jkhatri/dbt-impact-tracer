# 📋 dbt Impact Tracer - Pre-Launch Checklist

Complete this before pushing to GitHub.

---

## ✅ Code & Structure

- [x] `src/components/` — All React components
- [x] `src/utils/graphTraversal.js` — Core algorithm
- [x] `src/styles/main.css` — Styling
- [x] `tests/graphTraversal.test.js` — 17 unit tests
- [x] `public/` — Static assets (favicon, index.html)
- [x] All imports fixed and working

---

## ✅ Configuration Files

- [x] `package.json` — Dependencies, scripts, metadata
- [x] `vite.config.js` — Build configuration
- [x] `.eslintrc.json` — Code style rules
- [x] `.prettierrc` — Code formatting
- [x] `.gitignore` — Git ignore patterns
- [x] `index.html` — Root HTML template

---

## ✅ Documentation

- [x] `README.md` — User guide & features
- [x] `CONTRIBUTING.md` — Developer guide
- [x] `CODE_OF_CONDUCT.md` — Community standards
- [x] `QUICK-START.md` — Local dev setup
- [x] `GITHUB-LAUNCH.md` — GitHub launch steps
- [x] `VERCEL-DEPLOYMENT.md` — Deployment guide
- [x] `LICENSE` — MIT license

---

## ✅ CI/CD Pipeline

- [x] `.github/workflows/ci.yml` — Automated tests, build, deploy
- [x] Test step configured
- [x] Build step configured
- [x] Vercel deploy step configured
- [x] npm publish step configured

---

## 🔧 Before Pushing

### 1. Verify Locally

```bash
npm install
npm run build      # ✅ Should succeed
npm test           # ✅ All tests pass
npm run lint       # ✅ No lint errors
```

### 2. Update Placeholders

Replace all instances of:
- `your-org` → Your GitHub organization/username
- `your-email` → Your contact email (in CODE_OF_CONDUCT)

Check files:
- [ ] `package.json`
- [ ] `README.md`
- [ ] `CONTRIBUTING.md`
- [ ] `GITHUB-LAUNCH.md`
- [ ] `VERCEL-DEPLOYMENT.md`
- [ ] `QUICK-START.md`

### 3. Verify Files Exist

Run in project root:
```bash
ls -la src/components/
ls -la src/utils/
ls -la src/styles/
ls -la tests/
ls -la .github/workflows/
```

Should see:
```
✅ src/components/ManifestUploader.jsx
✅ src/components/ModelSelector.jsx
✅ src/components/ImpactAnalyzer.jsx
✅ src/utils/graphTraversal.js
✅ src/styles/main.css
✅ tests/graphTraversal.test.js
✅ tests/setup.js
✅ .github/workflows/ci.yml
✅ README.md, LICENSE, CONTRIBUTING.md, CODE_OF_CONDUCT.md
✅ package.json, vite.config.js
```

---

## 🚀 Push to GitHub

### 1. Create GitHub Repo

```bash
# Option A: Web UI
# Go to https://github.com/new
# Name: dbt-impact-tracer
# Public

# Option B: CLI
gh repo create dbt-impact-tracer --public --source=. --remote=origin --push
```

### 2. Initial Push

```bash
git init
git add .
git commit -m "Initial commit: dbt-impact-tracer"
git branch -M main
git remote add origin https://github.com/your-org/dbt-impact-tracer.git
git push -u origin main
```

### 3. Verify on GitHub

- [ ] All files visible on GitHub
- [ ] README displays correctly
- [ ] Code appears properly formatted

---

## 🔐 Set Secrets

Go to: Settings → Secrets and variables → Actions

Add:
- [ ] `NPM_TOKEN` (from npm.org)
- [ ] `VERCEL_TOKEN` (from vercel.com) [optional]

---

## ✅ CI/CD Verification

1. Make a test commit:
   ```bash
   git add .
   git commit -m "test: trigger ci"
   git push
   ```

2. Check Actions tab
   - [ ] Tests pass
   - [ ] Build succeeds
   - [ ] All green ✅

---

## 🏷️ Create First Release

```bash
# Create tag
git tag -a v1.0.0 -m "Release v1.0.0"

# Push tag (triggers GitHub Actions → npm publish + Vercel deploy)
git push origin v1.0.0
```

Wait 2-3 minutes, then verify:
```bash
npm info dbt-impact-tracer
# Should show v1.0.0
```

---

## 📢 Announcement

- [ ] Post GitHub Discussion
- [ ] Post dbt Slack #tools-discussion
- [ ] Tweet/X post
- [ ] Reddit r/dataengineering post
- [ ] awesome-dbt PR

Use copy from [GITHUB-LAUNCH.md](./GITHUB-LAUNCH.md)

---

## 📊 Post-Launch (Week 1)

- [ ] Monitor GitHub Issues
- [ ] Answer Discussions
- [ ] Fix any reported bugs
- [ ] Update docs if needed

---

## 🎉 Launch Success Indicators

✅ All items checked above  
✅ Tests pass on GitHub  
✅ npm publish succeeds  
✅ App live at domain  
✅ Community engagement  

---

## 📞 Support

Need help? See:
- [GITHUB-LAUNCH.md](./GITHUB-LAUNCH.md) — GitHub-specific steps
- [QUICK-START.md](./QUICK-START.md) — Local dev setup
- [CONTRIBUTING.md](./CONTRIBUTING.md) — Contributing guidelines

---

**Everything is ready! Time to launch! 🚀**

Follow the steps in order and you'll go from local → GitHub → live in ~1 hour.

---

**Made with ❤️ for the dbt community**
