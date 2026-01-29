// adminDashboard.js

import { openModal } from "../components/modals.js";
import {
  getDoctors,
  filterDoctors,
  saveDoctor,
} from "./services/doctorServices.js";
import { createDoctorCard } from "./components/doctorCard.js";

// ================================
// Open Add Doctor Modal
// ================================
document.getElementById("addDocBtn").addEventListener("click", () => {
  openModal("addDoctor");
});

// ================================
// Load Doctors on Page Load
// ================================
document.addEventListener("DOMContentLoaded", () => {
  loadDoctorCards();
});

// ================================
// Fetch & Render All Doctors
// ================================
async function loadDoctorCards() {
  try {
    const doctors = await getDoctors();
    renderDoctorCards(doctors);
  } catch (error) {
    console.error("Error loading doctors:", error);
  }
}

// ================================
// Render Doctor Cards
// ================================
function renderDoctorCards(doctors) {
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = "";

  if (!doctors || doctors.length === 0) {
    contentDiv.innerHTML = "<p>No doctors found.</p>";
    return;
  }

  doctors.forEach((doctor) => {
    const card = createDoctorCard(doctor);
    contentDiv.appendChild(card);
  });
}

// ================================
// Search & Filter Listeners
// ================================
document
  .getElementById("searchBar")
  .addEventListener("input", filterDoctorsOnChange);
document
  .getElementById("filterTime")
  .addEventListener("change", filterDoctorsOnChange);
document
  .getElementById("filterSpecialty")
  .addEventListener("change", filterDoctorsOnChange);

// ================================
// Filter Doctors
// ================================
async function filterDoctorsOnChange() {
  const name = document.getElementById("searchBar").value || null;
  const time = document.getElementById("filterTime").value || null;
  const specialty =
    document.getElementById("filterSpecialty").value || null;

  try {
    const result = await filterDoctors(name, time, specialty);

    if (!result || result.length === 0) {
      const contentDiv = document.getElementById("content");
      contentDiv.innerHTML =
        "<p>No doctors found with the given filters.</p>";
      return;
    }

    renderDoctorCards(result);
  } catch (error) {
    console.error("Error filtering doctors:", error);
    alert("Error filtering doctors");
  }
}

// ================================
// Add Doctor (Modal Submit)
// ================================
window.adminAddDoctor = async function () {
  const name = document.getElementById("docName").value;
  const email = document.getElementById("docEmail").value;
  const phone = document.getElementById("docPhone").value;
  const password = document.getElementById("docPassword").value;
  const specialty = document.getElementById("docSpecialty").value;

  const availability = Array.from(
    document.querySelectorAll("input[name='availability']:checked")
  ).map((el) => el.value);

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Unauthorized! Please login again.");
    return;
  }

  const doctor = {
    name,
    email,
    phone,
    password,
    specialty,
    availability,
  };

  try {
    const result = await saveDoctor(doctor, token);

    if (result.success) {
      alert(result.message);
      window.location.reload();
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error("Error adding doctor:", error);
    alert("Failed to add doctor");
  }
};
