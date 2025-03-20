const express = require('express');
const openaiApi = require('../openai');
const router = express.Router();

router.post('/v1/embeddings', async (req, res) => {
    try {
        const { input, model = "text-embedding-ada-002" } = req.body;

        if (!input) {
            return res.status(400).json({ error: "Input text is required" });
        }

        const response = await openaiApi.post('/embeddings', { input, model });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || "OpenAI API error" });
    }
});

module.exports = router;
