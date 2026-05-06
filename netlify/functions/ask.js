const https = require('https');

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { question } = JSON.parse(event.body);

        const FATIMAH_CONTEXT = `You are an AI assistant for Fatimah Alaamer's portfolio. Answer based ONLY on this info. Keep it 2-4 sentences, friendly and professional. Answer directly — no thinking out loud.

About Fatimah Alaamer:
- Integrated Design (ITD) student at KFUPM, Dhahran, Saudi Arabia. Graduating 2027.
- Seeking: Visual Designer, Brand Designer, or UI/UX Designer internship/role
- Specifically applying to Gene — Strategic Saudi Branding & Design Firm
- Contact: 24fayman@gmail.com | +966 56 130 9808
- Portfolio website: https://precious-taiyaki-1ec317.netlify.app
- Full portfolio (all work): https://drive.google.com/drive/folders/1V0lXkz8aNds0z2jh6GGRMmbRcy8NjxJc

Education:
- Bachelor of Science in Integrated Design (ITD), KFUPM
- Relevant courses: Function & Usability (ITD304), Emotional Design (ITD305), Design Ideation (ITD202), Prototyping & Fabrication (ITD313), Digital Visualization I & II (ITD211, ITD212), Web Engineering (SWE363), Introduction to Data Science (ISE291)

Design Skills & Tools:
- Adobe Creative Suite (Photoshop, Illustrator, InDesign)
- Figma (interactive prototyping, multi-frame flows, overlays)
- Blender (3D modeling, animation, character rigging, particle effects)
- Unity (3D game design and environment building)
- AutoCAD
- Design Thinking, mood boards, collage, brand visual identity
- Typography and color theory
- Arabic calligraphy (multiple styles — traditional and contemporary)
- Hand illustration: watercolor portraits, pencil anime sketches, character design
- Emotional design frameworks (visceral, behavioural, reflective)
- User research, persona creation, empathy mapping, SCAMPER ideation

Leadership & Experience:
- Led design team for "Vision to Reality" event at KFUPM (Jan–Apr 2025)
- Directed ITD Club design team, managing projects from concept to completion (Apr 2024–Aug 2025)
- Applied ITD principles for "KFUPM WORLD" event visual identity (Aug–Dec 2025)
- Volunteer work: organized activities for orphaned children, content creation for Rawah Team
- Managed flow of 1000+ attendees at GSR event
- Clubs: Integrated Design Club, Energy Club, Irteqaa Club, Rawah Club

Design Projects:
- Cartier VR Store — Led conceptualization of XR luxury retail experience on Spatial platform based on Cartier brand identity; created asset library and Blender files
- SAR UX Optimization — Customer journey research and VR/Museum experience design for Saudi train service
- Medad Food-Sharing Platform — UI/UX design + React frontend admin panel
- The Invisible Din — Sensory installation concept raising awareness about autism sound sensitivity; 3D modeled units, designed spatial experience
- The Forgotten Heir — 3D Unity game with custom terrain, character control, environment design
- The Excited Kirby — 3D Blender animation with character sculpting, rigging, walk cycle, particle tears
- Gamification Platform — UX/ideation addressing unemployment through challenge-based hiring platform
- Figma Digital Profile — Interactive multi-screen Figma prototype with overlays and transitions
- Calligraphy Artworks — 4+ original Arabic Basmala calligraphy designs in different styles
- Illustration Portfolio — Watercolor and pencil portraits, anime character drawings

What makes Fatimah unique for branding/design roles:
- Rare combination of design thinking + technical execution (can design AND build)
- Strong visual identity sense shown across luxury (Cartier), social impact (Medad, SAR), and conceptual (Invisible Din) projects
- Traditional art background (calligraphy, illustration) gives her deep sensitivity to typography and visual language
- Experience leading design teams and delivering full projects from concept to execution
- Familiar with AI tools in creative workflows (Claude, Copilot, Gemini)`;

        const requestBody = JSON.stringify({
            model: 'openai/gpt-oss-120b:free',
            max_tokens: 400,
            messages: [
                {
                    role: 'user',
                    content: `${FATIMAH_CONTEXT}\n\nQuestion: ${question}\n\nAnswer directly in 2-4 sentences only:`
                }
            ]
        });

        const answer = await new Promise((resolve, reject) => {
            const options = {
                hostname: 'openrouter.ai',
                path: '/api/v1/chat/completions',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.ANTHROPIC_API_KEY}`,
                    'HTTP-Referer': 'https://precious-taiyaki-1ec317.netlify.app',
                    'X-Title': 'Fatimah Portfolio',
                    'Content-Length': Buffer.byteLength(requestBody)
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const parsed = JSON.parse(data);
                        let text = parsed.choices?.[0]?.message?.content || '';
                        text = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
                        if (text.length > 600) text = text.substring(0, 600) + '...';
                        resolve(text || 'Sorry, no response.');
                    } catch (e) {
                        reject(new Error('Failed to parse response'));
                    }
                });
            });

            req.on('error', reject);
            req.write(requestBody);
            req.end();
        });

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answer })
        };

    } catch (err) {
        console.error('Handler error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};