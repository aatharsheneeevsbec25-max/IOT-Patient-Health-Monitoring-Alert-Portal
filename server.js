const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" } 
});

// This handles incoming mock data
app.post('/api/vitals', (req, res) => {
    const { patientId, patientName, heartRate, spo2 } = req.body;
    const data = { patientId, patientName, heartRate, spo2, time: new Date() };

    // Broadcast the live metrics immediately to the front website
    io.emit('vitals-update', data);

    // Trigger an immediate notification if numbers look unsafe
    if (heartRate > 120 || spo2 < 92) {
        io.emit('emergency-alert', {
            patientName,
            message: `🚨 CRITICAL: HR is ${heartRate} BPM! SpO2 is ${spo2}%!`
        });
    }

    res.status(200).send("Data processed");
});

server.listen(5000, () => console.log("✅ Server running on Port 5000!"));