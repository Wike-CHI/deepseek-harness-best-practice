# notify-hooks — DSH 事件通知中心

把 Claude Code 的 [hooks 声音通知最佳实践](https://github.com/shanraisshan/claude-code-best-practice)移植到 DeepSeek Harness（DSH）的动态 Cordis 插件。

## 功能

订阅 DSH Host 事件，在 Web GUI 右上角实时弹出 toast，可选提示音：

| Host 事件 | 通知 | 图标 |
|---|---|---|
| `agent/status` → idle（本轮有工具调用才发，8s 节流） | 回合完成，代理已空闲 | ✅ |
| `tools/result`（`isError: true`） | 工具执行失败 | ❌ |
| `agent/error` | 代理出错 | ⚠️ |
| `subagent/end` | 子代理结束 | 🤖 |
| `workflow/end` | 工作流运行结束 | 🧩 |
| `agent/session-start` | 会话已开始 | 🚀 |

## 架构

```
DSH Host 事件 ──ctx.on()──▶ Host 半：内存环形缓冲（50 条，只取叶子字段）
                                   │  harness.handle('notify/poll')
                                   ▼  （RPC 仅 Client→Host，故用轮询，1.5s）
                          Client 半：shell.overlay Slot 渲染 toast 栈
                                   + React <audio> 播放内嵌 base64 WAV beep
```

设计要点：

- **轮询而非推送**：Cordis Package 私有 RPC 只有 Client→Host 方向，Client 用 `timer` 服务每 1.5s 拉取增量（按 `seq` 游标）。
- **防打扰**：回合空闲通知要求「距上次空闲以来 ≥1 次工具调用」且 8 秒不重复；首次轮询不回放历史缓冲。
- **音频解锁**：浏览器自动播放策略要求先有一次用户手势——点一次「🔕→🔔」开关即解锁并试听。
- **生命周期干净**：所有监听器走 `ctx.on()`、定时器走 `ctx.timeout/interval`、样式走 `styles.insert`，停止/更新插件时全部自动回收。

## 使用方式

动态 Cordis 插件是进程级的：在 DSH 会话中让 agent 读取本目录的 `host.js` / `client.js`，经 `cordis_define` + `cordis_run` 激活（Client 半需在 Run 卡片上授权一次）。重启 DSH 进程后需重新激活。

## 文件

- `host.js` — Host 半：事件订阅 + 缓冲 + `notify/poll`、`notify/test` 两个 RPC
- `client.js` — Client 半：overlay toast 栈 + 声音开关
