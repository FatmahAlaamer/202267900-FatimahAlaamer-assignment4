document.addEventListener("DOMContentLoaded", () => {

    // ── 1. Theme Toggle with LocalStorage ──────────────
    const themeToggle = document.getElementById('theme-toggle');

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.textContent = 'Day ☀️';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggle.textContent = isDark ? 'Day ☀️' : 'Night 🌙';
    });

    // ── 2. Visit Counter (LocalStorage) ────────────────
    const visits = (parseInt(localStorage.getItem('visitCount') || '0')) + 1;
    localStorage.setItem('visitCount', visits);
    const visitEl = document.getElementById('visitCount');
    if (visitEl) visitEl.textContent = visits;

    // ── 3. Time-on-site Timer ───────────────────────────
    let seconds = 0;
    const timerEl = document.getElementById('siteTimer');
    setInterval(() => {
        seconds++;
        const m = Math.floor(seconds / 60);
        const s = String(seconds % 60).padStart(2, '0');
        if (timerEl) timerEl.textContent = m + ':' + s;
    }, 1000);

    // ── 4. Typing Animation (NEW — A4) ─────────────────
    const typedEl = document.getElementById('typed-text');
    if (typedEl) {
        // Rotating phrases that showcase skills
        const phrases = [
            'web experiences',
            'VR worlds',
            'clean interfaces',
            'cool things ✦'
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 90;

        function type() {
            const current = phrases[phraseIndex];

            if (isDeleting) {
                // Remove one character
                typedEl.textContent = current.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                // Add one character
                typedEl.textContent = current.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 90;
            }

            // Finished typing the phrase — pause then delete
            if (!isDeleting && charIndex === current.length) {
                isDeleting = true;
                typingSpeed = 1600; // Pause before deleting
            }

            // Finished deleting — move to next phrase
            if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 400; // Pause before typing next
            }

            setTimeout(type, typingSpeed);
        }

        // Start with a small delay so page loads first
        setTimeout(type, 800);
    }

    // ── 5. Cursor Trail (NEW — A4) ──────────────────────
    const canvas = document.getElementById('cursorCanvas');
    if (canvas && window.innerWidth > 768) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        // Pastel trail particle system
        const particles = [];
        const colors = ['#FFB3C6', '#C9B8F5', '#B5EAD7', '#FFF0A0', '#B5D8F7', '#FFD4B2'];
        let mouseX = 0, mouseY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Spawn particle on move
            if (Math.random() > 0.4) {
                particles.push({
                    x: mouseX,
                    y: mouseY,
                    r: Math.random() * 5 + 2,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    alpha: 0.75,
                    vx: (Math.random() - 0.5) * 1.2,
                    vy: (Math.random() - 0.5) * 1.2 - 0.5,
                    decay: Math.random() * 0.015 + 0.01
                });
            }
        });

        function animateTrail() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= p.decay;
                p.r *= 0.98;

                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fill();
            }

            ctx.globalAlpha = 1;
            requestAnimationFrame(animateTrail);
        }

        animateTrail();
    }

    // ── 6. Project Filter & Sort ────────────────────────
    const projects = [
        {
            title: "Cartier VR Store",
            tag: "VR",
            date: "2026-03-01",
            desc: "Designed a virtual reality storefront on Spatial based on Cartier's brand identity.",
            details: "Applied Cartier's signature colors and elegant aesthetics to create an immersive, luxury shopping experience in the metaverse.",
            img: "Assets/images/Cartier.jpg"
        },
        {
            title: "SAR UX Optimization",
            tag: "UX",
            date: "2026-01-15",
            desc: "Analyzed and improved the customer journey for the SAR train service in Saudi Arabia.",
            details: "Proposed solutions addressing communication gaps and designed immersive VR/Museum concepts to improve the travel experience.",
            img: "Assets/images/SAR.jpg"
        },
        {
            title: "Medad Food-Sharing Platform",
            tag: "Web",
            date: "2026-04-01",
            desc: "Frontend admin panel for a food-sharing app connecting restaurants with charities.",
            details: "Built with React and React Router. Responsible for the Administrator Control Panel — five screens including analytics, user management, and safety monitoring.",
            img: "Assets/images/Medad.png"
        }
    ];

    let activeFilter = 'all';
    let activeSort = 'newest';

    function renderProjects() {
        let list = [...projects];

        if (activeFilter !== 'all') {
            list = list.filter(p => p.tag === activeFilter);
        }

        if (activeSort === 'newest') list.sort((a, b) => new Date(b.date) - new Date(a.date));
        else if (activeSort === 'oldest') list.sort((a, b) => new Date(a.date) - new Date(b.date));
        else if (activeSort === 'az') list.sort((a, b) => a.title.localeCompare(b.title));

        const grid = document.getElementById('projectsGrid');
        if (!grid) return;

        if (!list.length) {
            grid.innerHTML = '<p style="color:#9c8977; font-style:italic;">No projects in this category yet.</p>';
            return;
        }

        grid.innerHTML = list.map((p, i) => `
            <div class="project-card">
                ${p.img
                    ? `<img src="${p.img}" alt="${p.title}" onerror="this.style.display='none'">`
                    : `<div style="height:180px; background:#e8ddd0; border-radius:4px; display:flex; align-items:center; justify-content:center; color:#9c8977; font-size:0.85rem;">No image</div>`
                }
                <div class="card-content">
                    <span class="project-tag-badge" data-tag="${p.tag}">${p.tag}</span>
                    <h3>${p.title}</h3>
                    <p>${p.desc}</p>
                    <div class="project-details" id="details-${i}" style="display:none;">
                        <p><strong>Details:</strong> ${p.details}</p>
                    </div>
                    <button class="view-more-btn" data-target="details-${i}">View Details</button>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.view-more-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = document.getElementById(btn.dataset.target);
                const isHidden = target.style.display === 'none';
                target.style.display = isHidden ? 'block' : 'none';
                btn.textContent = isHidden ? 'Show Less' : 'View Details';
            });
        });
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            renderProjects();
        });
    });

    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            activeSort = sortSelect.value;
            renderProjects();
        });
    }

    renderProjects();

    // ── 7. GitHub API ───────────────────────────────────
    const githubContainer = document.getElementById('githubRepos');
    if (githubContainer) {
        githubContainer.innerHTML = '<p class="api-msg">Loading repositories…</p>';

        fetch('https://api.github.com/users/FatmahAlaamer/repos?sort=updated&per_page=20')
            .then(res => {
                if (!res.ok) throw new Error('GitHub API error: ' + res.status);
                return res.json();
            })
            .then(repos => {
                const allowed = ['Assignment2', 'Assigment-1'];
                const filtered = repos.filter(r => allowed.includes(r.name));

                if (!filtered.length) throw new Error('No repositories found.');

                githubContainer.innerHTML = `<div class="github-grid">${
                    filtered.map(r => `
                        <div class="repo-card">
                            <h3>${r.name}</h3>
                            <p>${r.description || 'No description provided.'}</p>
                            <div class="repo-meta">
                                <span>★ ${r.stargazers_count}</span>
                                ${r.language ? `<span>◉ ${r.language}</span>` : ''}
                            </div>
                            <a href="${r.html_url}" class="repo-link" target="_blank" rel="noopener">Open on GitHub →</a>
                        </div>
                    `).join('')
                }</div>`;
            })
            .catch(err => {
                githubContainer.innerHTML = `<p class="api-msg">Could not load repositories. ${err.message}</p>`;
            });
    }

    // ── 8. Contact Form Validation ──────────────────────
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;

            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');

            [name, email, message].forEach(el => el.classList.remove('invalid'));
            document.querySelectorAll('.field-error').forEach(el => el.style.display = 'none');

            if (!name.value.trim()) {
                name.classList.add('invalid');
                document.getElementById('nameError').style.display = 'block';
                valid = false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                email.classList.add('invalid');
                document.getElementById('emailError').style.display = 'block';
                valid = false;
            }

            if (message.value.trim().length < 10) {
                message.classList.add('invalid');
                document.getElementById('msgError').style.display = 'block';
                valid = false;
            }

            if (valid) {
                const feedback = document.getElementById('form-feedback');
                feedback.style.display = 'block';
                feedback.style.background = '#e8f5e9';
                feedback.style.color = '#2e7d32';
                feedback.innerHTML = '✓ Message sent! I\'ll get back to you soon.';
                contactForm.reset();
            }
        });
    }

    // ── 9. AI Chat Widget (NEW — A4) ───────────────────
    // Context about Fatimah that the AI uses to answer questions
    const FATIMAH_CONTEXT = `
You are an AI assistant embedded in Fatimah Alaamer's personal portfolio website.
Answer questions about her based ONLY on the following information. Keep answers concise (2-4 sentences), friendly, and professional. If asked something not covered below, say you don't have that information but suggest checking the contact form.

About Fatimah Alaamer:
- Software Engineering student at King Fahd University of Petroleum and Minerals (KFUPM), Saudi Arabia
- Expected graduation: May 2027
- Student ID: 202267900
- Course: SWE363 (Web Engineering)

Technical Skills:
- Frontend: HTML, CSS, JavaScript (vanilla), React, React Router
- Backend: Node.js, Express.js
- Database: MongoDB Atlas
- Tools: Git, GitHub, VS Code, IntelliJ IDEA
- Design: Figma, UX Research, VR/Spatial Design
- AI Tools: Claude (Anthropic), GitHub Copilot, Gemini

Projects:
1. Cartier VR Store (VR, 2026) — Designed a luxury virtual reality storefront on Spatial platform using Cartier's brand identity and signature colors.
2. SAR UX Optimization (UX, 2026) — Analyzed and improved the customer journey for Saudi Arabia's SAR train service; proposed VR/Museum experience concepts.
3. Medad Food-Sharing Platform (Web, 2026) — Built the Admin Control Panel (5 screens) for a React-based food-sharing app connecting restaurants with charities. Features: analytics dashboard, user management, safety monitor.
4. Portfolio Website (Web, SWE363 assignments) — Built a full-featured personal portfolio with GitHub API integration, localStorage state, filtering/sorting, form validation, and AI chat widget.

Education:
- KFUPM, Bachelor of Software Engineering, class of 2027
- Relevant courses: SWE363 Web Engineering, ENGL 214 (Technical Writing)

Career interests:
- Software Engineering, AI-driven development, UX/frontend development
- Interested in roles at companies like Saudi Aramco (Computing & IT Graduate program)

Personal:
- Based in Saudi Arabia (Dammam area)
- Uses a Mac, works primarily in VS Code
- Passionate about combining technical engineering with creative design
`;

    const chatWindow = document.getElementById('chatWindow');
    const aiInput = document.getElementById('aiInput');
    const aiSendBtn = document.getElementById('aiSendBtn');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');

    // Helper: append a message bubble to the chat window
    function appendMessage(role, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${role === 'user' ? 'user-message' : 'ai-message'}`;

        const avatar = document.createElement('div');
        avatar.className = role === 'user' ? 'user-avatar' : 'ai-avatar';
        avatar.textContent = role === 'user' ? 'You' : '✦';

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.textContent = text;

        msgDiv.appendChild(avatar);
        msgDiv.appendChild(bubble);
        chatWindow.appendChild(msgDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;

        return bubble; // Return so we can update typing indicator
    }

    // Helper: show animated typing dots
    function showTypingIndicator() {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-message ai-message';
        msgDiv.id = 'typingIndicator';

        const avatar = document.createElement('div');
        avatar.className = 'ai-avatar';
        avatar.textContent = '✦';

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble typing-dots';
        bubble.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';

        msgDiv.appendChild(avatar);
        msgDiv.appendChild(bubble);
        chatWindow.appendChild(msgDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
    }

    // Core: call Anthropic API and display response
    async function sendMessage(userText) {
        if (!userText.trim()) return;

        appendMessage('user', userText);
        aiInput.value = '';
        aiSendBtn.disabled = true;
        showTypingIndicator();

        try {
            const response = await fetch('/.netlify/functions/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: userText })
            });

            if (!response.ok) throw new Error('API request failed');

            const data = await response.json();
            const replyText = data.answer || 'Sorry, I could not generate a response.';

            removeTypingIndicator();
            appendMessage('ai', replyText);

        } catch (err) {
            removeTypingIndicator();
            appendMessage('ai', 'Oops! I had trouble connecting. Please try again in a moment.');
        } finally {
            aiSendBtn.disabled = false;
            aiInput.focus();
        }
    }

    // Send on button click
    if (aiSendBtn) {
        aiSendBtn.addEventListener('click', () => {
            sendMessage(aiInput.value.trim());
        });
    }

    // Send on Enter key
    if (aiInput) {
        aiInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(aiInput.value.trim());
            }
        });
    }

    // Suggestion chip clicks
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', () => {
            sendMessage(chip.dataset.q);
        });
    });

    // ── 10. Scroll Animations ───────────────────────────
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

});
