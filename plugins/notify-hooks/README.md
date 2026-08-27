English | [中文](README.zh-CN.md)

# notify-hooks — DSH Event Notification Center

A dynamic Cordis plugin that ports Claude Code's [hooks sound notification best practice](https://github.com/shanraisshan/claude-code-best-practice) to DeepSeek Harness (DSH).

## Features

Subscribes to DSH Host events and pops up real-time toasts in the top-right corner of the Web GUI, with an optional alert sound:

| Host Event | Notification | Icon |
|---|---|---|
| `agent/status` → idle (only sent when the round included tool calls, 8s throttle) | Round complete, agent is idle | ✅ |
| `tools/result` (`isError: true`) | Tool execution failed | ❌ |
| `agent/error` | Agent error | ⚠️ |
| `subagent/end` | Subagent finished | 🤖 |
| `workflow/end` | Workflow run finished | 🧩 |
| `agent/session-start` | Session started | 🚀 |
| `tools/pre-execute` (shell command matches a dangerous pattern, **warn-only**, never blocks) | Dangerous command warning | 🛡️ |

The 🛡️ guard is the DSH counterpart of Claude Code's `PreToolUse` hook: a `tools/pre-execute` **waterfall** listener pattern-matches `pwsh`/`bash` command strings (rm -rf, format, dd, `git push --force`, fork bombs, curl-pipe-to-shell, …) and pushes a warning toast, then always `return next()` to let execution proceed.

## Architecture

```
DSH Host events ──ctx.on()──▶ Host half: in-memory ring buffer (50 entries, leaf fields only)
                                     │  harness.handle('notify/poll')
                                     ▼  (RPC is Client→Host only, hence polling at 1.5s)
                            Client half: shell.overlay slot renders the toast stack
                                     + React <audio> plays an embedded base64 WAV beep
```

Design notes:

- **Stateless protocol**: the Host returns its whole visible buffer (last 50 events) on every poll; the Client stamps a wall-clock `firstSeen` per `seq` and expires toasts after 9s locally. No cursors, no per-page lease — every poll response renders the same UI on every page.
- **Cross-instance shared store**: every `cordis_run` dispatches a *fresh* client instance into the page without retracting the previous one. All state therefore lives in a `window.__dshNotifyStoreV3` singleton so stacked instances can never diverge, and the component's initial `useState` snapshot reads the store so a slot re-projection remount never blanks visible toasts.
- **Audio unlock**: the browser autoplay policy requires a user gesture first — clicking the "🔕→🔔" toggle once unlocks audio and plays a test beep.
- **Clean lifecycle**: all listeners go through `ctx.on()`, timers through `ctx.interval`, and styles through `styles.insert`; everything is automatically disposed when the plugin stops or updates.

## Pitfalls (learned the hard way — read before writing your own plugin)

1. **Client packages do not auto-load on page load.** A page holds no dynamic package until a dispatch arrives (`cordis_run`, or pressing the Run card's start control). Refresh starts clean *by design* — after refreshing, re-run the plugin (or click its Run card) to get the client back.
2. **Repeated `cordis_run` in one page lifetime stacks client instances** — each dispatch loads a fresh copy and old ones may keep polling with stale `pluginRunId`s (their RPCs fail). Design for it: shared `window` store + idempotent writes, and after an update, refresh the page to shed the stacked instances.
3. **The Host sandbox has no `Date`** (and no `process`). Don't timestamp on the Host; stamp arrival times on the Client, or count events.
4. **Always pass an object as `host.call` args** — `host.call('m', null)` is rejected by the wire codec; use `host.call('m', {})`.
5. **Waterfall events** (e.g. `tools/pre-execute`) must `return next()` in every code path, including after a `catch`.
6. **Verify with a MutationObserver, not point-in-time DOM reads** — toasts expire in seconds; a slow inspection loop sees an empty DOM and sends you chasing ghosts.

## Usage

Dynamic Cordis plugins are process-level: inside a DSH session, have the agent read `host.js` / `client.js` in this directory and activate them via `cordis_define` + `cordis_run` (the Client half requires a one-time approval on the Run card). After restarting the DSH process, the plugin must be activated again. **After any plugin update, refresh the GUI page once** — each dispatch stacks a fresh client instance into the page, and a refresh sheds the stale ones (the store is shared, so no state is lost).

## Files

- `host.js` — Host half: event subscription + buffering + the `notify/poll` and `notify/test` RPCs
- `client.js` — Client half: overlay toast stack + sound toggle
