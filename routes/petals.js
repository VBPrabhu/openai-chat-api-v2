const express = require('express');
const WebSocket = require('ws');
const router = express.Router();

const PETALS_WEBSOCKET_URL = "wss://chat.petals.dev";

router.ws('/api/v2/generate', (ws, req) => {
    const petalsSocket = new WebSocket(PETALS_WEBSOCKET_URL);

    petalsSocket.on('open', () => console.log("Connected to Petals"));
    petalsSocket.on('message', (data) => ws.send(data));
    petalsSocket.on('close', () => ws.close());
    petalsSocket.on('error', (err) => console.error("WebSocket error:", err));

    ws.on('message', (msg) => petalsSocket.send(msg));
    ws.on('close', () => petalsSocket.close());
});

module.exports = router;
