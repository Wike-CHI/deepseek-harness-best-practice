[English](README.md) | 中文

# weather-orchestrator — DSH workflow 移植

上游原型：[claude-code-best-practice 的 Command → Agent → Skill 编排链](https://github.com/shanraisshan/claude-code-best-practice)：

```
/weather-orchestrator (command)  →  weather-agent (subagent)  →  weather-fetcher / weather-svg-creator (skills)
```

## DSH 版：一个 workflow 脚本

[`weather-orchestrator.workflow.js`](weather-orchestrator.workflow.js) 用 DSH 的 `workflow` 工具把整条链压缩为代码级编排：

| 上游（markdown 契约） | DSH（workflow 脚本） | 差异 |
|---|---|---|
| command markdown 里的「Execution Contract (non-negotiable)」 | 脚本顺序 + `if (!weather) throw` | 强制力从「恳求模型自觉」变为「代码保证」 |
| AskUserQuestion 问单位 | `args: { city, unit }` | 参数化，可被 task-board 定时任务驱动 |
| Agent 工具调用 weather-agent | `agent(prompt, { schema })` | 结构化输出 schema 由运行时校验 |
| Skill 工具调用 weather-svg-creator | 第二个 `agent()` 写文件 | 阶段化日志（`phase`/`log`） |
| 失败时「stop and report」 | `throw` → 工作流中止 | fail-closed 是真实控制流 |

## 实跑产物（Dubai, °C）

- [`weather.svg`](weather.svg) — 深色渐变天气卡片（34°C · 晴朗 · 湿度 65% · 北风 26 km/h）
- [`output.md`](output.md) — 文字总结

## 复现

在 DSH 会话中对 agent 说：

> 用 workflow 工具运行 `examples/weather-orchestrator/weather-orchestrator.workflow.js` 的内容，args 传 `{ "city": "Shanghai", "unit": "C" }`

即可换个城市再跑一次。
