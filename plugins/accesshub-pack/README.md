# accesshub-pack

A small Claude Code **plugin** that bundles reusable assets for internal
developer-platform repositories. It demonstrates how a team can package and share
Claude Code setup across repos instead of copy-pasting files.

## What it provides

```
plugins/accesshub-pack/
  .claude-plugin/plugin.json   plugin metadata
  commands/                    /accesshub-pack:service-review, /accesshub-pack:test-generation
  skills/                      secure-api-key-handling, api-error-standardization,
                               api-style, security-baseline
  agents/                      security-reviewer subagent
```

When installed, components are namespaced by the plugin name — e.g. the command is
`/accesshub-pack:service-review` and a skill registers as
`accesshub-pack:secure-api-key-handling`.

## Try it in this repo

This repository also ships a local marketplace (`.claude-plugin/marketplace.json`) that
lists this plugin, so you can install it from a checkout:

```
# Inside Claude Code, from the repo root:
/plugin marketplace add .
/plugin install accesshub-pack@accesshub-marketplace
```

Then run `/help` or `/` and look for the `accesshub-pack:` commands, and `/agents` for
the shared `security-reviewer`.

See `docs/PLUGINS_EXERCISE.md` for the full workshop exercise.
