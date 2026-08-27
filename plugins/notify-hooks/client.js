// notify-hooks — Client half (plain JavaScript; React via the closure-provided React, no JSX)
// Renders the toast stack in shell.overlay. State lives in a window-shared store so that
// repeated dispatches in one page lifetime (each cordis_run loads a fresh client instance)
// never diverge: every instance reads/writes the same store, and TTL expiry is an
// idempotent wall-clock comparison rather than a mutable countdown.
return {
  inject: ['timer'],
  apply(ctx) {
    const slots = ctx.get('slots')
    if (slots === undefined) return

    const BEEP = 'data:audio/wav;base64,UklGRgQHAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YeAGAACAwOLXpWEsHjx6ut/ZqmgxHzl0tNzarm42IDZurtjas3Q7IjRpqNXbt3pAJDJjotHbu4BGJjBenM3avoZLKS9alsjZwYtQLC5VkcTYxJBWLy1Ri7/WxpVbMi1OhbvVyJphNi1KgLbTyp9mOi1He7HQy6NsPS5EdqzOzKdxQi9CcafLzKt2RjFAbKLIzK57SjI+aJ3EzLGATzQ8ZJjBzLSFUzY7YJO9y7eJWDk7XI65yrmOXDs6WYm1ybuSYT46VYWxx72WZkE6U4Ctxr6aakU6UHypxL+eb0g7TnelwcChc0s8THOhv8CkeE89Sm+cvMCnfFM+SGyYusCqgFZAR2iUt8CshFpCRmWQs7+uiF5ERWKMsL+wjGJGRV+Irb6yj2ZJRVyEqryzk2pLRVqApru0lm5ORVh8o7m1mXFRRlZ5n7e2nHVUR1R1nLW2nnlXSFJymLO2oXxaSVFvlLG2o4BdSlBska62pYNgTE9pjau1p4djTU9miqm1qYpnT05kh6a0qo1qUU5ig6Ozq5BtU05ggKCyrJJxVk5efZ2wrZV0WE9cepqurZd3W1Bbd5etrpp6XVBZdJSrrpx9YFFYcpGprp6AYlNYb46nrp+DZVRXbYulraGGaFVWaoiiraKIa1dWaIagrKOLbVlWZ4Oeq6SNcFpWZYCbqqWQc1xWY32ZqaaSdl5XYnuWp6aUeGBXYXiUpqeWe2NYX3aRpKeXfmVZX3SPoqeZgGdaXnKMoaaagmlbXXCKn6achWxcXW6Hnaadh25dXWyFm6WeiXBfXWqCmaSfi3NgXWmAl6OfjXViXWh+laKgj3dkXWd8k6GgkXplXmV6kaCgknxnXmV4jp6hlH5pX2R2jJ2hlYBrYGN0ipygloJtYWNyiJqgl4RvYmJxhpigmIZxY2JvhJefmYhzZGJugpWemol1ZWJtgJOemot3Z2JsfpKdm415aGNrfJCcm457amNqe46bm498a2NpeYyam5F+bWRod4qZm5KAbmVodomXm5OCcGZndIeWm5SDcmZnc4WVm5WFc2dncoOTmpWHdWhncYKSmpaId2lncICQmZaJeGtnb36PmJeLemxnbn2NmJeMe21nbXuMl5eNfW5obXqKlpeOf3BobHmJlZePgHFpbHeHlJeQgXJqa3aGk5eRg3Rqa3WEkZeRhHVra3SDkJaShXdsa3OBj5aSh3hta3KAjpWTiHlua3F/jJSTiXtva3F9i5STinxwa3B8ipOTi31xbHB7iZKUjH9ybG96h5GUjYBzbW95hpGTjYF1bW54hZCTjoJ2bm53hI+Tj4R3bm52go6Tj4V4b251gY2SkIZ5cG50gIySkId6cW50f4uRkIh8cm5zfomRkIh9c29zfYiQkIl+c29yfIePkIp/dG9ye4aPkIuAdXBxeoWOkIuBdnBxeYSNkIyCd3FxeIOMkIyDeHFxeIKMkI2EeXJxd4GLj42FenJxdoCKj42FenJxdoCKj42FenJxdoCKj42FenJxdoCKj42Ge3Nxdn+Jj46GfHRxdX6Ijo6HfXVxdX2Hjo6IfnVydHyGjY6If3ZydHyFjI6JgHdydHuEjI6KgXhzdHqDi46Kgnlzc3mDio2Kg3p0c3iBiY2LhHt1c3iAiI2LhXx1c3d/h4yLhX12c3d+h4yMhn52dHZ+houMh353dHZ9hYuMh394dHZ8hIqMiIB4dHZ8hIqMiIF5dXV7g4mMiIF6dXV6gomLiYJ7dXV6gYiLiYN7dnV5gYiLiYN8dnV5gIeLioR9d3V5f4aKioV9d3V4f4aKioV+eHZ4foWKioZ/eHZ4fYSJioZ/eXZ3fYSJioaAenZ3fIOIioeBenZ3fIKIioeBe3d3e4KHioeCe3d3e4GHiYiCfHh3e4GGiYiDfXh3en+FiYiEfnl3eX+FiIiEfnl3eX6EiIiFf3p3eX6EiIiFf3p3eX6EiIiFf3p4eX2Dh4iFgHt4eX2Dh4iGgXt4eXyCh4iGgXx4eHyChoiGgnx5eHyBhoiGgn15eHuAhYiHgn15eHuAhYiHg356eHuAhIeHg356eHt/hIeHhH96eXp/hIeHhH97eXp+g4eHhIB7eXp+g4aHhYB7eXp9goaHhYB8eXp9gYWHhYF9enp8gYWHhYJ9enp8gIWHhoJ+enp8gISGhoJ+e3p8gISGhoN+e3p7f4OGhoN/e3p7f4OGhoSAfHp7foKFhoSAfHp7foKFhoSAfXp7fYGFhoSBfXp7fYGEhoSBfXt7fYGEhoWBfnt7fYCEhoWCfnt7fICDhYWCf3x7fH+DhYWDf3x7fH+ChYWDgHx7fH6ChIWDgH17fH6ChIWDgA=='

    const KIND_META = {
      'turn-done': { icon: '✅', color: '#22c55e' },
      'tool-error': { icon: '❌', color: '#ef4444' },
      'agent-error': { icon: '⚠️', color: '#f59e0b' },
      'subagent-end': { icon: '🤖', color: '#3b82f6' },
      'workflow-end': { icon: '🧩', color: '#a855f7' },
      'session-start': { icon: '🚀', color: '#14b8a6' },
      'guard-warn': { icon: '🛡️', color: '#f97316' },
    }

    const TTL_MS = 9000

    styles.insert([
      '.dsh-notify-root{position:fixed;top:12px;right:12px;z-index:9999;width:320px;pointer-events:none}',
      '.dsh-notify-bar{display:flex;justify-content:flex-end;gap:6px;margin-bottom:6px;pointer-events:auto}',
      '.dsh-notify-btn{border:1px solid rgba(128,128,128,.35);background:rgba(30,32,38,.85);color:#e5e7eb;border-radius:999px;padding:3px 10px;font-size:12px;cursor:pointer;backdrop-filter:blur(6px)}',
      '.dsh-notify-card{pointer-events:auto;display:flex;gap:8px;align-items:flex-start;background:rgba(24,26,32,.94);color:#e5e7eb;border:1px solid rgba(255,255,255,.08);border-left:3px solid #666;border-radius:10px;padding:10px 12px;margin-bottom:8px;box-shadow:0 6px 24px rgba(0,0,0,.35);cursor:pointer;backdrop-filter:blur(8px)}',
      '.dsh-notify-body{flex:1;min-width:0}',
      '.dsh-notify-title{font-size:13px;font-weight:600;line-height:1.35}',
      '.dsh-notify-detail{font-size:12px;opacity:.75;margin-top:2px;word-break:break-all}',
    ].join('\n'))

    function nowMs() { try { return Date.now() } catch (e) { return 0 } }

    // Cross-instance shared store: one page may host several client instances
    // (every cordis_run dispatches a fresh one). They must never diverge.
    const store = (function () {
      try {
        if (typeof window !== 'undefined') {
          if (!window.__dshNotifyStoreV3) {
            window.__dshNotifyStoreV3 = { firstSeen: {}, dismissed: {}, latest: [], soundOn: false, soundTick: 0, primedMaxSeq: 0, listeners: [] }
          }
          return window.__dshNotifyStoreV3
        }
      } catch (e) {}
      return { firstSeen: {}, dismissed: {}, latest: [], soundOn: false, soundTick: 0, primedMaxSeq: 0, listeners: [] }
    })()

    function computeToasts() {
      const now = nowMs()
      return store.latest.filter((item) => {
        if (!item || typeof item.seq !== 'number') return false
        if (store.dismissed[item.seq]) return false
        const t0 = store.firstSeen[item.seq]
        return typeof t0 === 'number' && now - t0 <= TTL_MS
      }).slice(-6)
    }
    function emit() {
      const snap = { toasts: computeToasts(), soundOn: store.soundOn, soundTick: store.soundTick }
      store.listeners.forEach((fn) => { try { fn(snap) } catch (e) {} })
    }

    function poll() {
      let p
      try { p = host.call('notify/poll', {}) } catch (e) { return } // NOTE: null args are rejected by the wire codec — always pass {}
      if (!p || typeof p.then !== 'function') return
      p.then((res) => {
        if (!res || !Array.isArray(res.items)) return
        const now = nowMs()
        let maxNew = 0
        res.items.forEach((item) => {
          if (!item || typeof item.seq !== 'number') return
          if (typeof store.firstSeen[item.seq] !== 'number') {
            store.firstSeen[item.seq] = now
            if (store.primedMaxSeq > 0 && item.seq > maxNew) maxNew = item.seq
          }
        })
        if (store.primedMaxSeq === 0) {
          // first poll establishes the baseline; history does not beep
          res.items.forEach((item) => { if (item && typeof item.seq === 'number' && item.seq > store.primedMaxSeq) store.primedMaxSeq = item.seq })
        } else if (maxNew > 0 && store.soundOn) {
          store.soundTick += 1
        }
        if (maxNew > store.primedMaxSeq) store.primedMaxSeq = maxNew
        store.latest = res.items.slice()
        emit()
      }).catch(() => {})
    }
    ctx.interval(poll, 1500)

    function metaOf(kind) { return KIND_META[kind] || { icon: '🔔', color: '#94a3b8' } }

    function NotifyOverlay() {
      // initial snapshot reads the shared store: a remount never blanks visible toasts
      const [snap, setSnap] = React.useState({ toasts: computeToasts(), soundOn: store.soundOn, soundTick: store.soundTick })
      React.useEffect(() => {
        const fn = (s) => setSnap(s)
        store.listeners.push(fn)
        return () => { store.listeners = store.listeners.filter((f) => f !== fn) }
      }, [])

      const toggleSound = () => {
        store.soundOn = !store.soundOn
        if (store.soundOn) store.soundTick += 1
        emit()
      }

      const children = []
      children.push(React.createElement('div', { key: 'bar', className: 'dsh-notify-bar' },
        React.createElement('button', { className: 'dsh-notify-btn', onClick: toggleSound }, snap.soundOn ? '🔔 声音开' : '🔕 声音关'),
        snap.toasts.length > 0
          ? React.createElement('button', { className: 'dsh-notify-btn', onClick: () => { snap.toasts.forEach((t) => { store.dismissed[t.seq] = true }); emit() } }, '清空')
          : null,
      ))
      if (snap.soundOn && snap.soundTick > 0) {
        children.push(React.createElement('audio', { key: 'beep-' + snap.soundTick, autoPlay: true, src: BEEP, style: { display: 'none' } }))
      }
      snap.toasts.forEach((t) => {
        const m = metaOf(t.kind)
        children.push(React.createElement('div', {
          key: 'toast-' + t.seq,
          className: 'dsh-notify-card',
          style: { borderLeftColor: m.color },
          onClick: () => { store.dismissed[t.seq] = true; emit() },
        },
          React.createElement('span', null, m.icon),
          React.createElement('div', { className: 'dsh-notify-body' },
            React.createElement('div', { className: 'dsh-notify-title' }, t.title),
            t.detail ? React.createElement('div', { className: 'dsh-notify-detail' }, t.detail) : null,
          ),
        ))
      })
      return React.createElement('div', { className: 'dsh-notify-root' }, children)
    }

    slots.inject('shell.overlay', () => slots.register(
      { name: 'shell.overlay', id: 'dsh-notify', order: 300, label: '事件通知' },
      () => React.createElement(NotifyOverlay),
    ))
  },
}
