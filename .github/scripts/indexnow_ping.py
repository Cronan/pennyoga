#!/usr/bin/env python3
"""Submit changed page URLs to IndexNow (api.indexnow.org).

Reads the push range from BEFORE/AFTER (set by the workflow), maps changed
site files to their public URLs, and POSTs them in one request. On a manual
run, or when the range is unusable, every URL in sitemap.xml is sent instead.
Standard library only; runs in CI, never locally.
"""
from __future__ import annotations

import json
import os
import pathlib
import re
import subprocess
import sys
import urllib.request

REPO = pathlib.Path(__file__).resolve().parents[2]
HOST = "pennyoga.co.uk"
KEY_FILE = next(REPO.glob("[0-9a-f]" * 32 + ".txt"), None)
ENDPOINT = "https://api.indexnow.org/indexnow"


def to_url(path: str) -> str | None:
    if path.endswith("/index.html"):
        path = path[: -len("index.html")]
    elif path == "index.html":
        path = ""
    if not (path.endswith((".html", ".xml", ".txt")) or path.endswith("/") or path == ""):
        return None
    if path.startswith((".github/", "_")) or path == "404.html":
        return None
    return f"https://{HOST}/{path}"


def changed_files(before: str, after: str) -> list[str] | None:
    if not before or set(before) == {"0"} or not after:
        return None
    try:
        out = subprocess.check_output(
            ["git", "diff", "--name-only", "--diff-filter=AMR", before, after],
            cwd=REPO, text=True,
        )
    except subprocess.CalledProcessError:
        return None
    return out.split()


def sitemap_urls() -> list[str]:
    text = (REPO / "sitemap.xml").read_text(encoding="utf-8")
    return re.findall(r"<loc>([^<]+)</loc>", text)


def main() -> int:
    if KEY_FILE is None:
        print("no IndexNow key file at repo root; nothing sent")
        return 1
    key = KEY_FILE.read_text(encoding="utf-8").strip()
    if key != KEY_FILE.stem:
        print("key file name and contents differ; nothing sent")
        return 1

    files = None
    if os.environ.get("EVENT") == "push":
        files = changed_files(os.environ.get("BEFORE", ""), os.environ.get("AFTER", ""))
    if files is None:
        urls = sitemap_urls()
    else:
        urls = sorted({u for u in (to_url(f) for f in files) if u})
        if "sitemap.xml" in files or "llms.txt" in files:
            urls = sorted(set(urls) | set(sitemap_urls()))
    if not urls:
        print("no public URLs changed; nothing sent")
        return 0

    body = json.dumps({
        "host": HOST,
        "key": key,
        "keyLocation": f"https://{HOST}/{KEY_FILE.name}",
        "urlList": urls,
    }).encode("utf-8")
    req = urllib.request.Request(
        ENDPOINT, data=body, method="POST",
        headers={"Content-Type": "application/json; charset=utf-8"},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            status = resp.status
    except urllib.error.HTTPError as e:
        status = e.code
    print(f"IndexNow {status} for {len(urls)} URL(s):")
    for u in urls:
        print("  " + u)
    # 200 = received, 202 = received, key pending verification. Anything else is a config problem.
    return 0 if status in (200, 202) else 1


if __name__ == "__main__":
    sys.exit(main())
