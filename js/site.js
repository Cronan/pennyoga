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
      var iframe = document.createElement('iframe');
      iframe.src = 'https://maps.google.com/maps?q=' + query + '&output=embed';
      iframe.title = (button.getAttribute('aria-label') || 'Map').replace(/^Show map for /, 'Map: ');
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.setAttribute('allowfullscreen', '');
      iframe.className = 'class-card__map-iframe';
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

  function londonNow() {
    // Get current date in Europe/London without bringing in a tz library.
    var parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
    }).formatToParts(new Date());
    var map = {};
    parts.forEach(function (p) { map[p.type] = p.value; });
    var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return {
      day: days[map.weekday],
      hour: parseInt(map.hour, 10),
      minute: parseInt(map.minute, 10)
    };
  }

  function minutesUntil(entry, now) {
    var dayDiff = (entry.day - now.day + 7) % 7;
    var startParts = entry.start.split(':');
    var entryMinutes = parseInt(startParts[0], 10) * 60 + parseInt(startParts[1], 10);
    var nowMinutes = now.hour * 60 + now.minute;
    var endParts = entry.end.split(':');
    var entryEnd = parseInt(endParts[0], 10) * 60 + parseInt(endParts[1], 10);
    if (dayDiff === 0 && nowMinutes >= entryMinutes && nowMinutes < entryEnd) {
      return -1; // happening now
    }
    if (dayDiff === 0 && nowMinutes >= entryEnd) {
      dayDiff = 7;
    }
    return dayDiff * 24 * 60 + (entryMinutes - nowMinutes);
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
      .map(function (entry) { return { entry: entry, minutes: minutesUntil(entry, now) }; })
      .sort(function (a, b) { return a.minutes - b.minutes; })[0];
    var timeEl = nextClassEl.querySelector('[data-next-class-time]');
    var whereEl = nextClassEl.querySelector('[data-next-class-where]');
    var labelEl = nextClassEl.querySelector('[data-next-class-label]');
    if (upcoming.minutes === -1) {
      if (labelEl) labelEl.textContent = 'Happening now';
      if (timeEl) timeEl.textContent = upcoming.entry.label;
    } else {
      if (labelEl) labelEl.textContent = 'Next class';
      if (timeEl) timeEl.textContent = upcoming.entry.label + ' at ' + formatTime(upcoming.entry.start);
    }
    if (whereEl) whereEl.textContent = upcoming.entry.where;
    nextClassEl.hidden = false;
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
