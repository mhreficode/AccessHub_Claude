---
description: Review one backend service module for correctness and clean architecture.
argument-hint: [service file or name]
allowed-tools: Read, Grep, Glob
model: inherit
---

Review one backend service module for correctness and clean architecture.
Target: $ARGUMENTS

1. Summarize what the service does and the rules it enforces.
2. Check that business logic lives here (not in routes or components) and that all DB
   access goes through a repository.
3. Check authorization: is every privileged action enforced here or in middleware?
4. Check that each state change writes exactly one audit event, with no secrets.
5. Flag duplicated validation, leaked internal fields, and missing error handling.

Report findings as file/line, why it matters, and the smallest fix.
