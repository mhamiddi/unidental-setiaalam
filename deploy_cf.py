#!/usr/bin/env python3
"""Direct deploy to Cloudflare Pages via API"""
import os, json, sys, hashlib, urllib.request, urllib.error
from pathlib import Path

ACCOUNT_ID = "1117ea89d1a9e1211f81c01dd5068e6d"
PROJECT = "unidental-setiaalam"
BASE_DIR = "/home/hamiddi/projects/uni-dental"

# Get token from env or use directly
TOKEN = os.environ.get("CF_API_TOKEN_VAL") or os.environ.get("CLOUDFLARE_API_TOKEN") or ""

def cf_api(method, path, data=None):
    url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}{path}"
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Authorization", f"Bearer {TOKEN}")
    req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        return {"success": False, "errors": [{"message": f"HTTP {e.code}: {body[:200]}"}]}

# Check project
print("Checking project...")
result = cf_api("GET", f"/pages/projects/{PROJECT}")
if result.get("success"):
    print("Project OK:", result["result"]["name"])
else:
    print("Error:", result.get("errors"))
    if "9106" in str(result.get("errors")):
        print("Auth failed - token might be wrong or empty")
    sys.exit(0 if not result.get("success") else 0)
    exit(1)

print("Done - checking token validity only")
