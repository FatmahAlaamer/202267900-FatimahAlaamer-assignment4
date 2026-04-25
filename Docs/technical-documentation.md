# Technical Documentation — Assignment 4
**Student:** Fatimah Alaamer | **ID:** 202267900 | **Course:** SWE363

---

## 1. Project Overview

A polished, production-ready personal portfolio web application built with vanilla HTML, CSS, and JavaScript. Assignment 4 extends Assignment 3 by adding:
- **AI Chat Widget** — Claude-powered Q&A about the portfolio owner, using the Anthropic API
- **Typing Animation** — Rotating hero taglines with a typewriter effect
- **Cursor Particle Trail** — Pastel canvas-based particle system following mouse movement
- **Improved hero design** — CTA buttons, Syne display font, staggered entrance animations

**Live deployment:** [Add your GitHub Pages / Netlify / Vercel URL here]
**Local usage:** Open `index.html` in any modern browser. Internet connection required for GitHub API and AI chat features.

---

## 2. File Structure

```
202267900-FatimahAlaamer-assignment4/
├── README.md
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── Assets/
│   └── images/
│       ├── Cartier.jpg
│       ├── SAR.jpg
│       └── Medad.png
├── docs/
│   ├── ai-usage-report.md
│   └── technical-documentation.md
├── presentation/
│   ├── slides.pdf
│   └── demo-video.mp4
└── .gitignore
```

---

## 3. Architecture

### HTML — Semantic Structure
- `<nav>` — sticky, blur-backdrop navigation with theme toggle
- `<canvas id="cursorCanvas">` — full-page fixed canvas for particle trail
- `<section id="about">` — hero with typing animation, CTA buttons, stats
- `<section id="projects">` — filter bar + dynamically rendered project grid
- `<section id="github">` — live GitHub API data
- `<section id="ai-chat">` — AI-powered conversational Q&A widget *(new)*
- `<section id="contact">` — validated contact form
- `<footer>` — three-column footer with links

### CSS — Design System
CSS Custom Properties are used as a single source of truth for all colors:

```css
:root {
    --pink:     #FFB3C6;
    --mint:     #B5EAD7;
    --lavender: #C9B8F5;
    --peach:    #FFD4B2;
    --sky:      #B5D8F7;
    --yellow:   #FFF0A0;
    --ink:      #1a1a2e;
    --ink-soft: #4a4a6a;
}
```

Dark mode overrides all variables under `body.dark-theme`.

**New in A4:** Added `Syne` display font (headings), staggered `@keyframes fadeUp` / `fadeDown` entrance animations using `animation-delay`, animated blob `::before`/`::after` pseudo-elements with `blobFloat` keyframe.

### JavaScript — Module Breakdown

| Section | Key Functions / APIs | New in A4? |
|---|---|---|
| Theme toggle | `localStorage` | No |
| Visit counter | `localStorage` | No |
| Timer | `setInterval` | No |
| **Typing animation** | Recursive `setTimeout`, state machine | ✅ Yes |
| **Cursor particle trail** | Canvas 2D API, `requestAnimationFrame` | ✅ Yes |
| Project filter/sort | Array `.filter()`, `.sort()`, DOM re-render | No |
| GitHub API | `fetch()` → GitHub REST API | No |
| **AI Chat Widget** | `fetch()` → Anthropic `/v1/messages` API | ✅ Yes |
| Contact form validation | Regex, DOM class toggling | No |
| Scroll animations | `IntersectionObserver` | No |

---

## 4. Feature Implementation Details

### 4.1 Typing Animation

**Pattern:** Single recursive `setTimeout` function acting as a state machine.

```
States:
  isDeleting = false → append one char, normal speed (90ms)
  isDeleting = true  → remove one char, faster speed (50ms)
  Pause before delete: 1600ms (phrase fully typed)
  Pause before next:   400ms  (phrase fully deleted)
```

`phraseIndex` cycles through the `phrases` array using modulo: `(phraseIndex + 1) % phrases.length`.

The `cursor-blink` span is a pure CSS animation (`opacity` alternating with `step-end` timing) — no JavaScript required for the blinking cursor.

### 4.2 Cursor Particle Trail

