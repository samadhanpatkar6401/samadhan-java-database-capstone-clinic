package com.project.back_end.controllers;

import com.project.back_end.models.Admin;
import com.project.back_end.services.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("${api.path}admin") // Base URL path for admin endpoints
public class AdminController {

    private final Service service;

    // Constructor injection of the Service
    @Autowired
    public AdminController(Service service) {
        this.service = service;
    }

    // Admin login endpoint
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> adminLogin(@RequestBody Admin admin) {
        // Delegates the login validation to the Service layer
        return service.validateAdmin(admin);
    }
}
