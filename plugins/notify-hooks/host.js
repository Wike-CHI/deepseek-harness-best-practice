// notify-hooks — Host half (plain JavaScript, no imports; evaluated by the DSH dynamic Cordis runtime)
// Subscribes to Host events and keeps a ring buffer of notifications for the Client half to poll.
return {
  apply(ctx) {
    const items = []
    let seq = 0
    let workedSinceIdle = 0
    let lastIdleNotifyAt = 0

    // PreToolUse guard patterns: matched against pwsh/bash command strings.
    // Warn-only by design — the listener always returns next() and never blocks.
    const DANGEROUS = [
      { re: /\brm\s+(-[a-zA-Z]+\s+)*-[a-zA-Z]*r[a-zA-Z]*f/i, label: 'rm -rf 递归强删' },
      { re: /Remove-Item[\s\S]*-Recurse[\s\S]*-Force/i, label: 'Remove-Item -Recurse -Force 递归强删' },
      { re: /\bformat\s+[a-zA-Z]:/i, label: 'format 磁盘格式化' },
      { re: /\bmkfs\b/i, label: 'mkfs 创建文件系统' },
      { re: /\bdd\s+if=/i, label: 'dd 原始磁盘写入' },
      { re: /git\s+push[\s\S]*--force/i, label: 'git push --force 强制推送' },
      { re: /:\(\)\s*\{\s*:\|:/, label: 'fork 炸弹' },
      { re: /(curl|iwr|Invoke-WebRequest)[^\n|]*\|\s*(sudo\s+)?(bash|sh|pwsh|powershell)/i, label: '管道执行远程脚本' },
    ]

    function nowMs() { try { return Date.now() } catch (e) { return 0 } }
    function clock() {
      try {
        const d = new Date()
        const p = (n) => (n < 10 ? '0' + n : '' + n)
        return p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds())
      } catch (e) { return '' }
    }
    function push(kind, title, detail) {
      seq += 1
      items.push({
        seq: seq,
        kind: kind,
        title: String(title == null ? '' : title).slice(0, 80),
        detail: String(detail == null ? '' : detail).slice(0, 200),
        at: clock(),
      })
      if (items.length > 50) items.splice(0, items.length - 50)
    }

    // PreToolUse counterpart: waterfall listener, warn-only passthrough
    // (a waterfall listener MUST call and return next() to keep the dispatch alive).
    ctx.on('tools/pre-execute', (exec, next) => {
      try {
        const name = exec && exec.name ? String(exec.name) : ''
        if (name === 'pwsh' || name === 'bash') {
          const cmd = exec && exec.arguments && typeof exec.arguments.command === 'string' ? exec.arguments.command : ''
          for (let i = 0; i < DANGEROUS.length; i++) {
            if (DANGEROUS[i].re.test(cmd)) {
              push('guard-warn', '危险命令提醒: ' + DANGEROUS[i].label, cmd.slice(0, 160))
              break
            }
          }
        }
      } catch (e) {}
      return next()
    })

    ctx.on('tools/result', (exec, result) => {
      try {
        workedSinceIdle += 1
        if (result && result.isError === true) {
          push('tool-error', '工具执行失败: ' + (exec && exec.name ? exec.name : 'unknown'), '')
        }
      } catch (e) {}
    })

    ctx.on('agent/status', (payload) => {
      try {
        if (!payload || payload.status !== 'idle') return
        if (workedSinceIdle > 0) {
          const t = nowMs()
          if (t - lastIdleNotifyAt > 8000) {
            lastIdleNotifyAt = t
            push('turn-done', '回合完成，代理已空闲', '距上次空闲以来执行了 ' + workedSinceIdle + ' 次工具调用')
          }
        }
        workedSinceIdle = 0
      } catch (e) {}
    })

    ctx.on('agent/error', (payload) => {
      try {
        const err = payload && payload.error
        const msg = err && err.message ? err.message : String(err == null ? 'unknown' : err)
        push('agent-error', '代理出错 (turn ' + (payload && payload.turn != null ? payload.turn : '?') + ')', msg)
      } catch (e) {}
    })

    ctx.on('subagent/end', (info) => {
      try {
        push('subagent-end', '子代理结束: ' + (info && info.provider ? info.provider : 'unknown'), 'stopReason: ' + (info && info.stopReason ? info.stopReason : 'unknown'))
      } catch (e) {}
    })

    ctx.on('workflow/end', () => {
      try { push('workflow-end', '工作流运行结束', '') } catch (e) {}
    })

    ctx.on('agent/session-start', () => {
      try { push('session-start', '会话已开始', '') } catch (e) {}
    })

    harness.handle('notify/poll', (args) => {
      const after = args && typeof args.after === 'number' ? args.after : 0
      return { items: items.filter((i) => i.seq > after), last: seq }
    })

    harness.handle('notify/test', () => {
      push('turn-done', '测试通知', '通知链路工作正常')
      return { ok: true }
    })

    console.log('notify-hooks host ready')
  },
}
