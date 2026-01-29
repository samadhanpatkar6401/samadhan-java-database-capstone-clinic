package com.project.back_end.mvc;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.project.back_end.service.TokenValidationService;

@Controller
public class DashboardController {

    // Autowire the service that validates JWT tokens
    @Autowired
    private TokenValidationService tokenValidationService;

    // Admin Dashboard
    @GetMapping("/adminDashboard/{token}")
    public String adminDashboard(@PathVariable String token) {

        // Validate token for admin role
        Map<String, String> result = tokenValidationService.validateToken(token, "admin");

        // If map is empty → token is valid
        if (result.isEmpty()) {
            return "admin/adminDashboard";
        }

        // If token is invalid → redirect to login/home page
        return "redirect:/";
    }

    // Doctor Dashboard
    @GetMapping("/doctorDashboard/{token}")
    public String doctorDashboard(@PathVariable String token) {

        // Validate token for doctor role
        Map<String, String> result = tokenValidationService.validateToken(token, "doctor");

        // If map is empty → token is valid
        if (result.isEmpty()) {
            return "doctor/doctorDashboard";
        }

        // If token is invalid → redirect to login/home page
        return "redirect:/";
    }
}
