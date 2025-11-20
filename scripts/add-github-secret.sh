#!/bin/bash

# Add GitHub secret using GitHub API
# This script adds the PAT token as a GitHub secret

set -e

REPO="dabliuweb/eng-software-e-ihc"
PAT_TOKEN="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"
SECRET_NAME="GITHUB_TOKEN"

echo "🔐 Adding GitHub secret: $SECRET_NAME"
echo "Repository: $REPO"
echo ""

# Check if jq is installed (needed for JSON parsing)
if ! command -v jq &> /dev/null; then
    echo "⚠️  jq is not installed. Installing..."
    sudo apt-get update && sudo apt-get install -y jq 2>/dev/null || {
        echo "❌ Please install jq manually: sudo apt-get install jq"
        echo "Or use manual method in QUICK_DEPLOY.md"
        exit 1
    }
fi

echo "📝 Note: This requires your GitHub username and a Personal Access Token"
echo "   with 'repo' and 'admin:repo' permissions."
echo ""
read -p "GitHub Username: " GITHUB_USER
read -sp "Your GitHub PAT (with repo permissions): " USER_PAT
echo ""

# Get repository public key
echo "🔑 Fetching repository public key..."
PUBLIC_KEY_RESPONSE=$(curl -s -H "Authorization: token $USER_PAT" \
    "https://api.github.com/repos/$REPO/actions/secrets/public-key")

PUBLIC_KEY=$(echo $PUBLIC_KEY_RESPONSE | jq -r '.key')
KEY_ID=$(echo $PUBLIC_KEY_RESPONSE | jq -r '.key_id')

if [ "$PUBLIC_KEY" == "null" ] || [ -z "$PUBLIC_KEY" ]; then
    echo "❌ Failed to get public key. Check your PAT permissions."
    exit 1
fi

# Encrypt the secret using sodium (requires libsodium)
if command -v python3 &> /dev/null; then
    echo "🔒 Encrypting secret..."
    ENCRYPTED_VALUE=$(python3 -c "
import base64
import json
from nacl import encoding, public

def encrypt(public_key: str, secret_value: str) -> str:
    public_key_bytes = base64.b64decode(public_key)
    public_key_obj = public.PublicKey(public_key_bytes, encoding.Base64Encoder())
    sealed_box = public.SealedBox(public_key_obj)
    encrypted = sealed_box.encrypt(secret_value.encode('utf-8'))
    return base64.b64encode(encrypted).decode('utf-8')

print(encrypt('$PUBLIC_KEY', '$PAT_TOKEN'))
" 2>/dev/null)

    if [ -z "$ENCRYPTED_VALUE" ]; then
        echo "❌ Encryption failed. Install: pip3 install pynacl"
        echo "Or use manual method in QUICK_DEPLOY.md"
        exit 1
    fi

    # Add the secret
    echo "📤 Uploading secret..."
    RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT \
        -H "Authorization: token $USER_PAT" \
        -H "Accept: application/vnd.github.v3+json" \
        "https://api.github.com/repos/$REPO/actions/secrets/$SECRET_NAME" \
        -d "{\"encrypted_value\":\"$ENCRYPTED_VALUE\",\"key_id\":\"$KEY_ID\"}")

    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    
    if [ "$HTTP_CODE" == "201" ] || [ "$HTTP_CODE" == "204" ]; then
        echo "✅ Secret '$SECRET_NAME' added successfully!"
    else
        echo "❌ Failed to add secret. HTTP Code: $HTTP_CODE"
        echo "Response: $(echo "$RESPONSE" | head -n-1)"
        exit 1
    fi
else
    echo "❌ Python3 not found. Please use manual method in QUICK_DEPLOY.md"
    exit 1
fi

echo ""
echo "✅ Setup complete!"
echo "⚠️  Don't forget to add Supabase secrets manually:"
echo "   https://github.com/$REPO/settings/secrets/actions"

