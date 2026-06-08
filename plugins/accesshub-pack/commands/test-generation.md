---
description: Generate missing tests for an area, before changing production code.
argument-hint: [area under test]
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(npm run test:*)
model: inherit
---

Add the tests that are missing for this area: $ARGUMENTS

1. Inspect the implementation under test and the existing tests.
2. Identify missing cases — authorization edge cases, error paths, and domain rules.
3. Add tests **before** changing production code, so a real gap fails first.
4. Keep test names readable and behavior-focused; avoid over-mocking.
5. Run the relevant suite and report pass/fail with the command you used.
