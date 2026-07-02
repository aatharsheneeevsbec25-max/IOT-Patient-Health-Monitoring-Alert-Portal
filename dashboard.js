// Live Dashboard Data

async function loadVitals() {

    try {

        const response = await fetch(// Update to point to your live Render server address:
"https://iot-patient-health-monitoring-alert-9yoy.onrender.com");

        const data = await response.json();

        document.getElementById("heartRate").innerHTML = data.heartRate;
        document.getElementById("temperature").innerHTML = data.temperature;
        document.getElementById("spo2").innerHTML = data.spo2;
        document.getElementById("bp").innerHTML = data.bloodPressure;
        updateHeartChart(Number(data.heartRate));

    } catch (error) {

        console.log(error);

    }

}

// Load immediately
loadVitals();

// Refresh every 2 seconds
setInterval(loadVitals, 2000);


// =======================
// ECG Graph
// =======================

const canvas = document.getElementById("ecgCanvas");
const ctx = canvas.getContext("2d");

let x = 0;

function drawECG() {

    if (x === 0) {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();

        ctx.moveTo(0, 125);

    }

    const y = 125 + (Math.random() * 60 - 30);

    ctx.lineTo(x, y);

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.stroke();

    x += 5;

    if (x > canvas.width) {

        x = 0;

    }

}

setInterval(drawECG, 50);
// Dashboard Statistics

async function loadDashboardStats() {

    try {

       const response = await fetch("https://my-project.onrender.com/api/dashboard");

        const data = await response.json();

        document.getElementById("totalPatients").innerHTML = data.totalPatients;
        document.getElementById("healthyPatients").innerHTML = data.healthyPatients;
        document.getElementById("warningPatients").innerHTML = data.warningPatients;
        document.getElementById("criticalPatients").innerHTML = data.criticalPatients;
        checkHealthStatus(
    Number(data.heartRate),
    Number(data.temperature),
    Number(data.spo2)
);
updateNotifications(
    Number(data.heartRate),
    Number(data.temperature),
    Number(data.spo2)
);

    } catch (error) {

        console.log(error);

    }

}

loadDashboardStats();

setInterval(loadDashboardStats, 3000);
// Current Date & Time

function updateDateTime() {

    const now = new Date();

    document.getElementById("currentDateTime").innerHTML =
        now.toLocaleDateString() + " | " + now.toLocaleTimeString();

}

updateDateTime();

setInterval(updateDateTime, 1000);
// ===============================
// Automatic Health Alerts
// ===============================

function checkHealthStatus(heartRate, temperature, spo2) {

    let message = "";

    if (heartRate > 120) {

        message = "🚨 Critical Alert: High Heart Rate (" + heartRate + " bpm)";

    } else if (spo2 < 92) {

        message = "⚠ Warning: Low Oxygen Level (" + spo2 + "%)";

    } else if (temperature > 39) {

        message = "🌡 Critical Alert: High Temperature (" + temperature + "°C)";

    } else {

        message = "✅ Patient is Stable";

    }

    const alertBox = document.getElementById("healthAlert");

    if(alertBox){

        alertBox.innerHTML = message;

    }

}
// ===============================
// Heart Rate Chart
// ===============================

const chartCtx = document.getElementById("heartChart").getContext("2d");

const heartChart = new Chart(chartCtx, {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "Heart Rate",
            data: [],
            borderColor: "red",
            borderWidth: 2,
            fill: false
        }]
    },
    options: {
        responsive: true,
        animation: false,
        scales: {
            y: {
                min: 40,
                max: 160
            }
        }
    }
});

function updateHeartChart(value){

    const time = new Date().toLocaleTimeString();

    heartChart.data.labels.push(time);
    heartChart.data.datasets[0].data.push(value);

    if(heartChart.data.labels.length > 10){

        heartChart.data.labels.shift();
        heartChart.data.datasets[0].data.shift();

    }

    heartChart.update();

}
// ===============================
// Notification Counter
// ===============================

function updateNotifications(heartRate, temperature, spo2){

    let count = 0;

    if(heartRate > 120) count++;

    if(temperature > 39) count++;

    if(spo2 < 92) count++;

    document.getElementById("notificationCount").innerHTML = count;

}