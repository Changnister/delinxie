# CLAUDE.md — Portfolio & Consulting Website

## Project purpose
Personal website for a newly retired professional launching consulting and speaking services. The site must convey gravitas, accessibility, and a clear call-to-action for prospective clients and event organisers. It is **not** a job-seeker portfolio — the owner is the expert being hired.

## Owner profile (fill in before first session)
```
Name:          [FULL NAME]
Former title:  [e.g., Chief Medical Officer, VP of Engineering]
Industry:      [e.g., healthcare, finance, technology]
Consulting:    [1-sentence specialty — e.g., "hospital operations and digital health strategy"]
Speaking:      [1-sentence topic area — e.g., "leadership in the age of AI"]
Tone:          [e.g., authoritative-but-warm / academic / no-nonsense]
Primary CTA:   [e.g., "Book a call" / "Inquire about speaking" / both]
```

## Site structure (fixed — do not add pages without asking)
```
/               Home — hero, value prop, trust signals
/about          Full bio, philosophy, career highlights
/consulting     Services, process, who it's for, FAQ
/speaking       Topics, past engagements, formats, fee note
/contact        Intake form (name, org, budget range, message)
/blog           Optional — only scaffold if owner confirms content plan
```

## Tech stack decisions (settled — do not revisit)
- **Framework:** plain HTML + CSS + vanilla JS (no build step, easy for owner to hand off)
- **Styling:** single shared `style.css`; CSS custom properties for brand colours/fonts
- **Forms:** Netlify Forms or Formspree attribute (`data-netlify` / `action` URL); no server required
- **Hosting target:** Netlify or GitHub Pages (static, free tier)
- **Analytics:** Plausible or Fathom snippet in `<head>` (privacy-first; no cookie banner needed)
- **No frameworks** (React, Vue, etc.) unless owner explicitly requests one

## File layout
```
/
├── CLAUDE.md           ← this file
├── index.html
├── about.html
├── consulting.html
├── speaking.html
├── contact.html
├── style.css
├── js/
│   └── main.js         ← nav toggle, smooth scroll, form validation only
├── images/
│   └── headshot.jpg    ← owner to supply; placeholder until then
└── assets/
    └── speaker-kit.pdf ← optional one-pager; owner to supply
```

## Design constraints
- **Palette:** two brand colours + neutral; store as CSS vars `--color-primary`, `--color-accent`, `--color-bg`, `--color-text`; default to `#1a3a5c` / `#c8a55b` / `#f9f7f4` / `#1c1c1e` until owner chooses
- **Typography:** one serif for headings (`Georgia` or a Google Font like `Lora`), one sans-serif for body (`Inter` or system stack); load from Google Fonts with `display=swap`
- **Layout:** max content width `1100px`; generous whitespace; no carousels or auto-play media
- **Mobile-first:** breakpoints at 768 px and 1024 px only
- **Accessibility:** semantic HTML, `alt` on all images, `:focus-visible` styles, contrast ≥ 4.5:1

## Content conventions
- Write in third person for bio and services copy ("Jane advises…"), first person for contact page ("I look forward to hearing from you")
- Avoid jargon, buzzwords ("synergy", "thought leader"), or age-references
- Every page must have exactly one `<h1>`; headings nest correctly (h1 → h2 → h3)
- Trust signals to include: former employer logos (if permissible), media mentions, 2–3 pull quotes from clients or organisers
- Speaking page: include at minimum — topic list, 3 talk abstracts (150 words each), formats offered (keynote / workshop / panel), geographic reach, placeholder for video embed

## Token-saving rules for Claude
1. **Read this file first.** Do not ask what the site is for or what stack to use.
2. **Never regenerate files from scratch** — edit in place with the Edit tool.
3. **Reuse `style.css` variables** — do not hard-code colours or fonts anywhere else.
4. **Shared components** (`<nav>`, `<footer>`) live in comments marked `<!-- NAV START -->` / `<!-- NAV END -->` so they can be grep'd and updated across all pages in one pass.
5. **Batch page creation** — when building multiple pages in one session, write all HTML files before switching to CSS.
6. **Images:** never generate placeholder images; use a `<div class="img-placeholder">` with descriptive `data-desc` attribute until real assets arrive.
7. **Do not scaffold `/blog`** unless the user explicitly says "add the blog".
8. **Do not install npm packages** or introduce a build step without asking.

## Common tasks reference
| Task | What to do |
|---|---|
| Add a new speaking topic | Edit `speaking.html` — find `<!-- TOPICS -->` section |
| Update bio | Edit `about.html` — find `<!-- BIO -->` section |
| Change brand colours | Edit `style.css` lines under `:root` |
| Add a client logo | Edit `index.html` `<!-- TRUST -->` section, add `<img>` inside `.logo-strip` |
| Wire up contact form | Add `data-netlify="true"` to `<form>` and set `action="/thank-you"` |
| Change primary CTA text | Grep for `<!-- CTA -->` across all files |

## Out of scope (do not implement unless asked)
- E-commerce / payments
- Member login / gated content
- CMS integration (WordPress, Contentful, etc.)
- Multi-language / i18n
- Dark mode toggle
- Newsletter signup (mention as option only if user asks about lead capture)
