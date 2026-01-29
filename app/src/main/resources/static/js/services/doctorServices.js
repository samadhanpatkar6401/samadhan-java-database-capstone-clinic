import { API_BASE_URL } from "../config/config.js";

const DOCTOR_API = API_BASE_URL + "/doctor";

/**
 * Fetch all doctors
 */
export async function getDoctors() {
  try {
    const response = await fetch(DOCTOR_API);
    const data = await response.json();
    return data.doctors || [];
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
}

/**
 * Delete a doctor by ID (Admin only)
 */
export async function deleteDoctor(id, token) {
  try {
    const response = await fetch(`${DOCTOR_API}/${id}/${token}`, {
      method: "DELETE",
    });

    const data = await response.json();
    return {
      success: response.ok,
      message: data.message,
    };
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return {
      success: false,
      message: "Failed to delete doctor",
    };
  }
}

/**
 * Save (Add) a new doctor
 */
export async function saveDoctor(doctor, token) {
  try {
    const response = await fetch(`${DOCTOR_API}/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(doctor),
    });

    const data = await response.json();
    return {
      success: response.ok,
      message: data.message,
    };
  } catch (error) {
    console.error("Error saving doctor:", error);
    return {
      success: false,
      message: "Failed to save doctor",
    };
  }
}

/**
 * Filter doctors by name, time, and specialty
 */
export async function filterDoctors(name, time, specialty) {
  try {
    const n = name || "null";
    const t = time || "null";
    const s = specialty || "null";

    const response = await fetch(
      `${DOCTOR_API}/filter/${n}/${t}/${s}`
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.doctors || [];
  } catch (error) {
    alert("Failed to filter doctors");
    console.error(error);
    return [];
  }
}
