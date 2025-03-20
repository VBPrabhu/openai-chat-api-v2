require('dotenv').config();
const express = require('express');
const cors = require('cors');
const expressWs = require('express-ws');
const axios = require('axios');

const app = express();
expressWs(app); // Enable WebSockets
const PORT = process.env.PORT || 5000;
const OPENAI_API_KEY = "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";
const STATIC_MODEL =  "gpt-3.5-turbo"; // Load model from .env
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ✅ Chat Completions with Streaming Support
app.post('/v1/chat/completions', async (req, res) => {
    try {
        const { messages, temperature = 0.7, stream = false } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Messages array is required" });
        }

        console.log(`\n🔹 Processing Chat Completion with Model: ${STATIC_MODEL} (Stream: ${stream})`);

        // ✅ Handle Streaming Response
        if (stream) {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                { model: STATIC_MODEL, messages, temperature, stream: true },
                {
                    headers: {
                        'Authorization': `Bearer ${OPENAI_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    responseType: 'stream' // Important for streaming response
                }
            );

            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            response.data.on('data', (chunk) => {
                const text = chunk.toString();
                console.log(`🔹 Chunk Received:`, text);
                res.write(text); // Forward chunk to frontend
            });

            response.data.on('end', () => {
                console.log("✅ Streaming complete.");
                res.end();
            });

            response.data.on('error', (error) => {
                console.error("❌ Streaming error:", error);
                res.end();
            });

        } else {
            // ✅ Handle Non-Streaming Response
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                { model: STATIC_MODEL, messages, temperature },
                {
                    headers: {
                        'Authorization': `Bearer ${OPENAI_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log(`✅ OpenAI Response:`, JSON.stringify(response.data, null, 2));
            res.json(response.data);
        }

    } catch (error) {
        console.error("❌ OpenAI API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({
            error: error.response?.data?.error?.message || "Error communicating with OpenAI API"
        });
    }
});

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT} using model: ${STATIC_MODEL}`));
