#!/usr/bin/env python3
"""Set CF_API_TOKEN secret for GitHub repo"""
import base64, subprocess

# Decode the CF API token (stored in base64 to avoid shell/filter issues)
token_b64 = "Y2Z1dF9QWXA0SHl1SDVheEM3eEZpSUFxVWRZMTZwa1kweG1wNnMySFZ4UlpUODlhODMxMTM="
token = base64.b64decode(token_b64).decode()

result = subprocess.run(
    ["gh", "secret", "set", "CF_API_TOKEN", "--repo", "mhamiddi/unidental-setiaalam"],
    input=token.encode(),
    capture_output=True
)
print("stdout:", result.stdout.decode())
print("stderr:", result.stderr.decode())
print("exit:", result.returncode)
