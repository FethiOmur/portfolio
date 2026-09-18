# Routine process notes — GitHub access workaround

The scheduled task's own instructions (step 2) call
`curl https://api.github.com/users/FethiOmur/repos?...` to discover new
repos. As of 2026-09-11 and again 2026-09-18, this session's GitHub proxy
rejects that call unconditionally:

> "This GitHub API path is not available: sessions are bound to their
> configured repositories. Use repository-scoped endpoints
> (repos/{owner}/{repo}/...)."

This is not fixable from inside a session — there is no tool available
here (checked: no `add_repo`-type tool, no session-scope API, `CronList`
shows this scheduled task isn't even managed through in-session cron) that
can widen a session's repository access. That is controlled by the
Claude Code on the web environment/trigger configuration for this
scheduled task, which only Fethi can change, from outside the chat.

**Workaround in place:** `docs/routine/watchlist.json` lists the known
project repos individually. The repo-scoped endpoint
(`api.github.com/repos/{owner}/{repo}`) works for a repo once it's been
added to this session's/trigger's repository access list — unlike the
account-wide listing endpoint, which is blocked no matter what.

**What each future run should do (until the stored task prompt itself is
updated to say this):**
1. Try the account-wide `users/FethiOmur/repos` call once, in case scope
   rules change. If it works, use it and this workaround is moot.
2. If it 403s, read `docs/routine/watchlist.json` and check each listed
   repo via `curl https://api.github.com/repos/{repo}`. Repos already in
   the session's access list return real data (pushed_at etc.); repos not
   yet added return a distinct 403 ("GitHub access to this repository is
   not enabled for this session") — report those by name so it's clear
   which specific repos still need to be added, rather than reporting a
   single generic block.
3. Any repo not yet in `watchlist.json` at all (a brand-new project) is
   invisible to this workaround too — it can only be found once Fethi adds
   it to both the watchlist and the session's repository access list.

**Action needed from Fethi (outside this session):** add the repos in
`watchlist.json` — and any new ones going forward — to this scheduled
task's environment/trigger repository access list in Claude Code on the
web. Until that's done, every run will keep reporting the same block for
each repo, individually, instead of a blanket "couldn't check anything."
