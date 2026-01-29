// doctorDashboard.js

import { getAllAppointments } from "./services/appointmentRecordService.js";
import { createPatientRow } from "./components/patientRows.js";

// ================================
// Global Variables
// ================================
const tableBody = document.getElementById("patientTableBody");

// today's date in YYYY-MM-DD format
let selectedDate = new Date().toISOString().split("T")[0];

// token for authenticated requests
const token = localStorage.getItem("token");

// patient name filter (null by default)
let patientName = null;

// ================================
// Search Bar Listener
// ================================
document.getElementById("searchBar").addEventListener("input", (e) => {
  const value = e.target.value.trim();
  patientName = value !== "" ? value : "null";
  loadAppointments();
});

// ================================
// Today's Appointments Button
// ================================
document.getElementById("todayButton").addEventListener("click", () => {
  selectedDate = new Date().toISOString().split("T")[0];
  document.getElementById("datePicker").value = selectedDate;
  loadAppointments();
});

// ================================
// Date Picker Listener
// ================================
document.getElementById("datePicker").addEventListener("change", (e) => {
  selectedDate = e.target.value;
  loadAppointments();
});

// ================================
// Load Appointments Function
// ================================
async function loadAppointments() {
  try {
    const appointments = await getAllAppointments(
      selectedDate,
      patientName,
      token
    );

    tableBody.innerHTML = "";

    if (!appointments || appointments.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5">No Appointments found for today.</td>
        </tr>
      `;
      return;
    }

    appointments.forEach((appointment) => {
      const patient = {
        id: appointment.patient.id,
        name: appointment.patient.name,
        phone: appointment.patient.phone,
        email: appointment.patient.email,
      };

      const row = createPatientRow(appointment, patient);
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading appointments:", error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="5">Error loading appointments. Try again later.</td>
      </tr>
    `;
  }
}

// ================================
// Initial Page Load
// ================================
document.addEventListener("DOMContentLoaded", () => {
  if (typeof renderContent === "function") {
    renderContent();
  }
  loadAppointments();
});
