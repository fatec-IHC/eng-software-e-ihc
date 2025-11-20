# GitHub Pages Deployment Analysis & Plan

## 🔍 Dry Run Analysis

### ✅ **What Works:**
1. **Client-Side App**: The entire app uses `'use client'` directive - perfect for static export
2. **No API Routes**: No server-side API routes found - compatible with static hosting
3. **Supabase Client-Side**: Uses `createBrowserClient` - works perfectly with static export
4. **Images Unoptimized**: Already configured with `unoptimized: true` - good for static export
5. **Build Success**: Current build completes successfully

### ⚠️ **Identified Pitfalls:**

#### 1. **Vercel Analytics Dependency**
- **Issue**: `@vercel/analytics/next` is imported in `app/layout.tsx` (line 3)
- **Impact**: Will cause build errors or runtime errors on GitHub Pages
- **Solution**: Conditionally load Analytics only when on Vercel, or remove it

#### 2. **Static Export Not Configured**
- **Issue**: Next.js is not configured for static export
- **Impact**: Build won't generate static files for GitHub Pages
- **Solution**: Add `output: 'export'` to `next.config.mjs`

#### 3. **Base Path Configuration**
- **Issue**: GitHub Pages serves from subdirectory: `https://dabliuweb.github.io/eng-software-e-ihc/`
- **Impact**: All assets (CSS, JS, images) will have wrong paths
- **Solution**: Configure `basePath: '/eng-software-e-ihc'` in `next.config.mjs`

#### 4. **Environment Variables**
- **Issue**: Environment variables need to be available during build
- **Impact**: Build will fail or app won't connect to Supabase
- **Solution**: Use GitHub Secrets and inject them during build

#### 5. **GitHub Actions Workflow**
- **Issue**: No automated deployment workflow exists
- **Impact**: Manual deployment required after each push
- **Solution**: Create GitHub Actions workflow for automated deployment

#### 6. **Asset Paths in Metadata**
- **Issue**: Icon paths in `layout.tsx` use absolute paths (`/logo.jpg`)
- **Impact**: Icons won't load correctly with basePath
- **Solution**: Use relative paths or ensure basePath is applied

## 📋 Deployment Plan

### Phase 1: Configuration Changes

#### Step 1.1: Update `next.config.mjs`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static export
  basePath: process.env.GITHUB_PAGES ? '/eng-software-e-ihc' : '',  // Subdirectory for GitHub Pages
  assetPrefix: process.env.GITHUB_PAGES ? '/eng-software-e-ihc' : '',  // Asset prefix
  images: {
    unoptimized: true,
  },
  trailingSlash: true,  // GitHub Pages works better with trailing slashes
}

export default nextConfig
```

#### Step 1.2: Fix Vercel Analytics
- Option A: Conditionally load Analytics (recommended)
- Option B: Remove Analytics completely

#### Step 1.3: Update Package.json
Add export script:
```json
"scripts": {
  "export": "next build",
  "deploy": "npm run export"
}
```

### Phase 2: GitHub Configuration

#### Step 2.1: Set GitHub Secrets
1. Go to repository Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Step 2.2: Enable GitHub Pages
1. Go to repository Settings → Pages
2. Source: GitHub Actions
3. Branch: main (or your default branch)

### Phase 3: GitHub Actions Workflow

Create `.github/workflows/deploy.yml` to:
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Set environment variables from secrets
5. Build with static export
6. Deploy to `gh-pages` branch

### Phase 4: Testing

1. Test build locally with basePath
2. Test deployment workflow
3. Verify all assets load correctly
4. Test Supabase connection

## 🚨 Critical Issues to Fix

### Priority 1 (Must Fix):
1. ✅ Configure static export
2. ✅ Fix Vercel Analytics
3. ✅ Configure basePath
4. ✅ Create GitHub Actions workflow

### Priority 2 (Should Fix):
1. ✅ Set up GitHub Secrets
2. ✅ Test asset paths
3. ✅ Verify environment variables

## 📝 Implementation Checklist

- [ ] Update `next.config.mjs` with static export config
- [ ] Fix Vercel Analytics (conditional load or remove)
- [ ] Create GitHub Actions workflow file
- [ ] Add environment variables to GitHub Secrets
- [ ] Test build locally with basePath
- [ ] Push changes and trigger deployment
- [ ] Verify deployment on GitHub Pages
- [ ] Test all functionality (Supabase connection, etc.)

## 🔗 Expected URLs

- **Repository**: `https://github.com/dabliuweb/eng-software-e-ihc`
- **GitHub Pages**: `https://dabliuweb.github.io/eng-software-e-ihc/`
- **Note**: All internal links and assets must account for the `/eng-software-e-ihc/` base path

## ⚡ Quick Start Commands

```bash
# Test build locally with GitHub Pages config
GITHUB_PAGES=true npm run build

# Check output directory
ls -la out/

# Test locally (if you have a simple HTTP server)
cd out && python3 -m http.server 8000
# Then visit http://localhost:8000/eng-software-e-ihc/
```

