# Fatimah Alaamer — Personal Portfolio (Assignment 4)
**Student ID:** 202267900 | **Course:** SWE363 — Web Engineering | **KFUPM**

> A polished, production-ready personal portfolio web application built with vanilla HTML, CSS, and JavaScript.

🔗 **Live Demo:** (https://precious-taiyaki-1ec317.netlify.app)

🔗 **The video presentation :** (https://kfupmedusa-my.sharepoint.com/:v:/g/personal/s202267900_kfupm_edu_sa/IQB1SJdti3haRIg4vzH0hjPaAU3bazSmMTPh8veWMRf8mTY?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=aTzv0A)

---

## ✦ What's New in Assignment 4

| Feature | Description |
|---|---|
| 🤖 AI Chat Widget | Ask questions about Fatimah — powered by Claude (Anthropic API) |
| ⌨️ Typing Animation | Hero headline cycles through rotating phrases with typewriter effect |
| ✨ Cursor Particle Trail | Pastel particles follow your mouse (desktop only) |
| 🎬 Staggered Animations | Hero elements animate in sequentially on page load |
| 🔤 Syne Display Font | New display typeface for headings; more distinctive visual identity |
| 🚀 Deployed | Live on [platform] at the link above |

---

## Features (Full List)

- **AI Chat Widget** — Claude-powered Q&A grounded in real portfolio context
- **Typing Animation** — Rotating hero taglines (VR, web, UX, and more)
- **Cursor Trail** — Canvas particle system in the pastel color palette
- **Dark / Light Mode** — Persists via `localStorage`
- **Visit Counter** — Increments on each visit, stored in `localStorage`
- **Time on Site** — Live timer, resets on refresh
- **Project Filter & Sort** — Filter by tag (VR / UX / Web), sort by date or name
- **GitHub API** — Live repository data fetched from GitHub REST API
- **Contact Form** — Inline validation with regex email check
- **Scroll Animations** — `IntersectionObserver`-based fade-in per section
- **Responsive Design** — Mobile-first, tested on Chrome, Safari, Firefox, iOS

---

## How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_ID-FatimahAlaamer-assignment4.git
   cd YOUR_ID-FatimahAlaamer-assignment4
   ```

2. Open `index.html` in any modern browser.
   - No build step required — this is a vanilla HTML/CSS/JS project.
   - An internet connection is required for the GitHub API section and AI chat widget.

3. For the AI chat to work, the Anthropic API must be accessible from your browser. If calling from a local file (`file://`), some browsers may block the request due to CORS — use a local server instead:
   ```bash
   # Using Python
   python3 -m http.server 8080
   # Then open http://localhost:8080
   ```

---

## File Structure

```
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
├── Docs/
│   ├── ai-usage-report.md
│   └── technical-documentation.md
├── netlify/
│   └── functions/
│       └── ask.js
├── netlify.toml
└── .gitignore
```

---

## AI Tools Used

| Tool | Purpose |
|---|---|
| Claude (Anthropic) | Feature planning, canvas particle system, typing animation, AI widget architecture, debugging, documentation review |
| Gemini (Google) | Assignment 1 HTML/CSS boilerplate (heavily modified) |

Full details in [`docs/ai-usage-report.md`](docs/ai-usage-report.md).

---

## Deployment

Deployed to [GitHub Pages / Netlify / Vercel] — see the live link at the top of this README.

---

*© 2026 Fatimah Alaamer — SWE363, KFUPM*
