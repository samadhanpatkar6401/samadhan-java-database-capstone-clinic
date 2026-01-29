// patientServices.js
import { API_BASE_URL } from "../config/config.js";

const PATIENT_API = API_BASE_URL + "/patient";

// ================================
// Create Patient (Signup)
// ================================
export async function patientSignup(data) {
  try {
    const response = await fetch(`${PATIENT_API}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return { success: true, message: result.message };
  } catch (error) {
    console.error("Error :: patientSignup ::", error);
    return { success: false, message: error.message };
  }
}

// ================================
// Patient Login
// ================================
export async function patientLogin(data) {
  try {
    return await fetch(`${PATIENT_API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Error :: patientLogin ::", error);
    throw error;
  }
}

// ================================
// Fetch Logged-in Patient Data
// ================================
export async function getPatientData(token) {
  try {
    const response = await fetch(`${PATIENT_API}/${token}`);
    const data = await response.json();

    if (response.ok) {
      return data.patient;
    }

    return null;
  } catch (error) {
    console.error("Error fetching patient data:", error);
    return null;
  }
}

// ================================
// Fetch Patient Appointments
// Used by both Doctor & Patient dashboards
// ================================
export async function getPatientAppointments(id, token, user) {
  try {
    const response = await fetch(`${PATIENT_API}/${id}/${user}/${token}`);
    const data = await response.json();

    if (response.ok) {
      return data.appointments;
    }

    return null;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return null;
  }
}

// ================================
// Filter Appointments
// ================================
export async function filterAppointments(condition, name, token) {
  try {
    const response = await fetch(
      `${PATIENT_API}/filter/${condition}/${name}/${token}`
    );

    if (response.ok) {
      const data = await response.json();
      return data.appointments || [];
    } else {
      console.error("Failed to fetch appointments:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error filtering appointments:", error);
    alert("Something went wrong!");
    return [];
  }
}
