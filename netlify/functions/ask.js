const https = require('https');

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { question } = JSON.parse(event.body);

        const FATIMAH_CONTEXT = `You are an AI assistant for Fatimah Alaamer's portfolio. Answer based ONLY on this info, keep it 2-4 sentences, friendly and professional:
- Software Engineering student at KFUPM, Saudi Arabia. Graduating May 2027.
- Skills: HTML, CSS, JavaScript, React, Node.js, Express, MongoDB, Git, Figma, VR/Spatial Design
- Projects: Cartier VR Store, SAR UX Optimization, Medad Food-Sharing Platform, Portfolio Website
- Career interests: Software Engineering, AI-driven development, UX/frontend`;

        const requestBody = JSON.stringify({
            model: 'nvidia/nemotron-3-super-120b-a12b:free',
            max_tokens: 300,
            messages: [
                { role: 'user', content: `${FATIMAH_CONTEXT}\n\nQuestion: ${question}` }
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
                        const text = parsed.choices?.[0]?.message?.content;
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
