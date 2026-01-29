package com.project.back_end.controllers;

import com.project.back_end.models.Prescription;
import com.project.back_end.services.PrescriptionService;
import com.project.back_end.services.AppService;
import com.project.back_end.services.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("${api.path}prescription")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;
    private final AppService service;
    private final AppointmentService appointmentService;

    @Autowired
    public PrescriptionController(PrescriptionService prescriptionService, AppService service, AppointmentService appointmentService) {
        this.prescriptionService = prescriptionService;
        this.service = service;
        this.appointmentService = appointmentService;
    }

    // 1. Save Prescription
    @PostMapping("/{token}")
    public ResponseEntity<Map<String, String>> savePrescription(
            @PathVariable("token") String token,
            @RequestBody Prescription prescription) {

        // Validate token for doctor role
        ResponseEntity<Map<String, String>> tokenValidation = service.validateToken(token, "doctor");
        if (tokenValidation.getStatusCode() != HttpStatus.OK) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or expired token"));
        }

        // Save prescription
        return prescriptionService.savePrescription(prescription);
    }

    // 2. Get Prescription by Appointment ID
    @GetMapping("/{appointmentId}/{token}")
    public ResponseEntity<Map<String, Object>> getPrescription(
            @PathVariable("appointmentId") Long appointmentId,
            @PathVariable("token") String token) {

        // Validate token for doctor role
        ResponseEntity<Map<String, String>> tokenValidation = service.validateToken(token, "doctor");
        if (tokenValidation.getStatusCode() != HttpStatus.OK) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or expired token"));
        }

        // Fetch prescription for the given appointment ID
        return prescriptionService.getPrescription(appointmentId);
    }
}
