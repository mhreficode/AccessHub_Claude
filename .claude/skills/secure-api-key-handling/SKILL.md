---
name: secure-api-key-handling
description: Rules for generating, hashing, masking, storing, and displaying API keys in AccessHub. Use when touching key generation, validation, storage, serialization, or any code near API keys.
---

# Secure API Key Handling

How AccessHub must treat API keys.

## Rules

- **Generate** keys with `generateApiKey()` (`apps/api/src/utils/crypto.ts`). It returns
  `{ raw, prefix, hash }`.
- **Store** only `keyPrefix` and `keyHash` (SHA-256). Never persist the raw key.
- **Show** the raw key to the user **exactly once**, at creation (the approve response).
- **Mask** keys for display via `maskKey(prefix)` / the API-key serializer. Never return
  `keyHash`.
- **Never log** the raw key — not in `console.log`, audit logs, or error messages.
- **Validate** keys by hashing the input and comparing to the stored hash; reject keys
  that are `revoked` (and, once the feature exists, tied to expired access).

## Review checklist

- [ ] No `console.*` includes a raw key/token/secret.
- [ ] No response includes `keyHash`.
- [ ] Raw key is returned only at creation.
- [ ] Revoked keys do not validate.
- [ ] `scripts/security-check.sh` passes.
