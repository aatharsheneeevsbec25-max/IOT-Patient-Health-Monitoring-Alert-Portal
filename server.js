const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const DATA_FOLDER = path.join(__dirname, "data");
const FILE_PATH = path.join(DATA_FOLDER, "patients.json");

// Create data folder and patients.json if they don't exist
if (!fs.existsSync(DATA_FOLDER)) {
    fs.mkdirSync(DATA_FOLDER);
}

if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, "[]");
}

// Home Route
app.get("/", (req, res) => {
    res.send("IoT Patient Health Monitoring Backend is Running!");
});

// ----------------------
// VITALS API
// ----------------------
app.get("/api/vitals", (req, res) => {

    res.json({
        heartRate: Math.floor(Math.random() * 40) + 60,
        temperature: (36 + Math.random() * 2).toFixed(1),
        spo2: Math.floor(Math.random() * 5) + 95,
        bloodPressure:
            `${Math.floor(Math.random() * 20) + 110}/${Math.floor(Math.random() * 10) + 70}`
    });

});

// ----------------------
// GET ALL PATIENTS
// ----------------------
app.get("/api/patients", (req, res) => {

    const patients = JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));

    res.json(patients);

});

// ----------------------
// ADD PATIENT
// ----------------------
app.post("/api/patients", (req, res) => {

    try {

        const patients = JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));

        const patient = {
            id: "PAT" + String(patients.length + 1).padStart(3, "0"),
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender,
            status: req.body.status || "Healthy"
        };

        patients.push(patient);

        fs.writeFileSync(FILE_PATH, JSON.stringify(patients, null, 2));

        res.json({
            success: true,
            message: "Patient Saved Successfully",
            patient
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

// ----------------------
// UPDATE PATIENT
// ----------------------
app.put("/api/patients/:id", (req, res) => {

    const patients = JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));

    const index = patients.findIndex(
        patient => patient.id === req.params.id
    );

    if (index === -1) {

        return res.status(404).json({
            message: "Patient not found"
        });

    }

    patients[index] = {
        ...patients[index],
        ...req.body
    };

    fs.writeFileSync(FILE_PATH, JSON.stringify(patients, null, 2));

    res.json({
        message: "Patient Updated Successfully"
    });

});

// ----------------------
// DELETE PATIENT
// ----------------------
app.delete("/api/patients/:id", (req, res) => {

    let patients = JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));

    patients = patients.filter(
        patient => patient.id !== req.params.id
    );

    fs.writeFileSync(FILE_PATH, JSON.stringify(patients, null, 2));

    res.json({
        message: "Patient Deleted Successfully"
    });

});

// ----------------------
// DASHBOARD API
// ----------------------
app.get("/api/dashboard", (req, res) => {

    const patients = JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));

    const totalPatients = patients.length;

    const healthyPatients = patients.filter(
        patient => patient.status === "Healthy"
    ).length;

    const warningPatients = patients.filter(
        patient => patient.status === "Warning"
    ).length;

    const criticalPatients = patients.filter(
        patient => patient.status === "Critical"
    ).length;

    res.json({
        totalPatients,
        healthyPatients,
        warningPatients,
        criticalPatients
    });

});

// ----------------------
// START SERVER
// ----------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server is running on port ${PORT}`);

});