package com.project.back_end.services;

import com.project.back_end.models.*;
import com.project.back_end.repo.*;
import com.project.back_end.DTO.Login;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service  // Spring detects this as a bean
public class AppService {

    private final TokenService tokenService;
    private final AdminRepository adminRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final DoctorService doctorService;
    private final PatientService patientService;

    @Autowired
    public AppService(TokenService tokenService,
                      AdminRepository adminRepository,
                      DoctorRepository doctorRepository,
                      PatientRepository patientRepository,
                      DoctorService doctorService,
                      PatientService patientService) {
        this.tokenService = tokenService;
        this.adminRepository = adminRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.doctorService = doctorService;
        this.patientService = patientService;
    }

    // 1. Validate Token
    public ResponseEntity<Map<String, String>> validateToken(String token, String user) {
        Map<String, String> response = new HashMap<>();
        try {
            boolean valid = tokenService.validateToken(token, user);
            if (!valid) {
                response.put("message", "Invalid or expired token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            response.put("message", "Token valid");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Error validating token");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 2. Validate Admin Login
    public ResponseEntity<Map<String, String>> validateAdmin(Admin receivedAdmin) {
        Map<String, String> response = new HashMap<>();
        try {
            Admin admin = adminRepository.findByUsername(receivedAdmin.getUsername());
            if (admin == null) {
                response.put("message", "Admin not found");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            if (!admin.getPassword().equals(receivedAdmin.getPassword())) {
                response.put("message", "Incorrect password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            String token = tokenService.generateToken(admin.getUsername());
            response.put("token", token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Error validating admin");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 3. Filter Doctors
    public Map<String, Object> filterDoctor(String name, String specialty, String time) {
        return doctorService.filterDoctorsByNameSpecilityandTime(name, specialty, time);
    }

    // 4. Validate Appointment
    public int validateAppointment(Appointment appointment) {
        try {
            Long doctorId = appointment.getDoctor().getId();
            Doctor doctor = doctorRepository.findById(doctorId).orElse(null);
            if (doctor == null) return -1;

            LocalDate date = appointment.getAppointmentTime().toLocalDate();
            List<String> availableSlots = doctorService.getDoctorAvailability(doctorId, date);

            String requestedTime = appointment.getAppointmentTime().toLocalTime().toString();
            if (availableSlots.contains(requestedTime)) return 1;

            return 0;
        } catch (Exception e) {
            return 0;
        }
    }

    // 5. Validate Patient existence
    public boolean validatePatient(Patient patient) {
        Patient existing = patientRepository.findByEmailOrPhone(patient.getEmail(), patient.getPhone());
        return existing == null;
    }

    // 6. Validate Patient Login
    public ResponseEntity<Map<String, String>> validatePatientLogin(Login login) {
        Map<String, String> response = new HashMap<>();
        try {
            Patient patient = patientRepository.findByEmail(login.getIdentifier());
            if (patient == null) {
                response.put("message", "Patient not found");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            if (!patient.getPassword().equals(login.getPassword())) {
                response.put("message", "Incorrect password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            String token = tokenService.generateToken(patient.getEmail());
            response.put("token", token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Error validating patient login");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 7. Filter Patient Appointments
    public ResponseEntity<Map<String, Object>> filterPatient(String condition, String name, String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            String email = tokenService.extractIdentifier(token);
            Patient patient = patientRepository.findByEmail(email);
            if (patient == null) {
                response.put("message", "Patient not found");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            Long patientId = patient.getId();

            if (condition != null && name != null) {
                return patientService.filterByDoctorAndCondition(condition, name, patientId);
            } else if (condition != null) {
                return patientService.filterByCondition(condition, patientId);
            } else if (name != null) {
                return patientService.filterByDoctor(name, patientId);
            } else {
                return patientService.getPatientAppointment(patientId, token);
            }
        } catch (Exception e) {
            response.put("message", "Error filtering patient appointments");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
