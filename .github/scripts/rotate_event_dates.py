#!/usr/bin/env python3
"""Rotate Event startDate/endDate in JSON-LD blocks to the next future occurrence.

Walks each <script type="application/ld+json"> block in the given HTML files,
finds every Event with an eventSchedule.byDay (e.g. "Monday"), and rewrites
startDate/endDate to the next occurrence of that weekday on or after today
(Europe/London). Only the two date fields are touched, so the diff stays small.

If any HTML file changes, sitemap.xml lastmod is bumped to today.

Usage: python rotate_event_dates.py [path ...]
   With no args: defaults to ./index.html and ./classes/*.html relative to repo root.
"""
from __future__ import annotations

import json
import pathlib
import re
import sys
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

WEEKDAYS = {
    "Monday": 0, "Tuesday": 1, "Wednesday": 2, "Thursday": 3,
    "Friday": 4, "Saturday": 5, "Sunday": 6,
}
LONDON = ZoneInfo("Europe/London")
REPO = pathlib.Path(__file__).resolve().parents[2]

JSONLD_RE = re.compile(
    r'<script type="application/ld\+json">(.*?)</script>',
    re.DOTALL,
)


def next_date_for(day_name: str, ref: datetime) -> str:
    target = WEEKDAYS[day_name]
    delta = (target - ref.weekday() + 7) % 7
    return (ref + timedelta(days=delta)).strftime("%Y-%m-%d")


def collect_events(node):
    out = []
    if isinstance(node, dict):
        if node.get("@type") == "Event":
            out.append(node)
        for v in node.values():
            out.extend(collect_events(v))
    elif isinstance(node, list):
        for item in node:
            out.extend(collect_events(item))
    return out


def update_event_dates(text: str, event_name: str, new_start: str, new_end: str) -> str:
    """Targeted replacement of startDate/endDate within ~2KB of the event's name field."""
    name_pat = re.compile(r'"name"\s*:\s*"' + re.escape(event_name) + r'"')
    m = name_pat.search(text)
    if not m:
        return text
    head = text[: m.end()]
    window = text[m.end(): m.end() + 2000]
    tail = text[m.end() + 2000:]
    window = re.sub(
        r'"startDate"\s*:\s*"[^"]*"',
        f'"startDate": "{new_start}"',
        window,
        count=1,
    )
    window = re.sub(
        r'"endDate"\s*:\s*"[^"]*"',
        f'"endDate": "{new_end}"',
        window,
        count=1,
    )
    return head + window + tail


def update_html(path: pathlib.Path, today: datetime) -> bool:
    text = path.read_text(encoding="utf-8")
    original = text
    for m in JSONLD_RE.finditer(text):
        try:
            data = json.loads(m.group(1))
        except json.JSONDecodeError:
            continue
        for event in collect_events(data):
            sched = event.get("eventSchedule") or {}
            day = sched.get("byDay")
            start_time = sched.get("startTime")
            end_time = sched.get("endTime")
            name = event.get("name")
            if not (day in WEEKDAYS and start_time and end_time and name):
                continue
            date = next_date_for(day, today)
            text = update_event_dates(
                text, name, f"{date}T{start_time}", f"{date}T{end_time}"
            )
    if text != original:
        path.write_text(text, encoding="utf-8")
        return True
    return False


SITEMAP_LASTMOD_RE = re.compile(r"<lastmod>\d{4}-\d{2}-\d{2}</lastmod>")


def bump_sitemap(today: datetime) -> bool:
    sitemap = REPO / "sitemap.xml"
    if not sitemap.exists():
        return False
    text = sitemap.read_text(encoding="utf-8")
    today_str = today.strftime("%Y-%m-%d")
    new_text = SITEMAP_LASTMOD_RE.sub(f"<lastmod>{today_str}</lastmod>", text)
    if new_text != text:
        sitemap.write_text(new_text, encoding="utf-8")
        return True
    return False


def main(argv):
    today = datetime.now(LONDON)
    if len(argv) > 1:
        paths = [pathlib.Path(a) for a in argv[1:]]
    else:
        paths = [REPO / "index.html"]
        classes_dir = REPO / "classes"
        if classes_dir.is_dir():
            paths.extend(sorted(classes_dir.glob("*.html")))

    html_changed = False
    for p in paths:
        if p.is_file() and update_html(p, today):
            print(f"updated events in {p.relative_to(REPO)}")
            html_changed = True

    if html_changed and bump_sitemap(today):
        print("bumped sitemap.xml lastmod")

    if not html_changed:
        print("no event date changes needed")


if __name__ == "__main__":
    main(sys.argv)
