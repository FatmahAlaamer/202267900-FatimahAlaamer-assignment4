export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { question } = req.body;

        const FATIMAH_CONTEXT = `You are an AI assistant for Fatimah Alaamer's portfolio. Answer based ONLY on this info. Keep it 2-4 sentences, friendly and professional. Answer directly — no thinking out loud.

About Fatimah Alaamer:
- Integrated Design (ITD) student at KFUPM, Dhahran, Saudi Arabia. Graduating 2027.
- Seeking: Visual Designer, Brand Designer, or UI/UX Designer internship/role
- Contact: 24fayman@gmail.com | +966 56 130 9808

Education:
- Bachelor of Science in Integrated Design (ITD), KFUPM
- Relevant courses: Function & Usability, Emotional Design, Design Ideation, Prototyping & Fabrication, Digital Visualization I & II, Web Engineering, Introduction to Data Science

Design Skills & Tools:
- Adobe Creative Suite (Photoshop, Illustrator, InDesign)
- Figma (interactive prototyping, multi-frame flows, overlays)
- Blender (3D modeling, animation, character rigging, particle effects)
- Unity (3D game design and environment building)
- AutoCAD, Design Thinking, Typography, Color Theory
- Arabic calligraphy (multiple styles)
- Hand illustration: watercolor portraits, pencil anime sketches
- User research, persona creation, empathy mapping, SCAMPER ideation

Leadership & Experience:
- Led design team for "Vision to Reality" event at KFUPM
- Directed ITD Club design team
- Applied ITD principles for "KFUPM WORLD" event visual identity
- Managed flow of 1000+ attendees at GSR event

Design Projects:
- Cartier VR Store — XR luxury retail experience on Spatial platform
- SAR UX Optimization — Customer journey research and VR/Museum experience
- Medad Food-Sharing Platform — UI/UX design + React frontend
- The Invisible Din — Sensory installation about autism sound sensitivity
- The Forgotten Heir — 3D Unity game
- The Excited Kirby — 3D Blender animation
- Gamification Platform — UX addressing unemployment
- Figma Digital Profile — Interactive multi-screen prototype
- Calligraphy Artworks — Arabic Basmala designs
- Illustration Portfolio — Watercolor and pencil portraits`;

        const requestBody = JSON.stringify({
            model: 'openai/gpt-oss-120b:free',
            max_tokens: 400,
            messages: [{
                role: 'user',
                content: `${FATIMAH_CONTEXT}\n\nQuestion: ${question}\n\nAnswer directly in 2-4 sentences only:`
            }]
        });

        const answer = await new Promise((resolve, reject) => {
            const https = require('https');
            const options = {
                hostname: 'openrouter.ai',
                path: '/api/v1/chat/completions',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'HTTP-Referer': 'https://fatimahalaamer.vercel.app',
                    'X-Title': 'Fatimah Portfolio',
                    'Content-Length': Buffer.byteLength(requestBody)
                }
            };

            const reqHttp = https.request(options, (response) => {
                let data = '';
                response.on('data', chunk => data += chunk);
                response.on('end', () => {
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

            reqHttp.on('error', reject);
            reqHttp.write(requestBody);
            reqHttp.end();
        });

        return res.status(200).json({ answer });

    } catch (err) {
        console.error('Handler error:', err);
        return res.status(500).json({ error: err.message });
    }
}