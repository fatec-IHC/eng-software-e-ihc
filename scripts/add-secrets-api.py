#!/usr/bin/env python3
"""
Add GitHub secrets using the GitHub API
Requires: pip install pynacl requests
"""
import base64
import json
import sys
import requests
from nacl import encoding, public

REPO = "dabliuweb/eng-software-e-ihc"
PAT_TOKEN = "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"

def encrypt_secret(public_key: str, secret_value: str) -> str:
    """Encrypt a Unicode string using the public key."""
    public_key_bytes = base64.b64decode(public_key)
    public_key_obj = public.PublicKey(public_key_bytes, encoding.Base64Encoder())
    sealed_box = public.SealedBox(public_key_obj)
    encrypted = sealed_box.encrypt(secret_value.encode('utf-8'))
    return base64.b64encode(encrypted).decode('utf-8')

def get_public_key(repo: str, token: str):
    """Get repository public key for encryption."""
    url = f"https://api.github.com/repos/{repo}/actions/secrets/public-key"
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json"
    }
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f"Error getting public key: {response.status_code}")
        print(response.text)
        return None, None
    data = response.json()
    return data.get('key'), data.get('key_id')

def add_secret(repo: str, token: str, secret_name: str, secret_value: str):
    """Add a secret to GitHub repository."""
    public_key, key_id = get_public_key(repo, token)
    if not public_key:
        return False
    
    encrypted_value = encrypt_secret(public_key, secret_value)
    
    url = f"https://api.github.com/repos/{repo}/actions/secrets/{secret_name}"
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json"
    }
    data = {
        "encrypted_value": encrypted_value,
        "key_id": key_id
    }
    
    response = requests.put(url, headers=headers, json=data)
    if response.status_code in [201, 204]:
        print(f"✅ Secret '{secret_name}' added successfully!")
        return True
    else:
        print(f"❌ Failed to add secret '{secret_name}': {response.status_code}")
        print(response.text)
        return False

if __name__ == "__main__":
    print(f"🔐 Adding secrets to {REPO}...")
    print("")
    
    # Add GITHUB_TOKEN secret
    success = add_secret(REPO, PAT_TOKEN, "GITHUB_TOKEN", PAT_TOKEN)
    
    if success:
        print("")
        print("⚠️  Note: You still need to add Supabase secrets manually:")
        print("   - NEXT_PUBLIC_SUPABASE_URL")
        print("   - NEXT_PUBLIC_SUPABASE_ANON_KEY")
        print("")
        print("   Go to: https://github.com/dabliuweb/eng-software-e-ihc/settings/secrets/actions")
    else:
        print("")
        print("⚠️  Could not add secret automatically. Please add manually:")
        print("   Go to: https://github.com/dabliuweb/eng-software-e-ihc/settings/secrets/actions")
        print("   Add: GITHUB_TOKEN = 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")

