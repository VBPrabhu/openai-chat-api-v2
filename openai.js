require('dotenv').config();
const axios = require('axios');

const openaiApi = axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
    },
});

module.exports = openaiApi;
