---
name: secure-api-key-handling
description: Rules for generating, hashing, masking, storing, and displaying API keys in internal developer-platform services. Use when touching key generation, validation, storage, or serialization.
---

# Secure API Key Handling

How to treat API keys in an internal developer-platform service.

## Rules

- **Generate** keys with a dedicated helper that returns `{ raw, prefix, hash }`.
- **Store** only the prefix and a strong hash (SHA-256). Never persist the raw key.
- **Show** the raw key to the user **exactly once**, at creation.
- **Mask** keys for display; never return the stored hash in a response.
- **Never log** the raw key — not in `console.log`, audit logs, or error messages.
- **Validate** keys by hashing the input and comparing to the stored hash; reject keys
  that are revoked or tied to expired access.

## Review checklist

- [ ] No `console.*` includes a raw key/token/secret.
- [ ] No response includes the stored hash.
- [ ] Raw key is returned only at creation.
- [ ] Revoked keys do not validate.
