#!/usr/bin/env python3
"""Fetch FethiOmur's public non-fork repos and their top contributor, write docs/routine/repos-manifest.json.

Runs on GitHub's own Actions infrastructure (not the constrained agent-session proxy),
so the weekly portfolio-projects routine can read this file instead of calling the
GitHub API for account-wide repo listing, which that session's egress policy blocks.
"""
import json
import os
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone

OWNER = "FethiOmur"
API = "https://api.github.com"
OUTPUT_PATH = "docs/routine/repos-manifest.json"

TOKEN = os.environ.get("GH_TOKEN", "")


def api_get(path, params=None):
    url = f"{API}{path}"
    if params:
        query = "&".join(f"{k}={v}" for k, v in params.items())
        url = f"{url}?{query}"
    req = urllib.request.Request(url)
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("X-GitHub-Api-Version", "2022-11-28")
    if TOKEN:
        req.add_header("Authorization", f"Bearer {TOKEN}")
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.status, json.loads(resp.read().decode("utf-8") or "null")


def paginate(path, params=None, per_page=100, max_pages=10):
    items = []
    page = 1
    while page <= max_pages:
        p = dict(params or {})
        p["per_page"] = per_page
        p["page"] = page
        status, data = api_get(path, p)
        if not data:
            break
        items.extend(data)
        if len(data) < per_page:
            break
        page += 1
    return items


def get_contributors(owner, repo):
    """GitHub computes contributor stats async; retry on 202 while it warms up."""
    for attempt in range(5):
        try:
            status, data = api_get(f"/repos/{owner}/{repo}/contributors", {"per_page": 100, "anon": "0"})
        except urllib.error.HTTPError as e:
            if e.code == 202:
                time.sleep(2)
                continue
            if e.code == 204:
                return []
            raise
        if status == 202:
            time.sleep(2)
            continue
        return data or []
    return []


def main():
    repos = paginate(f"/users/{OWNER}/repos", {"sort": "pushed", "type": "owner"})

    manifest_repos = []
    for repo in repos:
        if repo.get("fork"):
            continue
        name = repo["name"]
        try:
            contributors = get_contributors(OWNER, name)
        except urllib.error.HTTPError as e:
            contributors = []
            print(f"WARN: contributors fetch failed for {name}: HTTP {e.code}")

        total = sum(c.get("contributions", 0) for c in contributors)
        top = max(contributors, key=lambda c: c.get("contributions", 0)) if contributors else None
        top_login = top.get("login") if top else None
        top_contributions = top.get("contributions", 0) if top else 0
        top_share = round(top_contributions / total, 4) if total else None

        manifest_repos.append(
            {
                "name": name,
                "full_name": repo.get("full_name"),
                "html_url": repo.get("html_url"),
                "description": repo.get("description"),
                "language": repo.get("language"),
                "topics": repo.get("topics", []),
                "private": repo.get("private", False),
                "archived": repo.get("archived", False),
                "created_at": repo.get("created_at"),
                "pushed_at": repo.get("pushed_at"),
                "updated_at": repo.get("updated_at"),
                "stargazers_count": repo.get("stargazers_count", 0),
                "contributors": [
                    {"login": c.get("login"), "contributions": c.get("contributions")}
                    for c in contributors
                ],
                "top_contributor_login": top_login,
                "top_contributor_share": top_share,
                "is_owner_majority": bool(
                    top_login and top_login.lower() == OWNER.lower() and (top_share or 0) > 0.5
                ),
            }
        )

    manifest = {
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "owner": OWNER,
        "repos": manifest_repos,
    }

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(manifest, f, indent=2)
        f.write("\n")

    print(f"Wrote {len(manifest_repos)} non-fork repos to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
