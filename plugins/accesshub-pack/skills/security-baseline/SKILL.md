---
name: security-baseline
description: Security baseline for internal developer-platform services handling API keys and access control. Use when touching secrets, authorization, audit logging, or rendered user content.
---

# Security Baseline

For internal developer-platform services handling API keys and access control.

- Never store or log raw API keys. Store only a prefix and a strong hash.
- Show a raw secret to the user once, at creation; never again.
- Never return a stored hash in an API response.
- Enforce authorization on the backend; UI visibility is not a security control.
- Keep secrets out of audit logs (message and metadata).
- Sanitize any user-authored content rendered as HTML.
- Keep real secrets out of the repository; commit only example env files.
