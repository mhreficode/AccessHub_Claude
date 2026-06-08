# Proposal: Expiring Service Access

> Status: DRAFT — intentionally incomplete. Refine this during the workshop.

## Intent

Add expiration dates to approved service access so that access is automatically
considered expired after 30 days unless a service owner or platform admin extends it.

## Motivation

Today, once access is approved it lasts forever. Stale access is a security and
compliance risk: developers keep keys to services they no longer use. Time-boxing
access with an easy extension path keeps the catalog clean without blocking real work.

## Goals

- Approved access expires 30 days after approval.
- Owners/admins can extend access before or after expiry.
- Expired access invalidates the related API keys.
- The dashboard surfaces access expiring soon.
- Expiration and extension are audited.

## Non-goals (for now)

- Configurable per-service TTLs. (TODO: decide if needed.)
- Email/Slack notifications about upcoming expiry. (TODO.)
- Automatic background job to expire access. (TODO: decide push vs. lazy evaluation.)

## Open questions

- TODO: Is expiry evaluated lazily (on read / key validation) or by a scheduled job?
- TODO: Does extending reset the clock to now+30d, or extend from the current expiry?
- TODO: What happens to a key when access is extended after it was invalidated?