**Canvas setup:** A `<canvas>` element is fixed at full viewport size with `pointer-events: none` — it sits on top of all content visually but never blocks clicks.

**Particle lifecycle:**
1. `mousemove` event spawns a new particle at cursor position with random radius (2–7px), random pastel color, random velocity, and random alpha decay rate.
2. `requestAnimationFrame` loop clears canvas each frame and redraws all particles.
3. Each frame: position updates by velocity, `alpha` decreases by `decay`, `radius` multiplied by 0.98.
4. When `alpha ≤ 0`, particle is removed from array.

**Performance:** Disabled on mobile (`window.innerWidth ≤ 768`) to avoid battery drain. Canvas resize handler keeps dimensions correct on window resize.

### 4.3 AI Chat Widget

**Endpoint:** `POST https://api.anthropic.com/v1/messages`
**Model:** `claude-sonnet-4-20250514`
**Authentication:** Browser-direct via `anthropic-dangerous-direct-browser-access: true` header

**Grounding:** A `FATIMAH_CONTEXT` system prompt is embedded in `script.js` containing accurate details about projects, skills, education, and background. This constrains the AI to only answer factually about the portfolio owner.

**UI Flow:**
1. User types a question or clicks a suggestion chip
2. Message appended as user bubble, typing dots indicator shown
3. `fetch()` call made to Anthropic API with system prompt + user message
4. On success: typing indicator removed, AI response appended
5. On failure: friendly error message shown, input re-enabled

**Suggestion chips:** Four pre-written questions help users get started without needing to type.

### 4.4 Staggered Hero Animations

Each hero element uses `animation: fadeUp 0.7s ease Xs both` with increasing delays:

| Element | Delay |
|---|---|
| Badge | 0.0s |
| H1 | 0.1s |
| Tagline | 0.2s |
| Paragraph | 0.3s |
| CTA buttons | 0.4s |
| Stats | 0.5s |

`animation-fill-mode: both` keeps elements invisible before their animation starts, preventing a flash of visible content.

### 4.5 State Management (unchanged from A3)

| State | Storage | Persists? |
|---|---|---|
| Dark / Light theme | `localStorage` key: `theme` | ✅ Yes |
| Visit count | `localStorage` key: `visitCount` | ✅ Yes |
| Active filter | JS variable | ❌ Session only |
| Active sort | JS variable | ❌ Session only |
| Timer | JS variable | ❌ Session only |

---

## 5. Performance Optimizations

| Optimization | Implementation |
|---|---|
| Font loading | Google Fonts with `&display=swap` |
| Canvas disabled on mobile | `window.innerWidth > 768` guard |
| Image fallback | `onerror="this.style.display='none'"` |
| Script placement | `<script>` at end of `<body>` |
| CSS-only cursor blink | No JS interval for cursor animation |
| IntersectionObserver | Used instead of scroll listeners |
| `backdrop-filter` nav | Glassmorphism without heavy shadow layers |

---

## 6. Browser Compatibility

Tested on:
- Chrome 120+ ✅
- Safari 17+ ✅
- Firefox 121+ ✅
- Mobile Safari (iOS) ✅ (canvas trail disabled)
- Chrome for Android ✅ (canvas trail disabled)

---

## 7. Known Limitations

| Limitation | Details |
|---|---|
| GitHub API rate limit | 60 requests/hour unauthenticated — error message shown if exceeded |
| Contact form is frontend-only | No email actually sent — backend not in scope |
| AI chat is single-turn | No conversation memory — each message is independent |
| API key exposure | Anthropic API called from browser — acceptable for educational portfolio; would use backend proxy in production |

---

## 8. Improvements Over Assignment 3

| A3 State | A4 Improvement |
|---|---|
| Static hero tagline | Rotating typewriter animation with multiple phrases |
| No cursor interaction | Pastel particle trail follows mouse movement |
| No AI features | Full AI chat widget powered by Claude API |
| Basic hero layout | CTA buttons, Syne display font, staggered entrance animations |
| Animated blobs (static CSS) | Blobs now float with `blobFloat` keyframe animation |
| Single-column footer | Three-column footer with logo, copyright, and nav links |
| No deployment | Deployed to [GitHub Pages / Netlify / Vercel] |

---

*© 2026 Fatimah Alaamer — SWE363, KFUPM*
