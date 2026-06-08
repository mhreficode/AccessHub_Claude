# Domain Rules

These are the business rules AccessHub is meant to enforce. Use this document to
ground Claude (it is imported into `CLAUDE.md`, and is a good candidate to pull in with
`/context` or an MCP context server).

## Services

- A service is owned by exactly one team (`ownerTeamId`).
- Services have a lifecycle status: `active`, `maintenance`, or `deprecated`.

## Requesting access

- Any authenticated user (typically a `developer`) can request access to a service.
- A request must include a reason of at least 10 characters.
- A new request starts as `pending`.

## Reviewing access

- Only the **owning team's** `service_owner` users or a `platform_admin` may approve
  or reject a request for a given service.
- A request can only be reviewed while it is `pending`.
- Approving a request:
  1. sets it to `approved` and records the reviewer and time,
  2. issues an API key for the requester,
  3. writes an `access.approved` audit event.
- Rejecting a request sets it to `rejected` with a rejection reason and **must** write
  an `access.rejected` audit event.

## API keys

- An API key is issued when access is approved.
- The **raw key is shown exactly once**, at creation. Only a prefix and a SHA-256 hash
  are stored. See `docs/SECURITY.md`.
- A key is `active` or `revoked`.
- A key can be revoked by the key holder, the owning team's owner, or a platform admin.
- Revoking a key writes an `apikey.revoked` audit event.
- A revoked key must not validate.

## Audit log

Every access-lifecycle event must produce exactly one audit entry:

| Event | Action |
|-------|--------|
| Access requested | `access.requested` |
| Access approved | `access.approved` |
| Access rejected | `access.rejected` |
| API key generated | `apikey.generated` |
| API key revoked | `apikey.revoked` |
| Service updated | `service.updated` |

Audit messages and metadata must never contain secrets (raw keys, hashes).

The audit log is visible to service owners and platform admins, not to developers.

## Future rule: access expiration (workshop feature)

> Not yet implemented. This is the golden-path feature participants build.

- Approved access expires **30 days** after approval unless extended.
- Service owners and platform admins can extend access.
- When access expires, the related API keys must no longer validate.
- The dashboard surfaces access that is expiring soon.
- Expiration and extension are audited.

See `specs/access-expiration/` and `docs/PRD.md`.
