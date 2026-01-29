package com.project.back_end.mvc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.project.back_end.services.TokenService;

@Controller
public class DashboardController {

    @Autowired
    private TokenService tokenService;

    // Admin Dashboard
    @GetMapping("/adminDashboard/{token}")
    public String adminDashboard(@PathVariable String token) {

        boolean isValid = tokenService.validateToken(token, "admin");

        if (isValid) {
            return "admin/adminDashboard";
        }

        return "redirect:/";
    }

    // Doctor Dashboard
    @GetMapping("/doctorDashboard/{token}")
    public String doctorDashboard(@PathVariable String token) {

        boolean isValid = tokenService.validateToken(token, "doctor");

        if (isValid) {
            return "doctor/doctorDashboard";
        }

        return "redirect:/";
    }
}
