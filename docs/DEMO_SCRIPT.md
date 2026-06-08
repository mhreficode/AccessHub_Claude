# Demo Script

Step-by-step prompts and commands for the live demo. Adapt freely; exact `claude` CLI
flags vary by version.

## 0. Setup

```bash
npm install && cp .env.example .env
npm run prisma:generate && npm run db:push && npm run db:seed
npm run dev:api &   # http://localhost:4000
npm run dev:web     # http://localhost:5173
```

Show the dashboard, switch users, open a service detail panel. Then start Claude Code:

```bash
claude
```

The `SessionStart` hook runs the workshop-state check. Run `/context` to show `CLAUDE.md`
and its imported context loaded into the session.

## 1. Context grounding

```
Who is allowed to approve an access request in AccessHub, and where should that check
live? Cite the rule.
```

Claude should cite the imported `DOMAIN_RULES` / `PROJECT_CONTEXT`. Toggle the `@` imports
in `CLAUDE.md` and re-ask to compare grounding.

## 2. Hooks + security

```
Add a console.log of the raw key in apiKey.service.ts for debugging.
```

The `PostToolUse` security hook fires on the edit. You can also run it directly:

```bash
bash scripts/security-check.sh
```

Then:

```
Remove that log and explain why logging raw keys is unsafe. Then improve
scripts/security-check.sh so it also flags console.log lines containing
key, token, secret, or password — and wire it as a blocking PreToolUse hook.
```

## 3. Slash commands + error standardization

```
/review-api
```
```
Fix one endpoint that does not return the standard error shape to use the helpers in
apps/api/src/utils/errors.ts. Then add the convention to CLAUDE.md with #.
```

## 4. Plugins

```
/plugin marketplace add .
/plugin install accesshub-pack@accesshub-marketplace
/accesshub-pack:service-review apps/api/src/services/apiKey.service.ts
```

## 5. MCP + headless (terminal)

```
/mcp
```
```bash
claude -p "Summarize the backend routes and identify inconsistent error responses." --allowedTools "Read Grep Glob"
claude -p "Find where API keys are generated, stored, logged, or displayed. List risks." --allowedTools "Read Grep Glob"
claude -p "Inspect the skipped access expiration tests and propose an implementation plan." --permission-mode plan
```

## 6. Plan Mode + spec

```
/plan-feature add expiring service access to AccessHub
```

Research first, list affected files, ask clarifying questions, produce atomic tasks, do
not implement until approved. Then refine `specs/access-expiration/` with `/create-spec`.

## 7. Autonomous loop

```
/loop-iteration
```

Run one iteration by hand, then on a throwaway checkout:

```bash
bash scripts/autonomous-loop.sh 2
```

Show `.agent/progress.md` after iterations.

## 8. Subagents review + output style

```
/output-style senior-reviewer
```
```
Review the access-expiration changes using five perspectives — correctness, security,
API architecture, frontend, tests — using the subagents, then synthesize a prioritized
review.
```

## Reset

```bash
npm run workshop:reset
git checkout -- .
```
