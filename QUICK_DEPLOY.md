# 🚀 Quick Deploy to GitHub Pages

## ✅ Automated Setup (Using GitHub CLI)

If you have GitHub CLI installed:

```bash
chmod +x scripts/setup-github-secrets.sh
./scripts/setup-github-secrets.sh
```

## 📋 Manual Setup (3 Steps)

### Step 1: Add GitHub Secrets

Go to: **https://github.com/dabliuweb/eng-software-e-ihc/settings/secrets/actions**

Click **"New repository secret"** and add:

1. **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Your Supabase project URL
   - Example: `https://xxxxx.supabase.co`

2. **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: Your Supabase anon key
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. **Name**: `GITHUB_TOKEN` (optional - workflow uses built-in token)
   - **Value**: `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`
   - Note: This is your PAT token (already provided)

### Step 2: Enable GitHub Pages

1. Go to: **https://github.com/dabliuweb/eng-software-e-ihc/settings/pages**
2. Under **Source**, select: **GitHub Actions**
3. Click **Save**

### Step 3: Deploy

```bash
git add .
git commit -m "Ready for GitHub Pages deployment"
git push origin main
```

## 🎯 What Happens Next

1. GitHub Actions will automatically:
   - Build your Next.js app
   - Export static files
   - Deploy to GitHub Pages

2. Wait 2-5 minutes for deployment

3. Your site will be live at:
   **https://dabliuweb.github.io/eng-software-e-ihc/**

## 🔍 Monitor Deployment

- Go to: **https://github.com/dabliuweb/eng-software-e-ihc/actions**
- Watch the "Deploy to GitHub Pages" workflow
- Green checkmark = Success! ✅

## ⚠️ Important Notes

- **PAT Token**: Already configured in the script (not committed to repo)
- **Supabase Secrets**: You MUST add these manually (they're not in the script for security)
- **First Deploy**: May take 5-10 minutes
- **Subsequent Deploys**: Usually 2-5 minutes

## 🐛 Troubleshooting

**Build fails with "Missing Supabase variables"**
→ Add the Supabase secrets in Step 1

**Assets not loading (404 errors)**
→ Check that GitHub Pages source is set to "GitHub Actions" (not branch)

**Deployment stuck**
→ Check Actions tab for error messages

