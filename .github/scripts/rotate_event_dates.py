#!/usr/bin/env python3
"""Rotate Event startDate/endDate in JSON-LD blocks to the next future occurrence.

Walks each <script type="application/ld+json"> block in the given HTML files,
finds every Event with an eventSchedule.byDay (e.g. "Monday"), and rewrites
startDate/endDate to the next occurrence of that weekday on or after today
(Europe/London), skipping any date listed in .github/closures.txt. Only the two
date fields are touched, so the diff stays small.

sitemap.xml is deliberately left alone: a JSON-LD date tick is not a content
change, and lastmod is only useful to Google if it reflects real edits.

Usage: python rotate_event_dates.py [path ...]
   With no args: defaults to ./index.html and ./classes/*/index.html relative to repo root.
"""
from __future__ import annotations

import json
import pathlib
import re
import sys
from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo

WEEKDAYS = {
    "Monday": 0, "Tuesday": 1, "Wednesday": 2, "Thursday": 3,
    "Friday": 4, "Saturday": 5, "Sunday": 6,
}
LONDON = ZoneInfo("Europe/London")
REPO = pathlib.Path(__file__).resolve().parents[2]
CLOSURES = REPO / ".github" / "closures.txt"

JSONLD_RE = re.compile(
    r'<script type="application/ld\+json">(.*?)</script>',
    re.DOTALL,
)


def load_closures(path: pathlib.Path = CLOSURES) -> set[date]:
    """Read closure dates: one YYYY-MM-DD or YYYY-MM-DD..YYYY-MM-DD per line, # for comments."""
    closed: set[date] = set()
    if not path.exists():
        return closed
    for lineno, raw in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        line = raw.split("#", 1)[0].strip()
        if not line:
            continue
        try:
            if ".." in line:
                first, last = (date.fromisoformat(part.strip()) for part in line.split("..", 1))
            else:
                first = last = date.fromisoformat(line)
        except ValueError:
            sys.exit(f"{path.name}:{lineno}: cannot parse {raw.strip()!r}")
        if last < first:
            sys.exit(f"{path.name}:{lineno}: range ends before it starts")
        while first <= last:
            closed.add(first)
            first += timedelta(days=1)
    return closed


def next_date_for(day_name: str, ref: datetime, closed: set[date]) -> str:
    target = WEEKDAYS[day_name]
    candidate = ref.date() + timedelta(days=(target - ref.weekday() + 7) % 7)
    # A year of weekly occurrences; if every one is closed the closures file is wrong.
    for _ in range(53):
        if candidate not in closed:
            return candidate.strftime("%Y-%m-%d")
        candidate += timedelta(days=7)
    sys.exit(f"no open {day_name} within a year; check {CLOSURES.name}")


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


def update_html(path: pathlib.Path, today: datetime, closed: set[date]) -> bool:
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
            when = next_date_for(day, today, closed)
            text = update_event_dates(
                text, name, f"{when}T{start_time}", f"{when}T{end_time}"
            )
    if text != original:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main(argv):
    today = datetime.now(LONDON)
    closed = load_closures()
    if len(argv) > 1:
        paths = [pathlib.Path(a) for a in argv[1:]]
    else:
        paths = [REPO / "index.html"]
        classes_dir = REPO / "classes"
        if classes_dir.is_dir():
            paths.extend(sorted(classes_dir.glob("*/index.html")))

    html_changed = False
    for p in paths:
        if p.is_file() and update_html(p, today, closed):
            print(f"updated events in {p.relative_to(REPO)}")
            html_changed = True

    if not html_changed:
        print("no event date changes needed")


if __name__ == "__main__":
    main(sys.argv)
