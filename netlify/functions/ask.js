const https = require('https');

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { question } = JSON.parse(event.body);

        const FATIMAH_CONTEXT = `You are an AI assistant for Fatimah Alaamer's portfolio. Answer based ONLY on this info. Keep it 2-4 sentences, friendly and professional. Answer directly — no thinking out loud.

About Fatimah Alaamer:
- Software Engineering student at KFUPM, Saudi Arabia. Graduating May 2027.

Technical Skills:
- Web: HTML, CSS, JavaScript, React, Node.js, Express, MongoDB, Git
- Design Tools: Figma, Adobe Creative Suite (Photoshop, Illustrator, InDesign), Blender, Unity
- Design Skills: Visual identity, mood boards, collage, brand design, typography, color theory, calligraphy (Arabic & English), hand illustration/drawing
- AI Tools: Claude (Anthropic), GitHub Copilot, Gemini

Creative Skills:
- Traditional artist — pencil sketches, watercolor portraits, anime illustration
- Arabic calligraphy designer — created multiple styled Basmala artworks
- Collage and mood board creation
- 3D modeling and animation in Blender
- Game design in Unity

Projects (Engineering & UX):
- Cartier VR Store — XR/Spatial luxury brand experience on Spatial platform, led conceptualization and asset library
- SAR UX Optimization — Customer journey research and VR/Museum experience concepts for Saudi train service
- Medad Food-Sharing Platform — React admin panel (5 screens) connecting restaurants with charities
- Portfolio Website — Full-stack site with GitHub API, AI chat, localStorage, animations — deployed on Netlify

Design & Ideation Projects:
- The Invisible Din — Sensory installation concept for autism sound sensitivity awareness
- The Forgotten Heir — 3D maze game built in Unity with custom environment and character
- The Excited Kirby — 3D animated character in Blender with walk cycle and tear particle effects
- Gamification Platform — UX/ideation project tackling unemployment through challenge-based hiring
- Figma Digital Profile — Interactive Figma prototype with multi-frame transitions
- Design Survey Projects — Empathy mapping, persona design, SCAMPER ideation, visceral/behavioral/reflective analysis

Full Portfolio: https://drive.google.com/drive/folders/1V0lXkz8aNds0z2jh6GGRMmbRcy8NjxJc

Career Interests:
- Brand strategy, visual identity, UX/frontend development, AI-driven design
- Applying to Gene — Strategic Saudi Branding & Design Firm
- Strong interest in brand naming, visual systems, and strategic brainstorming`;

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
