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

## Architecture

```
DSH Host events ──ctx.on()──▶ Host half: in-memory ring buffer (50 entries, leaf fields only)
                                     │  harness.handle('notify/poll')
                                     ▼  (RPC is Client→Host only, hence polling at 1.5s)
                            Client half: shell.overlay slot renders the toast stack
                                     + React <audio> plays an embedded base64 WAV beep
```

Design notes:

- **Polling instead of push**: Cordis Package-private RPC only supports the Client→Host direction, so the Client uses the `timer` service to pull increments every 1.5s (tracked by a `seq` cursor).
- **Anti-interruption**: an idle-round notification requires at least one tool call since the last idle, and repeats are suppressed for 8 seconds; the first poll does not replay the historical buffer.
- **Audio unlock**: the browser autoplay policy requires a user gesture first — clicking the "🔕→🔔" toggle once unlocks audio and plays a test beep.
- **Clean lifecycle**: all listeners go through `ctx.on()`, timers through `ctx.timeout/interval`, and styles through `styles.insert`; everything is automatically disposed when the plugin stops or updates.

## Usage

Dynamic Cordis plugins are process-level: inside a DSH session, have the agent read `host.js` / `client.js` in this directory and activate them via `cordis_define` + `cordis_run` (the Client half requires a one-time approval on the Run card). After restarting the DSH process, the plugin must be activated again.

## Files

- `host.js` — Host half: event subscription + buffering + the `notify/poll` and `notify/test` RPCs
- `client.js` — Client half: overlay toast stack + sound toggle
