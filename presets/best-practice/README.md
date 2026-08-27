English | [中文](README.zh-CN.md)

# best-practice — DSH Agent Preset

Built on the `standard` full-featured coding agent, this preset injects **cross-host universal work discipline** distilled from the 83 tips of [claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice) (Claude Code UI-specific tricks such as `/rewind` and double-tap Esc are excluded).

## Injected discipline (persona section)

| Category | Key points |
|---|---|
| Planning | Explore read-only before planning; clarify ambiguity first; prefer vertical slices over horizontal layers |
| Context | Use subagents for context isolation (collect only conclusions); proactively compact / start a new session past halfway |
| Execution | Commit in small steps; leave no half-finished migrations; search for existing tools before building your own |
| Verification | Provide evidence (tests/output/screenshots) before claiming completion; locate the root cause first on failure |
| Review | Request independent subagent review for high-risk changes; small, rollback-friendly PRs + squash merge |
| Retention | Frequent repetition → skill; failure points → skill Gotchas |

## Installation

```powershell
# Windows
Copy-Item -Recurse presets/best-practice "$env:USERPROFILE\.dsh\.agent-presets\"
```

```bash
# macOS / Linux
cp -r presets/best-practice ~/.dsh/.agent-presets/
```

After restarting DSH, select "**最佳实践模式**" (Best Practice mode) in the preset selector when creating a new session.

## Files

- `agent.cordis.yml` — complete agent-plane composition (all tool rows of standard + the injected persona discipline section), validated for mounting via `standingKeyFor`
- `preset.yml` — display name and description shown in the selector

## Companion

Pair it with the [`plugins/notify-hooks/`](../../plugins/notify-hooks/) dynamic plugin — together they form this repository's complete plugin-based mapping of the Claude Code best practices.
