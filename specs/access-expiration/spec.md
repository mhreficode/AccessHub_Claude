# Spec: Expiring Service Access

> Status: DRAFT — some requirements are missing details on purpose. Fill them in.

## Requirements

### Requirement: Approved access expires

Approved access must expire after a configured number of days (default 30).

#### Scenario: Access expires after 30 days

Given a developer has approved access to a service
When 30 days have passed since approval
Then the access should be marked as expired
And related API keys should no longer be valid

#### Scenario: Access within the window is active

Given a developer was approved 5 days ago
Then the access should be active
And related API keys should validate

### Requirement: Owners can extend access

Service owners and platform admins can extend access.

#### Scenario: Owner extends expiring access

Given an access request is expiring soon
When the owning team's owner extends it
Then the new expiry should be ~30 days from <!-- TODO: now? current expiry? -->
And an `access.extended` audit event should be written

<!-- TODO: scenario for a non-owner being forbidden from extending -->

### Requirement: Dashboard shows expiring access

<!-- TODO: define "expiring soon" (how many days?) and where it appears in the UI -->

### Requirement: Expiration is audited

<!-- TODO: define the audit action name and metadata for expiry events -->

## Out of scope

- TODO: confirm with the proposal's non-goals.
