/* Gentle Yoga With Penny - site script.
   Kept intentionally small: back-to-top, map facade (click-to-load),
   next-class badge, sticky mobile CTA visibility. */

(function () {
  'use strict';

  // ---------- Back to top ----------
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.setAttribute('data-visible', window.scrollY > 300 ? 'true' : 'false');
    }, { passive: true });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Map facade (click to load Google Maps iframe) ----------
  document.querySelectorAll('.map-facade').forEach(function (button) {
    button.addEventListener('click', function () {
      var query = button.getAttribute('data-map-q');
      if (!query) return;
      var ariaLabel = button.getAttribute('aria-label') || 'Map';
      var iframe = document.createElement('iframe');
      iframe.setAttribute('title', ariaLabel.replace(/^Show map for /, 'Map: '));
      iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('class', 'class-card__map-iframe');
      iframe.setAttribute('src', 'https://maps.google.com/maps?q=' + query + '&output=embed');
      button.replaceWith(iframe);
    });
  });

  // ---------- Next-class badge ----------
  // Schedule in Europe/London local day/time. Each entry: day (0=Sun..6=Sat),
  // start "HH:MM", end "HH:MM", label, where.
  var schedule = [
    { day: 1, start: '19:45', end: '21:00', label: 'Monday evening',    where: 'Berkhamsted' },
    { day: 2, start: '12:30', end: '13:45', label: 'Tuesday lunchtime', where: 'Hemel Hempstead' },
    { day: 2, start: '14:00', end: '15:15', label: 'Tuesday afternoon', where: 'Hemel Hempstead' },
    { day: 3, start: '19:00', end: '20:15', label: 'Wednesday evening', where: 'Online via Zoom' },
    { day: 4, start: '14:00', end: '15:15', label: 'Thursday afternoon', where: 'Hemel Hempstead' }
  ];

  // Dates Penny isn't teaching, as [first, last] ISO date pairs. Synced from
  // .github/closures.txt into index.html by the rotate-events workflow.
  var closures = [];
  var closuresEl = document.getElementById('class-closures');
  if (closuresEl) {
    try { closures = JSON.parse(closuresEl.textContent) || []; } catch (e) { closures = []; }
  }

  function isClosed(iso) {
    return closures.some(function (range) { return iso >= range[0] && iso <= range[1]; });
  }

  function londonNow() {
    // Get current date in Europe/London without bringing in a tz library.
    var parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      year: 'numeric', month: '2-digit', day: '2-digit',
      weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
    }).formatToParts(new Date());
    var map = {};
    parts.forEach(function (p) { map[p.type] = p.value; });
    var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return {
      year: parseInt(map.year, 10),
      month: parseInt(map.month, 10),
      date: parseInt(map.day, 10),
      day: days[map.weekday],
      hour: parseInt(map.hour, 10) % 24,
      minute: parseInt(map.minute, 10)
    };
  }

  // ISO date (YYYY-MM-DD) of the London calendar day `offset` days from now.
  function isoDate(now, offset) {
    return new Date(Date.UTC(now.year, now.month - 1, now.date + offset)).toISOString().slice(0, 10);
  }

  function toMinutes(hhmm) {
    var parts = hhmm.split(':');
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }

  // Minutes until the entry's next class that isn't closed (-1 if on now),
  // plus whether a closure pushed it beyond its usual weekly slot.
  function nextOccurrence(entry, now) {
    var dayDiff = (entry.day - now.day + 7) % 7;
    var nowMinutes = now.hour * 60 + now.minute;
    if (dayDiff === 0 && nowMinutes >= toMinutes(entry.end)) {
      dayDiff = 7;
    }
    var skipped = false;
    for (var weeks = 0; weeks < 53 && isClosed(isoDate(now, dayDiff)); weeks++) {
      dayDiff += 7;
      skipped = true;
    }
    if (isClosed(isoDate(now, dayDiff))) {
      return { entry: entry, minutes: Infinity };
    }
    var minutes = dayDiff === 0 && nowMinutes >= toMinutes(entry.start)
      ? -1 // happening now
      : dayDiff * 24 * 60 + (toMinutes(entry.start) - nowMinutes);
    return { entry: entry, minutes: minutes, iso: isoDate(now, dayDiff), skipped: skipped };
  }

  // "Monday 4 January" for an ISO date.
  function formatDate(iso) {
    return new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC'
    });
  }

  function formatTime(hhmm) {
    var parts = hhmm.split(':');
    var h = parseInt(parts[0], 10);
    var m = parts[1];
    var suffix = h >= 12 ? 'pm' : 'am';
    var hour12 = h % 12 === 0 ? 12 : h % 12;
    return m === '00' ? hour12 + suffix : hour12 + '.' + m + suffix;
  }

  var nextClassEl = document.querySelector('[data-next-class]');
  if (nextClassEl) {
    var now = londonNow();
    var upcoming = schedule
      .map(function (entry) { return nextOccurrence(entry, now); })
      .sort(function (a, b) { return a.minutes - b.minutes; })[0];
    var timeEl = nextClassEl.querySelector('[data-next-class-time]');
    var whereEl = nextClassEl.querySelector('[data-next-class-where]');
    var labelEl = nextClassEl.querySelector('[data-next-class-label]');
    if (upcoming.minutes === -1) {
      if (labelEl) labelEl.textContent = 'Happening now';
      if (timeEl) timeEl.textContent = upcoming.entry.label;
    } else {
      if (labelEl) labelEl.textContent = 'Next class';
      // After a break, "Monday evening" would read as this coming Monday, so give the date.
      var when = upcoming.skipped ? formatDate(upcoming.iso) : upcoming.entry.label;
      if (timeEl) timeEl.textContent = when + ' at ' + formatTime(upcoming.entry.start);
    }
    if (whereEl) whereEl.textContent = upcoming.entry.where;
    // Everything closed for a year means the closures list is wrong; show nothing.
    if (upcoming.minutes !== Infinity) nextClassEl.hidden = false;
  }

  // ---------- Sticky mobile CTA visibility ----------
  // Show once the hero has scrolled out of view; hide near the footer to avoid overlap.
  var stickyCta = document.querySelector('.sticky-cta');
  if (stickyCta) {
    var hero = document.querySelector('.hero');
    var footer = document.querySelector('.site-footer');
    var showAfter = hero ? hero.offsetTop + hero.offsetHeight - 120 : 400;
    var update = function () {
      var scrolled = window.scrollY;
      var pastHero = scrolled > showAfter;
      var nearFooter = footer && (scrolled + window.innerHeight) > (footer.offsetTop + 60);
      stickyCta.setAttribute('data-visible', (pastHero && !nearFooter) ? 'true' : 'false');
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
})();
