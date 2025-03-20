require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(cors());
app.use(express.json());

// OpenAI Chat Completion Route (Matching OpenAI's API Path)
app.post('/v1/chat/completions', async (req, res) => {
    try {
        const { messages, model = "gpt-3.5-turbo", temperature = 0.7 } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Messages array is required" });
        }

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model,
                messages,
                temperature,
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Error communicating with OpenAI API" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
