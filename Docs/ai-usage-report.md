# AI Usage Report — Assignment 4
**Student:** Fatimah Alaamer | **ID:** 202267900 | **Course:** SWE363

---

## 1. Tools Used & Use Cases

| Tool | Use Case |
|------|----------|
| Gemini (Google AI) | Boilerplate HTML/CSS structure for Assignment 1 base |
| Claude (Anthropic) | Advanced feature planning, GitHub API integration, form validation, CSS design system, debugging, documentation review, AI chat widget design, typing animation logic, cursor trail canvas implementation |

---

## 2. Detailed Use Cases

### Assignment 1 (Gemini)
Used to generate a boilerplate HTML/CSS structure and a JavaScript snippet for a time-based greeting. I simplified the AI output, removed unnecessary complexity, and updated the color scheme manually to match my design.

### Assignments 3–4 (Claude)

**Use Case 1 — GitHub API Integration**
Asked Claude to explain how to use `fetch()` with the GitHub REST API and handle HTTP errors. Claude explained the full Promise chain structure and why `per_page=20` was needed to ensure both target repositories appeared.

**Use Case 2 — Filter + Sort Logic**
Asked Claude to explain how to combine filtering and sorting on a JavaScript array before re-rendering the project grid. Claude explained why re-rendering from a data array is more reliable than showing/hiding static HTML.

**Use Case 3 — Contact Form Validation**
Asked Claude to walk through building multi-field validation without a library. Claude explained the regex pattern `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` and why `novalidate` combined with custom JS gives better per-field UX control.

**Use Case 4 — Debugging a Broken fetch()**
When two nested `fetch()` chains caused a silent syntax error, I asked Claude to identify the cause. Claude found a duplicated, unclosed `.then()` block — this taught me that Promise chains fail silently when syntax is broken.

**Use Case 5 — Typing Animation (A4)**
Asked Claude to explain how to implement a typewriter effect with multiple rotating phrases. Claude walked through the state machine logic: a single `type()` function that checks `isDeleting`, adjusts `typingSpeed`, and cycles `phraseIndex` using modulo. I modified the phrases to reflect my actual skills and added a startup delay.

**Use Case 6 — Canvas Cursor Trail (A4)**
Asked Claude to explain how to build a particle trail using the HTML5 Canvas API. Claude explained the `requestAnimationFrame` loop pattern, particle decay via alpha reduction, and how to spawn particles on `mousemove`. I customised the colors to match my pastel CSS palette and tuned the spawn rate and decay speed through testing.

**Use Case 7 — AI Chat Widget Architecture (A4)**
Asked Claude to explain how to integrate the Anthropic `/v1/messages` API directly from a browser. Claude explained the `anthropic-dangerous-direct-browser-access` header required for browser-side calls, the system prompt pattern for grounding responses to specific context, and the full async/await error handling pattern. I wrote the `FATIMAH_CONTEXT` system prompt myself to ensure all information was accurate and personal.

**Use Case 8 — Documentation Review (A4)**
Asked Claude to cross-reference the A4 README and technical docs against the rubric requirements. Claude identified that the "Innovation" section and deployment instructions were missing — both were then added.

---

## 3. Benefits & Challenges

### Benefits
- Claude explained *why* patterns work, not just *what* the code does — more valuable than copying output.
- The canvas particle system would have taken hours to build from scratch; Claude's explanation of the `requestAnimationFrame` + alpha decay pattern saved significant time.
- The AI chat widget required understanding the Anthropic API's browser-access pattern — Claude explained this precisely and accurately.

### Challenges & Risks

| Challenge / Risk | What Happened | How I Handled It |
|---|---|---|
| Over-engineering | Claude suggested a full chat history array for the AI widget | Simplified to single-turn calls since portfolio context doesn't need multi-turn memory |
| Canvas performance | Initial particle count was too high on mobile | Added `window.innerWidth > 768` check to disable canvas on mobile entirely |
| AI hallucination risk | AI could invent facts about me if context is vague | Wrote detailed, accurate `FATIMAH_CONTEXT` system prompt myself |
| Generic aesthetics | Default AI color suggestions were generic gradients | Overrode with my existing `--pink`, `--lavender`, `--mint` CSS variable palette |
| Context loss between sessions | AI has no memory — had to re-explain file structure | Kept a personal notes file with variable names and structure |

---

## 4. Learning Outcomes

**1. Canvas API & Animation Loops**
I now understand how to build a real-time particle system using `requestAnimationFrame`. The key insight is that each frame clears the entire canvas and redraws all particles — particles "disappear" by reducing their `alpha` and `radius` each frame until they reach zero.

**2. Typewriter Effect State Machine**
The typing animation uses a single recursive `setTimeout` function with an `isDeleting` boolean that switches direction. Varying the delay (`typingSpeed`) between typing, pausing, and deleting creates the natural-feeling rhythm. This is a widely used UI pattern I had never implemented before.

**3. Direct Browser API Integration**
I learned how to call the Anthropic API directly from the browser using the `anthropic-dangerous-direct-browser-access` header. More importantly, I learned that grounding an AI with a detailed system prompt is essential — without it, the model would invent facts about me.

**4. System Prompt Engineering**
Writing the `FATIMAH_CONTEXT` prompt taught me that effective AI grounding requires specificity: listing exact project names, dates, technologies, and constraints rather than general descriptions. The AI's responses became dramatically more accurate after I made the context more detailed.

**5. Staggered CSS Animations**
Using `animation-delay` with `animation-fill-mode: both` creates a cascading reveal effect on page load without any JavaScript. This is a CSS-only technique that is much more performant than JS-driven entrance animations.

---

## 5. Responsible Use & Modifications

All AI-generated suggestions were reviewed, tested, and modified before inclusion:

- Wrote all context in `FATIMAH_CONTEXT` myself — no AI invented facts about me
- Customised canvas particle colors to match my existing CSS variable palette
- Modified typing phrases to reflect my actual work (VR, UX, web development)
- Simplified AI chat from multi-turn history to single-turn (appropriate for this use case)
- Disabled canvas on mobile after performance testing
- All documentation written by me based on my actual development process

---

*© 2026 Fatimah Alaamer — SWE363, KFUPM*
