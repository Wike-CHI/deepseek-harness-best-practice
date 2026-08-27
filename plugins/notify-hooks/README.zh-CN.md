[English](README.md) | 中文

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
| `tools/pre-execute`（shell 命令命中危险模式，**warn-only 不拦截**） | 危险命令提醒 | 🛡️ |

🛡️ 守卫是 Claude Code `PreToolUse` hook 的 DSH 对应物：`tools/pre-execute` **瀑布**监听对 `pwsh`/`bash` 命令字符串做模式匹配（rm -rf、format、dd、`git push --force`、fork 炸弹、管道执行远程脚本等），推送警告 toast 后一律 `return next()` 放行执行。

## 架构

```
DSH Host 事件 ──ctx.on()──▶ Host 半：内存环形缓冲（50 条，只取叶子字段）
                                   │  harness.handle('notify/poll')
                                   ▼  （RPC 仅 Client→Host，故用轮询，1.5s）
                          Client 半：shell.overlay Slot 渲染 toast 栈
                                   + React <audio> 播放内嵌 base64 WAV beep
```

设计要点：

- **无状态协议**：Host 每次轮询都返回整个可见缓冲（最近 50 条事件）；Client 给每个 `seq` 记录墙钟 `firstSeen`，本地 9 秒过期。无游标、无租约——同一响应在任何页面渲染同一 UI。
- **跨实例共享 store**：每次 `cordis_run` 都会往页面里装入一个全新的 client 实例，旧实例不会被回收。因此所有状态放在 `window.__dshNotifyStoreV3` 单例里，堆叠实例永不分叉；组件 `useState` 初始快照直接读 store，slot 再投影导致的重挂载不会闪空。
- **音频解锁**：浏览器自动播放策略要求先有一次用户手势——点一次「🔕→🔔」开关即解锁并试听。
- **生命周期干净**：所有监听器走 `ctx.on()`、定时器走 `ctx.interval`、样式走 `styles.insert`，停止/更新插件时全部自动回收。

## 踩坑记录（写自己的插件前必读）

1. **Client 包不会随页面加载自动装载**：页面里不存在动态包，直到一次派发到达（`cordis_run` 或点 Run 卡片的启动按钮）。刷新页面是「设计上的清空」——刷新后需重新派发插件。
2. **同一页面反复 `cordis_run` 会堆叠 client 实例**：每次派发装入新副本，旧副本可能继续用旧 `pluginRunId` 轮询（其 RPC 会失败）。设计上用共享 `window` store + 幂等写入兜底；更新插件后刷新页面以清掉堆叠实例。
3. **Host 沙箱没有 `Date`**（也没有 `process`）：不要在 Host 侧打时间戳；到达时间在 Client 侧记录，或者用事件计数。
4. **`host.call` 的参数必须传对象**：`host.call('m', null)` 会被线路 codec 拒绝，用 `host.call('m', {})`。
5. **瀑布事件**（如 `tools/pre-execute`）每条路径都必须 `return next()`，包括 catch 之后。
6. **用 MutationObserver 验证，别用单点 DOM 读取**——toast 几秒就过期，慢速检查只会看到空 DOM，白白怀疑人生。

## 使用方式

动态 Cordis 插件是进程级的：在 DSH 会话中让 agent 读取本目录的 `host.js` / `client.js`，经 `cordis_define` + `cordis_run` 激活（Client 半需在 Run 卡片上授权一次）。重启 DSH 进程后需重新激活。**每次插件更新后请刷新一次 GUI 页面**——每次派发都会往页面里装一个新 client 实例，刷新可清掉堆叠的旧实例（store 是共享的，状态不会丢）。

## 文件

- `host.js` — Host 半：事件订阅 + 缓冲 + `notify/poll`、`notify/test` 两个 RPC
- `client.js` — Client 半：overlay toast 栈 + 声音开关
