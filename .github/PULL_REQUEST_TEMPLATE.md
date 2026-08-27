## Summary

<!-- Briefly describe what this PR changes and why. -->

## Change Type

- [ ] `feat` — new plugin / preset / example / capability
- [ ] `fix` — bug fix
- [ ] `docs` — documentation only
- [ ] `refactor` / `chore` / `ci`

## Checklist

- [ ] Commit messages follow Conventional Commits (`feat:` / `docs:` / `fix:`)
- [ ] Documentation is bilingual: `README.md` (English) + `README.zh-CN.md` (中文) with the top interlink line, or this PR touches no user-facing docs
- [ ] Plugin: written in plain JavaScript (no TypeScript / JSX / import / require), lifecycle is reversible (`ctx.on()` / official disposer APIs)
- [ ] Plugin: verified locally in a real DSH session (`cordis_define` + `cordis_run`, Client approval granted)
- [ ] Preset: verified locally — mounts from `~/.dsh/.agent-presets/` and appears in the session preset selector (no shipped preset modified)
- [ ] Links in new/changed markdown files work (CI runs lychee)

## Related

<!-- Link the upstream Claude Code concept and/or related Issue. -->
