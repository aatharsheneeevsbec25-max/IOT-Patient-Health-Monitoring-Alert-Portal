document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Synced System Local Storage State Context ---
    const patients = JSON.parse(localStorage.getItem("patients")) || [
        { id: "PAT001", name: "John Doe", age: 45, gender: "Male", status: "Healthy" },
        { id: "PAT002", name: "Priya", age: 34, gender: "Female", status: "Healthy" },
        { id: "PAT003", name: "Rahul", age: 29, gender: "Male", status: "Critical" }
    ];

    const reportsTableBody = document.getElementById("reportsTableBody");
    const reportSearch = document.getElementById("reportSearch");

    // --- 2. Map Patients into Structured Reports Schema ---
    const reportsData = patients.map((patient, index) => {
        // Generate a pseudo-static historical evaluation timestamp
        const dateObj = new Date();
        dateObj.setDate(dateObj.getDate() - (index * 2)); // Spread dates apart backwards 
        
        return {
            reportId: `REP-${1024 + index}`,
            patientId: patient.id,
            name: patient.name,
            age: patient.age,
            date: dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            status: patient.status,
            fileName: `Clinical_Summary_${patient.id}.pdf`
        };
    });

    // --- 3. Table Rendering Engine ---
    function displayReports(dataToRender) {
        if (!reportsTableBody) return;
        reportsTableBody.innerHTML = "";

        if (dataToRender.length === 0) {
            reportsTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#64748b; padding:20px;">No matching diagnostics logs discovered.</td></tr>`;
            return;
        }

        dataToRender.forEach(report => {
            const tr = document.createElement("tr");

            // Apply specific badges for categorization metrics
            let statusBadge = `<span class="status-badge" style="background-color: #d1fae5; color: #065f46;">Nominal</span>`;
            if (report.status === "Critical") {
                statusBadge = `<span class="status-badge" style="background-color: #fee2e2; color: #991b1b;">Critical Risk</span>`;
            } else if (report.status === "Warning") {
                statusBadge = `<span class="status-badge" style="background-color: #fef3c7; color: #92400e;">Elevated</span>`;
            }

            tr.innerHTML = `
                <td><strong>${report.reportId}</strong></td>
                <td>${report.name} <span style="font-size:12px; color:#94a3b8;">(${report.patientId})</span></td>
                <td>${report.date}</td>
                <td>${statusBadge}</td>
                <td style="color:#475569; font-family: monospace; font-size:13px;">📄 ${report.fileName}</td>
                <td>
                    <button class="btn-download" data-filename="${report.fileName}" data-name="${report.name}">
                        📥 Download PDF
                    </button>
                </td>
            `;
            reportsTableBody.appendChild(tr);
        });
    }

    // --- 4. Filtering Search Handler Line ---
    if (reportSearch) {
        reportSearch.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            const filtered = reportsData.filter(r => 
                r.name.toLowerCase().includes(query) || 
                r.patientId.toLowerCase().includes(query) ||
                r.reportId.toLowerCase().includes(query)
            );
            displayReports(filtered);
        });
    }

    // --- 5. Simulated PDF Document Download Trigger Engine ---
    if (reportsTableBody) {
        reportsTableBody.addEventListener("click", (e) => {
            if (e.target.classList.contains("btn-download")) {
                const targetBtn = e.target;
                const fileName = targetBtn.getAttribute("data-filename");
                const patientName = targetBtn.getAttribute("data-name");

                targetBtn.textContent = "⌛ Compiling...";
                targetBtn.style.backgroundColor = "#64748b";
                targetBtn.disabled = true;

                // Emulate a compilation latency threshold check
                setTimeout(() => {
                    // Create an ephemeral downstream pseudo anchor asset frame loop
                    const element = document.createElement('a');
                    const simulatedContent = `IoT Patient Monitoring Dashboard\nClinical Analytics Record Summary File\n====================================\nPatient Name: ${patientName}\nGenerated Diagnostics Log File: ${fileName}\nStatus Classification Matrix: Secure Internal Diagnostics Stream Approved.\nTimestamp Validation: Verified System Output on ${new Date().toLocaleString()}`;
                    
                    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(simulatedContent));
                    element.setAttribute('download', fileName.replace(".pdf", ".txt")); // Browser text fallback schema download

                    element.style.display = 'none';
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);

                    // Re-instantiate control interface properties state layout
                    targetBtn.textContent = "📥 Download PDF";
                    targetBtn.style.backgroundColor = "#0284c7";
                    targetBtn.disabled = false;
                }, 1200);
            }
        });
    }

    // Initialize display call execution pipelines
    displayReports(reportsData);
});