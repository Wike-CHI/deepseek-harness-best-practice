English | [中文](README.zh-CN.md)

# weather-orchestrator — A DSH workflow port

Upstream prototype: the [Command → Agent → Skill orchestration chain in claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice):

```
/weather-orchestrator (command)  →  weather-agent (subagent)  →  weather-fetcher / weather-svg-creator (skills)
```

## DSH edition: a single workflow script

[`weather-orchestrator.workflow.js`](weather-orchestrator.workflow.js) compresses the entire chain into code-level orchestration using DSH's `workflow` tool:

| Upstream (markdown contract) | DSH (workflow script) | Difference |
|---|---|---|
| The "Execution Contract (non-negotiable)" in the command markdown | Script sequencing + `if (!weather) throw` | Enforcement moves from "begging the model to comply" to "guaranteed by code" |
| AskUserQuestion prompts for the unit | `args: { city, unit }` | Parameterized; can be driven by task-board scheduled jobs |
| Agent tool invoking weather-agent | `agent(prompt, { schema })` | Structured output schema validated by the runtime |
| Skill tool invoking weather-svg-creator | A second `agent()` writes the files | Phased logging (`phase`/`log`) |
| "stop and report" on failure | `throw` → workflow aborts | fail-closed becomes real control flow |

## Artifacts from a live run (Dubai, °C)

- [`weather.svg`](weather.svg) — dark-gradient weather card (34°C · clear · humidity 65% · north wind 26 km/h)
- [`output.md`](output.md) — textual summary

## Reproducing

In a DSH session, tell the agent:

> Run the contents of `examples/weather-orchestrator/weather-orchestrator.workflow.js` with the workflow tool, passing args `{ "city": "Shanghai", "unit": "C" }`

to run it again for a different city.
