English | [中文](README.zh-CN.md)

# DeepSeek Harness Best Practice

A plugin-based port of the [claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice) methodology to [DeepSeek Harness](https://github.com/deepseek-ai) (DSH) — an AI agent runtime built around Cordis plugin composition.

## Key Takeaway

Nearly every concept from Claude Code best practices maps onto DSH **without modifying the DSH core**. The implementation spans two layers:

- **Static composition**: agent preset (`cordis.yml`) — Skills, Subagents, permissions, prompt injection
- **Dynamic Cordis plugins**: Hooks (event subscriptions), Status line / audio feedback (Client Slot UI)

See [`reports/claude-code-to-dsh-mapping.md`](reports/claude-code-to-dsh-mapping.md) for the full item-by-item mapping.

## Repository Layout

| Path | Contents |
|---|---|
| [`plugins/notify-hooks/`](plugins/notify-hooks/) | Event notification center: Host event subscriptions → top-right toast + sound alert (the DSH counterpart of Claude Code hooks sound notifications) |
| [`presets/best-practice/`](presets/best-practice/) | Best-practice agent preset: full standard feature set + distilled work-discipline persona injection |
| [`examples/weather-orchestrator/`](examples/weather-orchestrator/) | A workflow port of the Command→Agent→Skill orchestration chain (with real run artifacts) |
| [`reports/claude-code-to-dsh-mapping.md`](reports/claude-code-to-dsh-mapping.md) | Item-by-item mapping analysis of 10 concepts + implementation roadmap |

## Mapping at a Glance

| Claude Code | DSH | Approach |
|---|---|---|
| Skills / Commands | Native skill catalog | ⭐ Works out of the box |
| Subagents | `subagent` / `workflow` tools | ⭐⭐ Light adaptation |
| Hooks (20+ event points) | Cordis Events + dynamic plugins | ⭐⭐⭐ See `plugins/notify-hooks` |
| Memory (CLAUDE.md / rules) | Hindsight + CLAUDE.md injection | ⭐ Better solution already available |
| Ralph Wiggum loop | `ralph` / goal tools | ⭐ Built in |
| Scheduled tasks | dsh-task-board plugin | ⭐ Built in |
| Command→Agent→Skill orchestration | `workflow` tool (code-level DAG) | ⭐⭐ Paradigm upgrade |

## References

- Methodology source: [shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice) (the local `framework/` directory is a reference copy of it and is not part of this repository)
- DSH plugin development: dynamic Cordis Plugin (Host events + Client Slot + Package-private RPC)

## License

MIT
