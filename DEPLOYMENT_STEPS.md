# 🚀 GitHub Pages Deployment - Step by Step Guide

## ✅ What Has Been Fixed

1. ✅ **Next.js Configuration** - Updated `next.config.mjs` for static export
2. ✅ **Vercel Analytics** - Made conditional (won't break on GitHub Pages)
3. ✅ **GitHub Actions Workflow** - Created automated deployment workflow
4. ✅ **Build Test** - Verified static export works correctly

## 📋 Deployment Steps

### Step 1: Set GitHub Secrets

1. Go to your repository: `https://github.com/dabliuweb/eng-software-e-ihc`
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:

   **Secret 1:**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)

   **Secret 2:**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: Your Supabase anon key

4. Click **Add secret** for each one

### Step 2: Enable GitHub Pages

1. In your repository, go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions** (not "Deploy from a branch")
3. Save the settings

### Step 3: Commit and Push Changes

The following files have been created/modified:

```bash
# Modified files
- next.config.mjs (GitHub Pages configuration)
- app/layout.tsx (Analytics wrapper)
- components/analytics-wrapper.tsx (new file)

# New files
- .github/workflows/deploy.yml (GitHub Actions workflow)
- GITHUB_PAGES_DEPLOYMENT.md (analysis document)
- DEPLOYMENT_STEPS.md (this file)
```

Commit and push:

```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

### Step 4: Monitor Deployment

1. Go to your repository on GitHub
2. Click on the **Actions** tab
3. You should see a workflow run called "Deploy to GitHub Pages"
4. Wait for it to complete (usually 2-5 minutes)
5. Once complete, your site will be available at:
   ```
   https://dabliuweb.github.io/eng-software-e-ihc/
   ```

### Step 5: Verify Deployment

1. Visit `https://dabliuweb.github.io/eng-software-e-ihc/`
2. Check that:
   - ✅ Page loads correctly
   - ✅ All assets (CSS, images) load
   - ✅ Supabase connection works (try logging in)
   - ✅ No console errors

## 🔧 Troubleshooting

### Build Fails

**Error: "Missing Supabase environment variables"**
- Solution: Make sure you added the secrets in Step 1
- Check that secret names are exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Error: "Cannot find module"**
- Solution: Make sure `package.json` has all dependencies
- The workflow runs `npm ci` which should install everything

### Assets Not Loading

**Images/CSS not loading (404 errors)**
- Solution: This usually means basePath isn't working
- Check that `next.config.mjs` has the correct basePath: `/eng-software-e-ihc`
- Verify the workflow sets `GITHUB_PAGES=true`

### Supabase Connection Issues

**"Missing Supabase environment variables" error in browser**
- Solution: Environment variables must be prefixed with `NEXT_PUBLIC_` to be available in the browser
- Verify secrets are set correctly in GitHub

**CORS errors**
- Solution: In Supabase Dashboard → Settings → API, add your GitHub Pages URL to allowed origins:
  - `https://dabliuweb.github.io`

## 📝 Manual Deployment (Alternative)

If you prefer to deploy manually:

```bash
# Set environment variables
export GITHUB_PAGES=true
export NEXT_PUBLIC_GITHUB_PAGES=true
export NEXT_PUBLIC_SUPABASE_URL=your_url_here
export NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here

# Build
npm run build

# The output will be in the 'out' directory
# You can then push the 'out' directory to the 'gh-pages' branch
```

## 🔄 Updating the Site

After making changes:

1. Commit your changes
2. Push to the `main` branch
3. GitHub Actions will automatically:
   - Build the site
   - Deploy to GitHub Pages
4. Wait 2-5 minutes for the deployment to complete

## 📊 Expected URLs

- **Repository**: `https://github.com/dabliuweb/eng-software-e-ihc`
- **GitHub Pages**: `https://dabliuweb.github.io/eng-software-e-ihc/`
- **Note**: All internal links automatically use the `/eng-software-e-ihc/` base path

## ⚠️ Important Notes

1. **Base Path**: All assets and routes are prefixed with `/eng-software-e-ihc/`
2. **Environment Variables**: Must be set in GitHub Secrets (not in `.env` files)
3. **Analytics**: Vercel Analytics is disabled on GitHub Pages (by design)
4. **Static Export**: The site is fully static - no server-side features work
5. **Supabase**: Works perfectly since it's client-side only

## ✅ Checklist

Before deploying, ensure:

- [ ] GitHub Secrets are set (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- [ ] GitHub Pages is enabled with "GitHub Actions" as source
- [ ] All changes are committed and pushed
- [ ] You've tested the build locally (optional but recommended)

## 🎉 Success!

Once deployed, your site will be live at:
**https://dabliuweb.github.io/eng-software-e-ihc/**

