export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Yalnızca POST istekleri desteklenir.' });
    }

    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt alanı boş olamaz.' });
    }

    const apiKey = process.env.GEMINI_API_KEY; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
        } else {
            return res.status(500).json({ error: 'Gemini yanıt veremedi.', details: data });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Sunucu hatası: ' + error.message });
    }
                  }

