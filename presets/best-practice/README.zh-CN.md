[English](README.md) | 中文

# best-practice — DSH Agent Preset

在 `standard` 全功能编码 Agent 的基础上，注入蒸馏自 [claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice) 83 条 tips 的**跨宿主通用工作纪律**（剔除了 `/rewind`、双击 Esc 等 Claude Code UI 专属技巧）。

## 注入的纪律（persona 段）

| 类别 | 要点 |
|---|---|
| 规划 | 先只读探索再计划；歧义先澄清；垂直切片优于水平分层 |
| 上下文 | 子代理做上下文隔离（只回收结论）；过半主动 compact / 新会话 |
| 执行 | 小步提交；不留半成品迁移；先搜索现有工具再自研 |
| 验证 | 宣称完成前必须有证据（测试/输出/截图）；失败先定位根因 |
| 审查 | 高风险改动请独立 subagent 审查；小而可回滚的 PR + squash merge |
| 沉淀 | 高频重复 → skill；失败点 → skill 的 Gotchas |

## 安装

```powershell
# Windows
Copy-Item -Recurse presets/best-practice "$env:USERPROFILE\.dsh\.agent-presets\"
```

```bash
# macOS / Linux
cp -r presets/best-practice ~/.dsh/.agent-presets/
```

重启 DSH 后，新建会话时在预设选择器中选「**最佳实践模式**」。

## 文件

- `agent.cordis.yml` — 完整 agent-plane 组合（standard 的全部工具行 + 注入 persona 纪律段），已通过 `standingKeyFor` 挂载校验
- `preset.yml` — 选择器显示名与描述

## 配套

与 [`plugins/notify-hooks/`](../../plugins/notify-hooks/) 动态插件搭配使用，即为本仓库对 Claude Code 最佳实践的完整插件化映射。
