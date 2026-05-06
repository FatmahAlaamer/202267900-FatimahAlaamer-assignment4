const https = require('https');

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { question } = JSON.parse(event.body);

        const FATIMAH_CONTEXT = `You are an AI assistant for Fatimah Alaamer's portfolio. Answer based ONLY on this info. Keep it 2-4 sentences max, friendly and professional. Do NOT show your thinking process - just give the final answer directly.

About Fatimah Alaamer:
- Software Engineering student at KFUPM, Saudi Arabia. Graduating May 2027.
- Skills: HTML, CSS, JavaScript, React, Node.js, Express, MongoDB, Git, Figma, VR/Spatial Design, Adobe Creative Suite, Blender
- Projects: Cartier VR Store (XR/Spatial), SAR UX Optimization, Medad Food-Sharing Platform (React admin panel), Portfolio Website
- Also did: Sensory installation "The Invisible Din", 3D game "The Forgotten Heir", Figma Digital Profile, Calligraphy & illustration artwork
- Career interests: Software Engineering, Brand & Visual Design, AI-driven development, UX/frontend
- Applying for internships in branding and design agencies`;

        const requestBody = JSON.stringify({
            model: 'openai/gpt-oss-120b:free',
            max_tokens: 400,
            messages: [
                { 
                    role: 'user', 
                    content: `${FATIMAH_CONTEXT}\n\nQuestion: ${question}\n\nAnswer directly and concisely (2-4 sentences only, no thinking out loud):` 
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
                        
                        // Remove thinking tags if present
                        text = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
                        
                        // If still too long or looks like thinking, truncate
                        if (text.length > 600) {
                            text = text.substring(0, 600) + '...';
                        }
                        
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
