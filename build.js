const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// ── Configuration ──────────────────────────────────────────
const DIST = path.join(__dirname, 'dist');
const TEMPLATES = path.join(__dirname, 'templates');
const DATA_FILE = path.join(__dirname, 'site-data.yaml');

// ── Load data ──────────────────────────────────────────────
const data = yaml.load(fs.readFileSync(DATA_FILE, 'utf8'));
const currentYear = new Date().getFullYear();

// ── Helpers ────────────────────────────────────────────────

function readTemplate(name) {
  return fs.readFileSync(path.join(TEMPLATES, name), 'utf8');
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Simple {{variable}} replacement */
function render(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return vars[key] !== undefined ? vars[key] : match;
  });
}

// ── Generate class cards ───────────────────────────────────

function buildClassCards(classes) {
  return classes.map(cls => {
    const notes = cls.notes
      ? `<p class="class-card__notes">${escapeHtml(cls.notes.trim())}</p>`
      : '';

    const image = cls.image
      ? `<img src="images/${cls.image}" alt="${escapeHtml(cls.image_alt || cls.venue)}" class="class-card__image" width="400" height="200" loading="lazy">`
      : '';

    return `
      <article class="class-card fade-in">
        ${image}
        <p class="class-card__day">${escapeHtml(cls.day)}</p>
        <h3 class="class-card__name">${escapeHtml(cls.name)}</h3>
        <p class="class-card__detail">
          <svg class="class-card__detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          ${escapeHtml(cls.venue)}${cls.location !== 'Online' ? ', ' + escapeHtml(cls.location) : ''}
        </p>
        <p class="class-card__detail">
          <svg class="class-card__detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ${escapeHtml(cls.time)}
        </p>
        ${notes}
        <p class="class-card__price">${escapeHtml(cls.price)} <span>per session</span></p>
        <a href="contact.html" class="btn btn--secondary class-card__cta">Book this Class</a>
      </article>`;
  }).join('\n');
}

// ── Generate list items ────────────────────────────────────

function buildListItems(items) {
  return items.map(item => `        <li>${escapeHtml(item)}</li>`).join('\n');
}

// ── Page definitions ───────────────────────────────────────

const pages = [
  {
    slug: 'index.html',
    template: 'home.html',
    title: 'Home',
    description: data.business.tagline,
    navKey: 'home',
  },
  {
    slug: 'about.html',
    template: 'about.html',
    title: 'About Penny',
    description: 'About Penny Cronyn — British Wheel of Yoga qualified teacher since 2004',
    navKey: 'about',
  },
  {
    slug: 'contact.html',
    template: 'contact.html',
    title: 'Contact',
    description: 'Get in touch with Penny for class bookings and enquiries',
    navKey: 'contact',
  },
];

// ── Shared template variables ──────────────────────────────

const sharedVars = {
  business_name: data.business.name,
  business_tagline: data.business.tagline,
  business_email: data.business.email,
  business_phone: data.business.phone,
  business_phone_tel: data.business.phone.replace(/\s/g, ''),
  business_phone_display: data.business.phone_display,
  business_facebook_url: data.business.facebook_url,
  business_domain: data.business.domain,
  current_year: String(currentYear),

  // Home
  home_hero_heading: data.home.hero_heading,
  home_hero_subheading: data.home.hero_subheading,
  home_hero_image_alt: data.home.hero_image_alt,
  home_intro: data.home.intro.trim(),
  home_classes_heading: data.home.classes_heading,
  home_classes_subheading: data.home.classes_subheading,
  class_cards: buildClassCards(data.classes),

  // About
  about_heading: data.about.heading,
  about_quote: data.about.quote,
  about_intro: data.about.intro.trim(),
  about_training: data.about.training.trim(),
  about_experience_intro: data.about.experience_intro,
  experience_items: buildListItems(data.about.experience),
  about_bwy_summary: data.about.bwy_summary,
  about_bwy_info: data.about.bwy_info.trim(),
  bwy_benefit_items: buildListItems(data.about.bwy_benefits),

  // Contact
  contact_heading: data.contact.heading,
  contact_intro: data.contact.intro,
  contact_form_action: data.contact.form_action,
};

// ── Build ──────────────────────────────────────────────────

// Clean and create dist
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true });
}
fs.mkdirSync(DIST, { recursive: true });

const baseTemplate = readTemplate('base.html');

for (const page of pages) {
  const pageContent = readTemplate(page.template);
  const navAria = {
    nav_home_aria: page.navKey === 'home' ? 'aria-current="page"' : '',
    nav_about_aria: page.navKey === 'about' ? 'aria-current="page"' : '',
    nav_contact_aria: page.navKey === 'contact' ? 'aria-current="page"' : '',
  };

  const vars = {
    ...sharedVars,
    ...navAria,
    page_title: page.title,
    page_description: page.description,
    page_slug: page.slug === 'index.html' ? '' : page.slug,
    content: pageContent,
  };

  // Render page content into base, then resolve any remaining variables
  let html = render(baseTemplate, vars);
  // Second pass for variables inside the page content
  html = render(html, vars);

  fs.writeFileSync(path.join(DIST, page.slug), html);
  console.log(`  Built: ${page.slug}`);
}

// ── Copy static privacy policy ─────────────────────────────
const privacySource = path.join(__dirname, 'privacy-policy.html');
if (fs.existsSync(privacySource)) {
  fs.copyFileSync(privacySource, path.join(DIST, 'privacy-policy.html'));
  console.log('  Built: privacy-policy.html (copied)');
}

// ── Copy static assets ─────────────────────────────────────

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDirSync(path.join(__dirname, 'css'), path.join(DIST, 'css'));
copyDirSync(path.join(__dirname, 'images'), path.join(DIST, 'images'));

// Copy CNAME if it exists
const cnameSource = path.join(__dirname, 'CNAME');
if (fs.existsSync(cnameSource)) {
  fs.copyFileSync(cnameSource, path.join(DIST, 'CNAME'));
}

console.log('\n  Build complete! Output in dist/\n');
