const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// --- 1. Global Middleware Pipelines ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve all UI client-side assets (CSS styles, JS bundles, images) statically
app.use(express.static(path.join(__dirname, 'public')));
// Also match root directory files if assets fall back to parent scopes
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// --- 2. REST API Route Ecosystem Endpoints (Mock Server Pipeline Data) ---
let serverCachedPatients = [
    { id: "PAT001", name: "John Doe", age: 45, gender: "Male", status: "Healthy" },
    { id: "PAT002", name: "Priya", age: 34, gender: "Female", status: "Healthy" },
    { id: "PAT003", name: "Rahul", age: 29, gender: "Male", status: "Critical" }
];

app.get('/api/patients', (req, res) => {
    res.status(200).json(serverCachedPatients);
});

app.post('/api/patients', (req, res) => {
    const { name, age, gender, status } = req.body;
    if (!name || !age) {
        return res.status(400).json({ error: "Missing required patient attributes." });
    }
    const record = {
        id: `PAT${String(serverCachedPatients.length + 1).padStart(3, '0')}`,
        name, age, gender, status: status || "Healthy"
    };
    serverCachedPatients.push(record);
    res.status(201).json(record);
});

// --- 3. View Routing Maps ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Fallback error routing logic map
app.use((req, res) => {
    res.status(404).send('<h2 style="font-family:sans-serif; text-align:center; margin-top:50px;">404 - Clinical Interface Not Discovered</h2>');
});

// --- 4. Server Execution Boot Line ---
app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`🏥 IoT Health Clinical Gateway Active on Port ${PORT}`);
    console.log(`🚀 Access Interface local URL: http://localhost:${PORT}`);
    console.log(`===================================================`);
});