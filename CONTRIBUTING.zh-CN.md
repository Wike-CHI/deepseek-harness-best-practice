[English](CONTRIBUTING.md) | 中文

# 贡献指南 — DeepSeek Harness Best Practice

感谢你有意参与贡献！本仓库把 [Claude Code 最佳实践](https://github.com/shanraisshan/claude-code-best-practice)（skills / subagents / hooks / workflows）以插件、agent preset、workflow 示例的形式移植到 [DeepSeek Harness](https://github.com/deepseek-ai)（DSH）。

## 范围

贡献应当符合仓库目标：**演示如何把 Claude Code 概念映射到 DSH，且不修改 DSH 内核**。欢迎：

- 动态 Cordis 插件（事件订阅、Slot UI、Tools、Services）
- Agent preset（`cordis.yml` 组合）
- Workflow 移植示例（`workflow` 工具编排）
- 映射分析与报告

不在范围内：对 DSH 本身的修改（请提交给上游 DSH 项目），以及任何需要改动内核的实现。

## 目录结构

| 路径 | 内容 |
|---|---|
| [`plugins/`](plugins/) | 动态 Cordis 插件，每个插件一个目录，如 [`plugins/notify-hooks/`](plugins/notify-hooks/) |
| [`presets/`](presets/) | Agent preset，每个 preset 一个目录，如 [`presets/best-practice/`](presets/best-practice/) |
| [`examples/`](examples/) | Workflow 移植示例（附真实运行产物） |
| [`reports/`](reports/) | 中英双语映射分析文档 |

## 贡献插件

动态 Cordis 插件用于扩展正在运行的 DSH 进程。请参照 `plugins/notify-hooks/` 确立的结构：

### 结构

```
plugins/<your-plugin>/
  host.js           # Host 半：运行在 DSH Node.js 进程
  client.js         # Client 半：运行在浏览器页面（可选）
  README.md         # 英文文档（主）
  README.zh-CN.md   # 中文姊妹篇
```

### 规则

- **只用 plain JavaScript** — 插件运行时不做 TypeScript / JSX / 打包转换。禁止 `import` / `require`、类型标注、`<Component />`（Client 半请用 `React.createElement`）。
- **两半结构**：Host（`host.js`）处理事件、文件、网络、Tools，以及通过 `harness.handle(method, handler)` 注册 Package 私有 RPC；Client（`client.js`）处理 Slot UI、主题和页面状态，通过 `host.call(method, args)` 调用 Host——RPC 方向**仅 Client→Host**。
- **生命周期可逆**：所有副作用必须归属当前 Fiber——用 `ctx.on()` 订阅事件、用官方 timer 服务调度定时器、用 styles 服务插入样式，保证插件停止或更新时一切自动释放。
- **可选服务**：用 `ctx.get('serviceName')` 读取可选服务并处理 `undefined`。只有硬依赖才声明 `inject: [...]`，且只有已注入的服务才能用 `ctx.<name>` 访问。
- **Slot UI**：Client UI 必须注册到查询过的 Slot（如 `shell.overlay`）；`apply()` 不能直接返回 React Element。
- **不序列化活数据**：不要对 Services / Events / Sessions 做 `JSON.stringify` 或深拷贝——只取你需要的叶子字段。
- **先讨论再动手**：写较大的插件前，请先开 Issue 说明你要移植的 Claude Code 概念和计划使用的 DSH 机制。

## 贡献 Preset

- 一个 preset 即一个目录，包含 `preset.yml`（名称 + 描述）与 `agent.cordis.yml`（组合）。
- 请在你自己的 `~/.dsh/.agent-presets/<id>/` 目录下编写 preset。**绝不要修改或删除出厂安装的 preset**——它属于部署本身，升级时会被覆盖。若要改变出厂 preset 的行为，请把它的组合复制到新 preset 目录再修改。
- preset 必须能干净挂载：提交前请验证它出现在会话预设选择器中（`standingKeyFor` 挂载校验）。
- 附带 `README.md` / `README.zh-CN.md` 双语文档，说明 preset 注入了什么、与哪些插件配套。

## 文档约定

- 英文为主文档（`README.md`），中文为姊妹篇（`README.zh-CN.md`）。
- 两个文件顶部都必须有互链行：`English | [中文](README.zh-CN.md)`（中文文件镜像对应）。
- 单语文档可以作为起点被接受，但新增插件/preset 的 PR 应补齐双语（机器翻译初稿亦可，未校对请注明）。

## 代码风格

- Plain JavaScript（ES2020+ 语法即可），2 空格缩进，无构建步骤。
- 注释中英文皆可。
- 插件保持小而单一职责；优先组合而非巨型插件。

## Commit 规范

使用 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)：

- `feat:` 新插件/preset/示例或新能力
- `docs:` 仅文档
- `fix:` bug 修复
- `refactor:` / `chore:` / `ci:` 按情况使用

示例：`feat(plugins): add status-line plugin`、`docs(reports): update mapping for hooks`。

## Issue 与 PR 流程

- **Issue**：使用 Bug Report 或 Feature Request 模板。Feature Request 应写明想移植的 Claude Code 概念、附上游链接，并注明预期的 DSH 机制（plugin / preset / workflow）。
- **PR**：填写 PR 模板清单。提交前请在本地验证插件/preset（在真实 DSH 会话中用 `cordis_define` + `cordis_run` 激活插件；在真实会话中挂载 preset）。
- 小而聚焦的 PR 比大而杂的 PR 更容易评审。

## 许可证

提交贡献即表示你同意你的贡献以 MIT 许可证授权。
