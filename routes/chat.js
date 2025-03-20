const express = require('express');
const openaiApi = require('../openai');
const router = express.Router();

router.post('/v1/chat/completions', async (req, res) => {
    try {
        const { messages, model = "gpt-3.5-turbo", temperature = 0.7 } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Messages array is required" });
        }

        const response = await openaiApi.post('/chat/completions', { model, messages, temperature });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || "OpenAI API error" });
    }
});

module.exports = router;
