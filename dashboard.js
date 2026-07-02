document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. System Local Clock Generator ---
    function updateDateTime() {
        const dateTimeEl = document.getElementById("currentDateTime");
        if (dateTimeEl) {
            const now = new Date();
            dateTimeEl.textContent = now.toLocaleDateString('en-US', {
                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
        }
    }
    setInterval(updateDateTime, 1000);
    updateDateTime();

    // --- 2. Initialize Overview Statistic Metrics ---
    if (document.getElementById("totalPatients")) document.getElementById("totalPatients").textContent = "12";
    if (document.getElementById("healthyPatients")) document.getElementById("healthyPatients").textContent = "9";
    if (document.getElementById("warningPatients")) document.getElementById("warningPatients").textContent = "2";
    if (document.getElementById("criticalPatients")) document.getElementById("criticalPatients").textContent = "1";

    // --- 3. Dynamic IoT Sensor Telemetry Stream Simulation ---
    function simulateIoTData() {
        const currentHR = Math.floor(Math.random() * (95 - 68 + 1)) + 68;
        
        if (document.getElementById("heartRate")) document.getElementById("heartRate").textContent = currentHR;
        
        if (document.getElementById("bp")) {
            const sys = Math.floor(Math.random() * (128 - 116 + 1)) + 116;
            const dia = Math.floor(Math.random() * (84 - 76 + 1)) + 76;
            document.getElementById("bp").textContent = `${sys}/${dia}`;
        }
        
        if (document.getElementById("sugar")) document.getElementById("sugar").textContent = Math.floor(Math.random() * (115 - 90 + 1)) + 90;
        if (document.getElementById("spo2")) document.getElementById("spo2").textContent = Math.floor(Math.random() * (100 - 96 + 1)) + 96;
        if (document.getElementById("temperature")) document.getElementById("temperature").textContent = (Math.random() * (37.3 - 36.4) + 36.4).toFixed(1);
    }
    setInterval(simulateIoTData, 2000); // Pulls new vitals values every 2 seconds
    simulateIoTData();

    // --- 4. Canvas Oscilloscope Pulse Waveform Generator ---
    const canvas = document.getElementById("ecgCanvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        
        function resizeCanvas() {
            canvas.width = canvas.parentElement.clientWidth - 40;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        let x = 0;
        const speed = 2;
        const ecgPattern = [0, 0, 2, -3, 25, -6, 0, 4, 0, 0, 0, 0, 0, 0, 0];
        let patternIndex = 0;

        function drawECG() {
            ctx.fillStyle = "rgba(15, 23, 42, 0.1)"; 
            ctx.fillRect(x, 0, speed * 4, canvas.height);

            ctx.strokeStyle = "#10b981"; 
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            let lastY = canvas.height / 2;
            let currentYOffset = ecgPattern[patternIndex];
            patternIndex = (patternIndex + 1) % ecgPattern.length;
            
            let currentY = (canvas.height / 2) - (currentYOffset * 2);
            
            ctx.moveTo(x - speed, lastY);
            ctx.lineTo(x, currentY);
            ctx.stroke();

            x += speed;

            if (x >= canvas.width) {
                x = 0;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            requestAnimationFrame(drawECG);
        }
        drawECG();
    }
});