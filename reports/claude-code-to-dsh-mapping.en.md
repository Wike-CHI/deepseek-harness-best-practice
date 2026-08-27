English | [中文](claude-code-to-dsh-mapping.md)

# Claude Code Best Practice Repository → DSH Plugin Mapping Analysis

> Analysis target: `framework/claude-code-best-practice/` (local copy of shanraisshan/claude-code-best-practice)
> Conclusion: **Nearly all concepts map to DSH, landing in two layers — static composition (agent preset / cordis.yml) and dynamic Cordis plugins, with no changes required to the DSH core.**

## 1. Core Assets of the Repository

- **Concept layer**: Skills / Subagents / Commands / Hooks / MCP / Settings / Memory / Status line
- **Methodology layer**: Research → Plan → Execute → Review → Ship workflow; 83 field-tested tips (sourced from Boris Cherny, Thariq, Cat Wu, and others)
- **Reference implementations**:
  - `/weather-orchestrator` command → `weather-agent` subagent → `weather-fetcher` / `weather-svg-creator` dual-skill **Command → Agent → Skill** orchestration chain
  - Cross-platform hook sound notification system (`hooks.py` + 20+ event points + ElevenLabs sound pack)

## 2. Item-by-Item Mapping

| Claude Code Concept | Repository Asset | DSH Equivalent | Plugin Approach | Effort |
|---|---|---|---|---|
| Skills (`.claude/skills/`) | weather-fetcher, weather-svg-creator | DSH native skill directory | Drop the SKILL.md directory straight into the preset skill directory, zero changes | ⭐ Ready to use |
| Subagents (`.claude/agents/`) | weather-agent, presentation-* | `subagent` / `subagent_fork` / `workflow` tools | Convert agent definitions to preset subagent config; convert orchestration logic to a workflow script | ⭐⭐ Light rewrite |
| Commands (`.claude/commands/`) | weather-orchestrator, etc. | A skill is a command | Rewrite the command markdown as SKILL.md; the description field acts as the trigger | ⭐ Ready to use |
| Hooks (PreToolUse/Stop/sound, 20+ events) | hooks.py + sound pack | Cordis Events + dynamic plugin `ctx.on()` | A Host dynamic plugin subscribes to events for notification/interception/auditing | ⭐⭐⭐ Requires development |
| Settings / permission tiers | settings.json hierarchy | cordis.yml preset + sandbox modes + approval policy | Package as a preset file, selected when creating a new session | ⭐ Ready to use |
| Memory (CLAUDE.md / rules / agent-memory) | Layered memory | Hindsight knowledge pages + CLAUDE.md auto-injection | Hindsight already covers this and does it better | ⭐ Better solution exists |
| Command→Agent→Skill orchestration | orchestration-workflow example | `workflow` tool (JS orchestrating multiple subagents + phases) | A workflow script naturally expresses a DAG; code-level enforcement beats markdown conventions | ⭐⭐ Paradigm upgrade |
| Ralph Wiggum self-evolving loop | Long-running autonomous loop | `ralph` tool / goal tools | DSH ships a built-in equivalent | ⭐ Built-in |
| Scheduled tasks `/loop` `/schedule` | cron scheduling | dsh-task-board plugin (installed, cron supported) | Built-in plugin | ⭐ Built-in |
| Status line / sound feedback | settings + audio hooks | Client Slot UI + Host Events | Host captures events → private RPC → Client Slot renders a status bar / plays notification sounds | ⭐⭐⭐ Requires development |

## 3. Recommended Deliverables (by Priority)

1. **Sound/notification hook plugin** (dynamic Cordis, Host + Client)
   Currently missing in DSH and offers the highest differential value. The Host plugin uses `ctx.on()` to subscribe to tool-call, session-stop, approval-request, and similar events, then pushes them to the Client plugin via a Package-private RPC to play sounds or show toasts in the browser. "Task complete / human intervention needed" alerts are especially valuable in sessions running with approval=never.

2. **Best-practice preset** (static cordis.yml composition)
   Distill the actionable subset of the 83 tips (plan-first, proactively compact when context <40%, commit in small steps, use subagents for context isolation, etc.) into a persona prompt for injection, and attach a portable skill directory. Selecting this preset when creating a new session loads the entire best-practice bundle in one click.

3. **Orchestration example port** (workflow script)
   The weather-orchestrator three-layer chain can be expressed in a single JS workflow script (`pipeline` / `agent` hooks) — stronger enforcement than the "execution contract (non-negotiable)" in markdown, since orchestration is code-level and does not rely on model discipline.

## 4. Not Recommended to Port As-Is

- **MCP server configuration, CLI launch arguments, settings hierarchy** — specific to the Claude Code host. DSH has its own model routing and sandbox stack, so a forced mapping is meaningless.
- **The full 83 tips** — about one third are Claude Code UI tricks (`/rewind`, double-tap Esc, etc.) with no counterpart in the DSH Web GUI; distill only the cross-host portable parts.

## 5. Status

- [x] Repository inventory and mapping analysis (reported to the user)
- [x] Notification hook plugin → `plugins/notify-hooks/` (notify-1/pkg-1 activated and running)
- [x] Best-practice preset → `presets/best-practice/` (installed to ~/.dsh/.agent-presets, mount verified via standingKeyFor)
- [x] weather-orchestrator → workflow port → `examples/weather-orchestrator/` (verified end-to-end with a real run, Dubai 34°C)
- [x] Open-source repository: https://github.com/Wike-CHI/deepseek-harness-best-practice

> Note: An attempt was made to write to the Hindsight memory bank, but the hindsight API returned 401 (no API key configured), so the content was stored in this file instead.
