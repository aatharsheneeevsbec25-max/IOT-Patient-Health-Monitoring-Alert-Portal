document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Load existing database array from browser memory or seed sample data ---
    let patientsState = JSON.parse(localStorage.getItem("patients")) || [
        { id: "PAT001", name: "John Doe", age: 45, gender: "Male", status: "Healthy" },
        { id: "PAT002", name: "Priya", age: 34, gender: "Female", status: "Healthy" },
        { id: "PAT003", name: "Rahul", age: 29, gender: "Male", status: "Critical" }
    ];

    const tableBody = document.getElementById("patientsTableBody");
    const addForm = document.getElementById("addPatientForm");

    // --- 2. Live Rendering Engine for the Patient Table Rows ---
    function renderPatientsTable() {
        if (!tableBody) return;
        tableBody.innerHTML = ""; // Clear existing placeholder content

        if (patientsState.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#64748b; padding:20px;">No active monitored clinical files discovered.</td></tr>`;
            return;
        }

        patientsState.forEach(patient => {
            const tr = document.createElement("tr");
            
            // Assign custom styling classes based on condition status
            let pillColor = "background-color: #d1fae5; color: #065f46;"; // Healthy
            if (patient.status === "Critical") pillColor = "background-color: #fee2e2; color: #991b1b;";
            if (patient.status === "Warning") pillColor = "background-color: #fef3c7; color: #92400e;";

            tr.innerHTML = `
                <td><strong>${patient.id}</strong></td>
                <td>${patient.name}</td>
                <td>${patient.age}</td>
                <td>${patient.gender}</td>
                <td><span style="padding: 5px 12px; border-radius: 12px; font-weight: 600; font-size: 12px; ${pillColor}">${patient.status}</span></td>
                <td>
                    <button class="btn-delete" data-id="${patient.id}">🗑️ Remove</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
        
        // Sync data modifications back to browser storage
        localStorage.setItem("patients", JSON.stringify(patientsState));
    }

    // --- 3. Registration Form Intercept Event Submission Handler ---
    if (addForm) {
        addForm.addEventListener("submit", (e) => {
            e.preventDefault(); // Stop page from refreshing
            
            // Generate next incremental system index tracking identity ID
            const nextIndex = patientsState.length > 0 
                ? Math.max(...patientsState.map(p => parseInt(p.id.replace("PAT", "")))) + 1 
                : 1;
            const generatedId = `PAT${String(nextIndex).padStart(3, '0')}`;

            // Extract values safely from form fields
            const newPatient = {
                id: generatedId,
                name: document.getElementById("pName").value.trim(),
                age: parseInt(document.getElementById("pAge").value),
                gender: document.getElementById("pGender").value,
                status: document.getElementById("pStatus").value
            };

            // Push into local array stack and redraw UI components
            patientsState.push(newPatient);
            renderPatientsTable();
            addForm.reset(); // Clear input boxes
        });
    }

    // --- 4. Delegation Event Handler for Record Deletions ---
    if (tableBody) {
        tableBody.addEventListener("click", (e) => {
            if (e.target.classList.contains("btn-delete")) {
                const targetId = e.target.getAttribute("data-id");
                // Filter out selected record
                patientsState = patientsState.filter(p => p.id !== targetId);
                renderPatientsTable();
            }
        });
    }

    // Run table calculation display immediately upon file instantiation loading
    renderPatientsTable();
});