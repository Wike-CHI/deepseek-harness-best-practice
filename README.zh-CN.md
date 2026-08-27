[English](README.md) | 中文

# DeepSeek Harness Best Practice

把 [claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice) 的方法论插件化移植到 [DeepSeek Harness](https://github.com/deepseek-ai)（DSH）——一套以 Cordis 插件组合为核心的 AI agent 运行时。

## 核心结论

Claude Code 最佳实践的绝大部分概念都能映射到 DSH，**无需改造 DSH 内核**，落地分两层：

- **静态组合**：agent preset（`cordis.yml`）——Skills、Subagents、权限、prompt 注入
- **动态 Cordis 插件**：Hooks（事件订阅）、Status line / 声音反馈（Client Slot UI）

完整逐项映射见 [`reports/claude-code-to-dsh-mapping.md`](reports/claude-code-to-dsh-mapping.md)。

## 目录

| 路径 | 内容 |
|---|---|
| [`plugins/notify-hooks/`](plugins/notify-hooks/) | 事件通知中心：Host 事件订阅 → 右上角 toast + 提示音（对应 Claude Code hooks 声音通知） |
| [`presets/best-practice/`](presets/best-practice/) | 最佳实践 agent preset：standard 全功能 + 蒸馏的工作纪律 persona 注入 |
| [`examples/weather-orchestrator/`](examples/weather-orchestrator/) | Command→Agent→Skill 编排链的 workflow 移植（含实跑产物） |
| [`reports/claude-code-to-dsh-mapping.md`](reports/claude-code-to-dsh-mapping.md) | 10 项概念的逐项映射分析 + 落地路线 |

## 映射速览

| Claude Code | DSH | 方式 |
|---|---|---|
| Skills / Commands | 原生 skill 目录 | ⭐ 直接可用 |
| Subagents | `subagent` / `workflow` 工具 | ⭐⭐ 轻量改写 |
| Hooks（20+ 事件点） | Cordis Events + 动态插件 | ⭐⭐⭐ 见 `plugins/notify-hooks` |
| Memory（CLAUDE.md / rules） | Hindsight + CLAUDE.md 注入 | ⭐ 已有更优解 |
| Ralph Wiggum 循环 | `ralph` / goal 工具 | ⭐ 已内置 |
| 定时任务 | dsh-task-board 插件 | ⭐ 已内置 |
| Command→Agent→Skill 编排 | `workflow` 工具（代码级 DAG） | ⭐⭐ 范式升级 |

## 参考来源

- 方法论来源：[shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice)（本地 `framework/` 为其参考副本，未纳入本仓库）
- DSH 插件开发：动态 Cordis Plugin（Host 事件 + Client Slot + Package 私有 RPC）

## License

MIT
