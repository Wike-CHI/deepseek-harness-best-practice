# Claude Code Best Practice 仓库 → DSH 插件化映射分析

> 分析对象：`framework/claude-code-best-practice/`（shanraisshan/claude-code-best-practice 本地副本）
> 结论：**绝大多数概念可映射到 DSH，分两层落地——静态组合（agent preset / cordis.yml）与动态 Cordis 插件，无需改造 DSH 内核。**

## 一、仓库核心资产

- **概念层**：Skills / Subagents / Commands / Hooks / MCP / Settings / Memory / Status line
- **方法论层**：Research → Plan → Execute → Review → Ship 工作流；83 条实战 tips（Boris Cherny、Thariq、Cat Wu 等来源）
- **示例实现**：
  - `/weather-orchestrator` 命令 → `weather-agent` 子代理 → `weather-fetcher` / `weather-svg-creator` 双 skill 的 **Command → Agent → Skill** 编排链
  - 跨平台 hook 声音通知系统（`hooks.py` + 20+ 事件点 + ElevenLabs 音效包）

## 二、逐项映射

| Claude Code 概念 | 仓库资产 | DSH 对应机制 | 插件化方式 | 难度 |
|---|---|---|---|---|
| Skills (`.claude/skills/`) | weather-fetcher、weather-svg-creator | DSH 原生 skill 目录 | SKILL.md 目录直接放进 preset 技能目录，零改动 | ⭐ 直接可用 |
| Subagents (`.claude/agents/`) | weather-agent、presentation-* | `subagent` / `subagent_fork` / `workflow` 工具 | agent 定义转 preset subagent 配置；编排逻辑转 workflow 脚本 | ⭐⭐ 轻量改写 |
| Commands (`.claude/commands/`) | weather-orchestrator 等 | skill 即命令 | 命令 markdown 改写成 SKILL.md，description 字段即触发器 | ⭐ 直接可用 |
| Hooks（PreToolUse/Stop/声音等 20+ 事件） | hooks.py + 声音包 | Cordis Events + 动态插件 `ctx.on()` | Host 动态插件订阅事件做通知/拦截/审计 | ⭐⭐⭐ 需开发 |
| Settings / 权限分级 | settings.json 层级 | cordis.yml 预设 + 沙箱模式 + approval 策略 | 做成 preset 文件，新建会话时选择 | ⭐ 直接可用 |
| Memory（CLAUDE.md / rules / agent-memory） | 分层 memory | Hindsight 知识页 + CLAUDE.md 自动注入 | Hindsight 已覆盖且更优 | ⭐ 已有更优解 |
| Command→Agent→Skill 编排 | orchestration-workflow 示例 | `workflow` 工具（JS 编排多 subagent + 阶段） | workflow 脚本天然表达 DAG，代码级强制力优于 markdown 约定 | ⭐⭐ 范式升级 |
| Ralph Wiggum 自进化循环 | 长任务自主循环 | `ralph` 工具 / goal 工具 | DSH 已内置等价物 | ⭐ 已内置 |
| 定时任务 `/loop` `/schedule` | cron 调度 | dsh-task-board 插件（已装，支持 cron） | 已内置插件 | ⭐ 已内置 |
| Status line / 声音反馈 | settings + 音频 hooks | Client Slot UI + Host Events | Host 捕获事件 → 私有 RPC → Client Slot 渲染状态条/播提示音 | ⭐⭐⭐ 需开发 |

## 三、推荐落地项（按优先级）

1. **声音/通知 Hook 插件**（动态 Cordis，Host + Client）
   DSH 当前空缺、差异价值最大。Host 插件用 `ctx.on()` 订阅工具调用 / 会话停止 / 审批请求等事件，经 Package 私有 RPC 推给 Client 插件，在浏览器端播放声音或弹 toast。approval=never 的会话里「任务完成 / 需人介入」提醒尤其有价值。

2. **最佳实践 preset**（静态 cordis.yml 组合）
   把 83 条 tips 中可操作部分（计划先行、上下文 <40% 主动 compact、小步提交、子代理做上下文隔离等）蒸馏成 persona prompt 注入；挂入可移植的 skill 目录。用户新建会话选此预设 = 一键加载整套最佳实践。

3. **编排示例移植**（workflow 脚本）
   weather-orchestrator 三层链用 workflow 工具一段 JS（`pipeline` / `agent` 钩子）即可表达，比 markdown 里的 "执行契约（non-negotiable）" 更有强制力——代码级编排，不依赖模型自觉。

## 四、不建议照搬

- **MCP 服务器配置、CLI 启动参数、settings 层级**——Claude Code 宿主特有，DSH 有自己的模型路由与沙箱栈，强行映射无意义。
- **83 条 tips 全文**——约 1/3 是 Claude Code UI 操作技巧（`/rewind`、双击 Esc 等），DSH Web GUI 无对应物，只蒸馏跨宿主通用部分。

## 五、状态

- [x] 仓库盘点与映射分析（已向用户汇报）
- [x] 通知 Hook 插件 → `plugins/notify-hooks/`（notify-1/pkg-1 已激活运行）
- [x] 最佳实践 preset → `presets/best-practice/`（已安装到 ~/.dsh/.agent-presets，通过 standingKeyFor 挂载校验）
- [x] weather-orchestrator → workflow 移植 → `examples/weather-orchestrator/`（已端到端实跑验证，Dubai 34°C）
- [x] 开源仓库：https://github.com/Wike-CHI/deepseek-harness-best-practice

> 备注：曾尝试写入 Hindsight 记忆库，但 hindsight API 返回 401（未配置 API key），故改存本文件。
