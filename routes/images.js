const express = require('express');
const openaiApi = require('../config/openai');
const router = express.Router();

router.post('/v1/images/generations', async (req, res) => {
    try {
        const { prompt, n = 1, size = "1024x1024" } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        const response = await openaiApi.post('/images/generations', { prompt, n, size });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || "OpenAI API error" });
    }
});

module.exports = router;
