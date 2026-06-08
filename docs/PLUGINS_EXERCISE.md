# Plugins & Marketplaces Exercise

Where GitHub Copilot uses APM-style packages, Claude Code uses **plugins** and
**marketplaces** to package and share assets — slash commands, skills, subagents, hooks,
and MCP servers — across repositories. AccessHub ships a local marketplace and one
plugin so you can install it from a checkout.

## Files

- `.claude-plugin/marketplace.json` — the marketplace catalog (lists available plugins).
- `plugins/accesshub-pack/` — the bundled plugin:
  - `.claude-plugin/plugin.json` — plugin metadata.
  - `commands/` — `service-review`, `test-generation`.
  - `skills/` — `secure-api-key-handling`, `api-error-standardization`, `api-style`,
    `security-baseline`.
  - `agents/` — a shared `security-reviewer` subagent.
  - `README.md`.

## Flow

1. Add the local marketplace and install the plugin (from the repo root, inside Claude
   Code):

   ```
   /plugin marketplace add .
   /plugin install accesshub-pack@accesshub-marketplace
   ```

2. List what it added:
   - `/help` or type `/` → look for `accesshub-pack:service-review` and
     `accesshub-pack:test-generation`.
   - `/agents` → the shared `security-reviewer`.
   - `/skills` → the four packaged skills, namespaced `accesshub-pack:*`.

3. Run a packaged command:

   ```
   /accesshub-pack:service-review apps/api/src/services/accessRequest.service.ts
   ```

4. Manage installs with `/plugin` (enable, disable, uninstall).

## Instructor task — add a reusable asset to the pack

```
Create a new skill in the accesshub-pack plugin called access-expiration-review. It
should tell Claude how to review access-expiration implementations for correctness,
security, auditability, and tests. Put it at
plugins/accesshub-pack/skills/access-expiration-review/SKILL.md.
```

Then reinstall (or reload) the plugin and confirm the new skill appears.

## Discussion points

- What belongs in a shared plugin vs a single repo's `.claude/`.
- Components are namespaced `<plugin>:<name>` so they never clash with local assets.
- A real marketplace can live in its own Git repo (`/plugin marketplace add owner/repo`)
  and be shared across every project in an org.
- Plugins can also ship `hooks/` and an `.mcp.json`, so an entire agent setup —
  commands, guardrails, and tools — travels as one versioned unit.
