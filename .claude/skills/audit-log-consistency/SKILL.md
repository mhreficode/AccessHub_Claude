---
name: audit-log-consistency
description: When to write audit events in AccessHub and what they must not contain. Use when adding or reviewing an access-lifecycle state change (request, approve, reject, key generate, key revoke, service update, expire, extend).
---

# Audit Log Consistency

Every access-lifecycle event must produce exactly one audit entry.

## Events to audit

| Event | Action |
|-------|--------|
| Access requested | `access.requested` |
| Access approved | `access.approved` |
| Access rejected | `access.rejected` |
| API key generated | `apikey.generated` |
| API key revoked | `apikey.revoked` |
| Service updated | `service.updated` |
| (workshop) Access expired | `access.expired` |
| (workshop) Access extended | `access.extended` |

## How

- Write via `auditLogService.record({ actorUserId, action, entityType, entityId, message, metadata })`.
- Put it in the **service** that performs the action, after the state change succeeds.
- `metadata` is small and JSON-encoded; it must never contain secrets (no raw keys, no
  hashes).

## Review checklist

- [ ] Each state-changing service method records exactly one matching event.
- [ ] No lifecycle path is missing its event (e.g. rejection).
- [ ] No secret appears in `message` or `metadata`.
