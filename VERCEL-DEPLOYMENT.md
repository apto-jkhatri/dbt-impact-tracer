# Vercel Deployment Guide

Deploy dbt Impact Tracer to Vercel for zero-installation demo at https://dbt-impact-tracer.vercel.app/

---

## Option 1: Auto-Deployment with GitHub Actions (Recommended)

This is already configured! When you push to `main`, GitHub Actions automatically deploys to Vercel.

### Setup

1. **Create Vercel Account**
   - Go to https://vercel.com/signup
   - Sign up with GitHub

2. **Create Vercel Project**
   ```bash
   npm install -g vercel
   vercel link
   ```

4. **Get Vercel Token**
   - Go to https://vercel.com/account/tokens
   - Create **Authentication Token**
   - Copy token

4. **Add to GitHub Secrets**
   - Go to repo → Settings → Secrets
   - Add secret: `VERCEL_TOKEN`
   - Paste token

5. **Done!**
   - Next time you push to `main`, it auto-deploys
   - Check `.github/workflows/ci.yml` to see how

---

## Option 2: Manual Deployment

### First Time Setup

```bash
# Install Vercel CLI
npm install -g vercel@latest

# Link project
vercel link

# Follow prompts to connect to GitHub repo
```

### Deploy

```bash
# Production deploy
vercel --prod

# Preview deploy
vercel
```

---

## Option 3: Direct GitHub Connection

1. Go to https://vercel.com/new
2. Select **dbt-impact-tracer** repo
3. Click **Import**
4. Set environment variables if needed
5. Click **Deploy**

---

## Custom Domain Setup

To use `dbt-impact-tracer.vercel.app` instead of `dbt-impact-tracer.vercel.app`:

### 1. Buy Domain
- Domain registrar (GoDaddy, Namecheap, etc.)
- Cost: ~$12/year

### 2. Add to Vercel
- Vercel Dashboard → Project Settings → Domains
- Add custom domain
- Follow DNS instructions

### 3. Update DNS Records
In your registrar's DNS settings, add:
- CNAME: points to Vercel deployment

---

## Troubleshooting

### Deployment fails

Check Vercel dashboard logs:
```bash
vercel logs dbt-impact-tracer
```

### Build error

Usually means `npm install` failed:
```bash
npm install --legacy-peer-deps
```

### Environment variables not working

Set in Vercel dashboard:
- Settings → Environment Variables

---

## CI/CD Pipeline

When you push to GitHub:

```
git push
    ↓
GitHub Actions triggered
    ↓
npm install
npm run build
npm test
    ↓
If main branch:
  Deploy to Vercel production
  Publish to npm
    ↓
If PR:
  Deploy preview to Vercel
  Run tests
```

---

## Monitor Deployment

1. **GitHub Actions**
   - Repo → Actions tab
   - See build status

2. **Vercel Dashboard**
   - https://vercel.com/dashboard
   - See deployment history
   - View logs

---

## That's It! 🎉

Your app is live at:
- **Production:** https://dbt-impact-tracer.vercel.app/
- **Staging:** https://dbt-impact-tracer-staging.vercel.app

---

**Made for the dbt community** ❤️
