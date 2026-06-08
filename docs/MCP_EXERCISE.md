# MCP Exercise (Model Context Protocol)

MCP lets Claude Code talk to external tools and data sources through a standard protocol —
file systems, databases, issue trackers, browsers, and more. Servers are declared in
`.mcp.json` (project-scoped, checked in and shared with the team).

## What AccessHub ships

`.mcp.json` declares one server:

```json
{
  "mcpServers": {
    "accesshub-context": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "./docs", "./specs"]
    }
  }
}
```

This `accesshub-context` server gives Claude grounded, read-oriented access to the
curated `docs/` and `specs/` directories through MCP tools (list, read, search) — a
clean, dependency-free demo that runs over `npx`.

## Flow

1. Start Claude Code in the repo. The first time a project `.mcp.json` is present, Claude
   asks you to approve the server — approve `accesshub-context`.
2. Run `/mcp` to see the server status and the tools it exposes.
3. Ask a question that uses the server's tools:

   ```
   Using the accesshub-context MCP server, search the docs and specs for every place that
   describes when access expires, and list the file and line for each.
   ```

4. Compare with asking the same thing using Claude's built-in file tools. Discuss when an
   MCP server adds value (shared/remote data, a controlled surface, a tool the model
   otherwise lacks) vs. when built-in tools suffice.

## Manage MCP servers

- `/mcp` — list servers, view tools, authenticate, reconnect.
- `claude mcp add <name> -- <command> [args...]` — add a server from the CLI.
- `claude mcp list` — list configured servers.
- Scopes: **local** (just you), **project** (`.mcp.json`, shared), **user** (all your
  projects).

## Extend it (instructor task)

```
Add a second MCP server to .mcp.json that exposes the seeded SQLite database
(prisma/dev.db) read-only, then ask Claude to report how many access requests are
pending vs approved using that server.
```

(Use an `npx`/`uvx` SQLite MCP server appropriate to the room's environment.)

## Tool Search note

When many MCP tools are connected, Claude Code can defer their schemas and load them
on demand via Tool Search — so a large MCP surface doesn't blow the context budget. Show
`/context` before and after connecting a server to make this concrete.
