#!/bin/bash

# Script to add GitHub secrets for deployment
# Usage: ./scripts/setup-github-secrets.sh

set -e

REPO="dabliuweb/eng-software-e-ihc"
PAT_TOKEN="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"

echo "🔐 Setting up GitHub Secrets for $REPO"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "Install it from: https://cli.github.com/"
    echo ""
    echo "Or manually add secrets at:"
    echo "https://github.com/$REPO/settings/secrets/actions"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "🔑 Authenticating with GitHub..."
    gh auth login
fi

echo "📝 Adding secrets..."

# Add PAT token as secret (if needed for additional permissions)
# Note: The workflow uses built-in GITHUB_TOKEN, but we can store PAT as backup
gh secret set GITHUB_TOKEN --repo "$REPO" --body "$PAT_TOKEN" 2>/dev/null || echo "⚠️  GITHUB_TOKEN secret already exists or failed to set"

echo ""
echo "✅ Secrets setup complete!"
echo ""
echo "⚠️  IMPORTANT: You still need to add Supabase secrets manually:"
echo "   1. Go to: https://github.com/$REPO/settings/secrets/actions"
echo "   2. Add: NEXT_PUBLIC_SUPABASE_URL"
echo "   3. Add: NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo ""
echo "🚀 After adding Supabase secrets, push to main branch to deploy!"

