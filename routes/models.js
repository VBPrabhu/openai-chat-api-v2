const express = require('express');
const openaiApi = require('../openai');
const router = express.Router();

router.get('/v1/models', async (req, res) => {
    try {
        const response = await openaiApi.get('/models');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || "OpenAI API error" });
    }
});

module.exports = router;
