const axios = require('axios');

const patients = [
    { id: "P002", name: "John Doe" }
];

setInterval(() => {
    patients.forEach(async (patient) => {
        const randomHeartRate = Math.floor(Math.random() * (120 - 60 + 1)) + 60;
        const randomSpO2 = Math.floor(Math.random() * (100 - 90 + 1)) + 90;

        const payload = {
            patientId: patient.id,
            patientName: patient.name,
            heartRate: randomHeartRate,
            spo2: randomSpO2
        };

        const url = 'https://iot-patient-health-monitoring-alert-portal.onrender.com/api/vitals';

        try {
            console.log(`[SENDING TO] -> ${url}`);
            await axios.post(url, payload);
            console.log(`[DATA SENT] -> ${patient.name} | HR: ${randomHeartRate} | SpO2: ${randomSpO2}%`);
        } catch (err) {
            console.log(`\n--- ERROR DIAGNOSTICS ---`);
            console.log(`Status Code: ${err.response ? err.response.status : 'No response status'}`);
            console.log(`Status Text: ${err.response ? err.response.statusText : 'No status text'}`);
            console.log(`Server Response Data:`, err.response ? err.response.data : 'No data returned');
            console.log(`-------------------------\n`);
        }
    });
}, 3000);