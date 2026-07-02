document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Fetch Shared System Patient State ---
    const patients = JSON.parse(localStorage.getItem("patients")) || [];
    const alertsContainer = document.getElementById("alertsContainer");
    const alertSummary = document.getElementById("alertSummary");

    // --- 2. Alert Processing Engine ---
    function generateAlerts() {
        if (!alertsContainer) return;
        alertsContainer.innerHTML = ""; // Clear wrapper layout

        // Filter out only patients requiring immediate medical tracking alerts
        const anomalousPatients = patients.filter(p => p.status === "Critical" || p.status === "Warning");

        // UI Summary Count Update
        if (alertSummary) {
            alertSummary.textContent = `${anomalousPatients.length} Active System Anomalies`;
            alertSummary.style.color = anomalousPatients.length > 0 ? "#ef4444" : "#10b981";
        }

        // Base case: No active anomalies found
        if (anomalousPatients.length === 0) {
            alertsContainer.innerHTML = `
                <div class="no-alerts">
                    <h3>✅ All Systems Nominal</h3>
                    <p style="margin-top: 8px;">No critical vitals exceptions detected across current monitored hospital segments.</p>
                </div>`;
            return;
        }

        // Map data arrays out to clear UI notifications
        anomalousPatients.forEach((patient) => {
            const alertDiv = document.createElement("div");
            const lowerStatus = patient.status.toLowerCase();
            
            alertDiv.className = `alert-card ${lowerStatus}`;
            alertDiv.id = `alert-${patient.id}`;

            // Provide realistic context text based on status severity tier
            let anomalyDesc = "";
            if (patient.status === "Critical") {
                anomalyDesc = `🚨 <strong>Vitals Breach:</strong> SpO₂ falling below 92% or Heart Rate out of range thresholds. Immediate intervention required.`;
            } else {
                anomalyDesc = `⚠️ <strong>Vitals Fluctuating:</strong> Blood pressure or blood sugar metrics trending outside healthy benchmarks.`;
            }

            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            alertDiv.innerHTML = `
                <div class="alert-details">
                    <h4>${patient.name} (${patient.id}) — Status: <span style="text-transform: uppercase;">${patient.status}</span></h4>
                    <p>${anomalyDesc}</p>
                    <span class="alert-time">Triggered at: ${timestamp} | Ward Segment B</span>
                </div>
                <div class="alert-actions">
                    <button class="btn-ack" data-id="${patient.id}">Acknowledge</button>
                    <button class="btn-dismiss" data-id="${patient.id}">Dismiss</button>
                </div>
            `;
            
            alertsContainer.appendChild(alertDiv);
        });
    }

    // --- 3. Notification Card Action Handlers ---
    if (alertsContainer) {
        alertsContainer.addEventListener("click", (e) => {
            const targetButton = e.target;
            const patientId = targetButton.getAttribute("data-id");
            
            if (!patientId) return;

            const alertCard = document.getElementById(`alert-${patientId}`);

            if (targetButton.classList.contains("btn-ack")) {
                // Action: Acknowledge (visually mutes the alert banner)
                alertCard.style.opacity = "0.6";
                targetButton.textContent = "✓ Acknowledged";
                targetButton.style.backgroundColor = "#64748b";
                targetButton.disabled = true;
                alertCard.querySelector(".btn-dismiss").style.display = "none";
                alertCard.style.borderLeftColor = "#64748b"; // Neutral slate tone
            } 
            
            else if (targetButton.classList.contains("btn-dismiss")) {
                // Action: Fade out and slide up removal animation transition
                alertCard.style.transform = "translateX(50px)";
                alertCard.style.opacity = "0";
                setTimeout(() => {
                    alertCard.remove();
                    // Check if any alerts are left; if none, show the nominal message
                    if (alertsContainer.children.length === 0) {
                        alertsContainer.innerHTML = `
                            <div class="no-alerts">
                                <h3>✅ All Systems Nominal</h3>
                                <p style="margin-top: 8px;">No critical vitals exceptions detected across current monitored hospital segments.</p>
                            </div>`;
                    }
                }, 300);
            }
        });
    }

    // Initialize logic execution stream
    generateAlerts();
});