English | [中文](CONTRIBUTING.zh-CN.md)

# Contributing to DeepSeek Harness Best Practice

Thanks for your interest in contributing! This repository ports the [Claude Code best practices](https://github.com/shanraisshan/claude-code-best-practice) (skills / subagents / hooks / workflows) to [DeepSeek Harness](https://github.com/deepseek-ai) (DSH) as plugins, agent presets, and workflow examples.

## Scope

Contributions should fit the repo's goal: **demonstrating how a Claude Code concept maps onto DSH without modifying the DSH core**. In scope:

- Dynamic Cordis plugins (event subscriptions, Slot UI, Tools, Services)
- Agent presets (`cordis.yml` compositions)
- Workflow ports (`workflow` tool orchestration examples)
- Mapping analysis and reports

Out of scope: changes to DSH itself (upstream them to the DSH project), and anything requiring core modification.

## Repository Layout

| Path | Contents |
|---|---|
| [`plugins/`](plugins/) | Dynamic Cordis plugins — one directory per plugin, e.g. [`plugins/notify-hooks/`](plugins/notify-hooks/) |
| [`presets/`](presets/) | Agent presets — one directory per preset, e.g. [`presets/best-practice/`](presets/best-practice/) |
| [`examples/`](examples/) | Workflow port examples with real run artifacts |
| [`reports/`](reports/) | Bilingual mapping analysis documents |

## Contributing a Plugin

Dynamic Cordis plugins extend a running DSH process. Please follow the structure established by `plugins/notify-hooks/`:

### Structure

```
plugins/<your-plugin>/
  host.js           # Host half: runs in the DSH Node.js process
  client.js         # Client half: runs in the browser page (optional)
  README.md         # English doc (primary)
  README.zh-CN.md   # Chinese sibling doc
```

### Rules

- **Plain JavaScript only** — the plugin runtime performs no TypeScript, JSX, or bundler transform. No `import` / `require`, no type annotations, no `<Component />` (use `React.createElement` in the Client half).
- **Two halves**: Host (`host.js`) handles events, files, networking, Tools, and Package-private RPC handlers via `harness.handle(method, handler)`. Client (`client.js`) handles Slot UI, themes, and page state, and calls the Host via `host.call(method, args)` — the RPC direction is **Client→Host only**.
- **Reversible lifecycle**: every side effect must be owned by the current Fiber — subscribe with `ctx.on()`, schedule timers through the official timer service, insert styles through the styles service, so that stopping or updating the plugin disposes everything automatically.
- **Optional services**: read optional Services with `ctx.get('serviceName')` and handle `undefined`. Only declare `inject: [...]` for hard dependencies, and only access `ctx.<name>` for injected services.
- **Slot UI**: Client UI must be registered in a queried Slot (e.g. `shell.overlay`); `apply()` cannot directly return a React Element.
- **No live-data serialization**: never `JSON.stringify` / deep-copy Services, Events, or Sessions — extract only the leaf fields you need.
- **Discuss first**: open an Issue describing the Claude Code concept you plan to port and the DSH mechanism you intend to use before writing a large plugin.

## Contributing a Preset

- A preset is one directory with a `preset.yml` (name + description) and an `agent.cordis.yml` (composition).
- Author presets under your own `~/.dsh/.agent-presets/<id>/` directory. **Never edit or delete the shipped preset install** — it belongs to the deployment and an upgrade overwrites it. To change what a shipped preset does, copy its composition into a new preset directory and edit the copy.
- The preset must mount cleanly: verify it appears in the session preset selector (`standingKeyFor` mount validation) before submitting.
- Include a `README.md` / `README.zh-CN.md` pair explaining what the preset injects and which plugins it pairs with.

## Documentation

- English is the primary doc (`README.md`); Chinese is the sibling (`README.zh-CN.md`).
- Both files must start with the interlink line: `English | [中文](README.zh-CN.md)` (and its mirror in the Chinese file).
- Documentation in either language alone is acceptable as a starting point, but a PR adding a new plugin/preset should include both (machine translation is fine as a draft; mark it if unreviewed).

## Code Style

- Plain JavaScript (ES2020+ syntax is fine), 2-space indentation, no build step.
- Comments in English or Chinese are both accepted.
- Keep plugins small and single-purpose; prefer composition over one mega-plugin.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` new plugin/preset/example or new capability
- `docs:` documentation only
- `fix:` bug fixes
- `refactor:` / `chore:` / `ci:` as appropriate

Examples: `feat(plugins): add status-line plugin`, `docs(reports): update mapping for hooks`.

## Issues & Pull Requests

- **Issues**: use the Bug Report or Feature Request templates. Feature requests should name the Claude Code concept, link the upstream source, and state the expected DSH mechanism (plugin / preset / workflow).
- **PRs**: fill in the PR template checklist. Verify the plugin/preset locally before submitting (activate the plugin with `cordis_define` + `cordis_run` in a real DSH session; mount the preset in a real session).
- Small, focused PRs are easier to review than large mixed ones.

## License

By contributing, you agree that your contributions are licensed under the MIT License.
