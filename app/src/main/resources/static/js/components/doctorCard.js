// doctorCard.js

// Import functions for booking and admin operations
import { showBookingOverlay } from "./loggedPatient.js";
import { deleteDoctor } from "./doctorServices.js";
import { getPatientData } from "./patientServices.js";

/**
 * Creates a doctor card DOM element
 * @param {Object} doctor - Doctor information
 * @returns {HTMLElement} - A DOM element representing the doctor card
 */
export function createDoctorCard(doctor) {
    // Main card container
    const card = document.createElement("div");
    card.classList.add("doctor-card");

    // Get current user role from localStorage
    const role = localStorage.getItem("userRole");

    // Doctor Info Section
    const infoDiv = document.createElement("div");
    infoDiv.classList.add("doctor-info");

    const name = document.createElement("h3");
    name.textContent = doctor.name;

    const specialization = document.createElement("p");
    specialization.textContent = `Specialty: ${doctor.specialty}`;

    const email = document.createElement("p");
    email.textContent = `Email: ${doctor.email}`;

    const availability = document.createElement("p");
    availability.textContent = `Available: ${doctor.availability.join(", ")}`;

    infoDiv.appendChild(name);
    infoDiv.appendChild(specialization);
    infoDiv.appendChild(email);
    infoDiv.appendChild(availability);

    // Actions Section
    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("card-actions");

    // === ADMIN ROLE ACTIONS ===
    if (role === "admin") {
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Delete";
        removeBtn.classList.add("adminBtn");

        removeBtn.addEventListener("click", async () => {
            if (!confirm(`Are you sure you want to delete Dr. ${doctor.name}?`)) return;

            const token = localStorage.getItem("token");
            try {
                await deleteDoctor(doctor.id, token);
                alert(`Dr. ${doctor.name} deleted successfully`);
                card.remove(); // Remove card from DOM
            } catch (error) {
                console.error(error);
                alert("Failed to delete doctor. Try again.");
            }
        });

        actionsDiv.appendChild(removeBtn);
    }
    // === PATIENT (NOT LOGGED-IN) ROLE ACTIONS ===
    else if (role === "patient") {
        const bookNow = document.createElement("button");
        bookNow.textContent = "Book Now";
        bookNow.addEventListener("click", () => {
            alert("Please log in to book an appointment.");
        });
        actionsDiv.appendChild(bookNow);
    }
    // === LOGGED-IN PATIENT ROLE ACTIONS ===
    else if (role === "loggedPatient") {
        const bookNow = document.createElement("button");
        bookNow.textContent = "Book Now";

        bookNow.addEventListener("click", async (e) => {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Session expired. Please log in again.");
                window.location.href = "/";
                return;
            }
            try {
                const patientData = await getPatientData(token);
                showBookingOverlay(e, doctor, patientData);
            } catch (error) {
                console.error(error);
                alert("Failed to load booking info.");
            }
        });

        actionsDiv.appendChild(bookNow);
    }

    // Assemble card
    card.appendChild(infoDiv);
    card.appendChild(actionsDiv);

    return card;
}
