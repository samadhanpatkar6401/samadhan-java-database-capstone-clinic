// patientDashboard.js

// ===== IMPORTS =====
import { createDoctorCard } from "./components/doctorCard.js";
import { openModal } from "./components/modals.js";
import { getDoctors, filterDoctors } from "./services/doctorServices.js";
import { patientLogin, patientSignup } from "./services/patientServices.js";

// ===== DOM CONTENT LOADED =====
document.addEventListener("DOMContentLoaded", () => {
  loadDoctorCards();

  // Signup modal
  const signupBtn = document.getElementById("patientSignup");
  if (signupBtn) {
    signupBtn.addEventListener("click", () => openModal("patientSignup"));
  }

  // Login modal
  const loginBtn = document.getElementById("patientLogin");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => openModal("patientLogin"));
  }

  // Filters
  document.getElementById("searchBar")?.addEventListener("input", filterDoctorsOnChange);
  document.getElementById("filterTime")?.addEventListener("change", filterDoctorsOnChange);
  document.getElementById("filterSpecialty")?.addEventListener("change", filterDoctorsOnChange);
});

// ===== LOAD ALL DOCTORS =====
async function loadDoctorCards() {
  try {
    const doctors = await getDoctors();
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";

    doctors.forEach((doctor) => {
      const card = createDoctorCard(doctor);
      contentDiv.appendChild(card);
    });
  } catch (error) {
    console.error("Failed to load doctors:", error);
    document.getElementById("content").innerHTML =
      "<p>❌ Failed to load doctors. Please try again later.</p>";
  }
}

// ===== FILTER DOCTORS =====
async function filterDoctorsOnChange() {
  const nameInput = document.getElementById("searchBar").value.trim();
  const timeInput = document.getElementById("filterTime").value;
  const specialtyInput = document.getElementById("filterSpecialty").value;

  const name = nameInput.length > 0 ? nameInput : null;
  const time = timeInput.length > 0 ? timeInput : null;
  const specialty = specialtyInput.length > 0 ? specialtyInput : null;

  try {
    const response = await filterDoctors(name, time, specialty);
    const doctors = response.doctors || [];
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";

    if (doctors.length > 0) {
      doctors.forEach((doctor) => {
        const card = createDoctorCard(doctor);
        contentDiv.appendChild(card);
      });
    } else {
      contentDiv.innerHTML = "<p>No doctors found with the given filters.</p>";
    }
  } catch (error) {
    console.error("Failed to filter doctors:", error);
    document.getElementById("content").innerHTML =
      "<p>❌ Error filtering doctors. Try again later.</p>";
  }
}

// ===== PATIENT SIGNUP =====
window.signupPatient = async function () {
  try {
    const data = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
    };

    const { success, message } = await patientSignup(data);

    if (success) {
      alert(message);
      document.getElementById("modal").style.display = "none";
      window.location.reload();
    } else {
      alert(message);
    }
  } catch (error) {
    console.error("Signup failed:", error);
    alert("❌ An error occurred while signing up.");
  }
};

// ===== PATIENT LOGIN =====
window.loginPatient = async function () {
  try {
    const data = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };

    const response = await patientLogin(data);

    if (response.ok) {
      const result = await response.json();
      localStorage.setItem("token", result.token);
      window.location.href = "/pages/loggedPatientDashboard.html";
    } else {
      alert("❌ Invalid credentials!");
    }
  } catch (error) {
    console.error("Login failed:", error);
    alert("❌ Failed to login. Please try again.");
  }
};
