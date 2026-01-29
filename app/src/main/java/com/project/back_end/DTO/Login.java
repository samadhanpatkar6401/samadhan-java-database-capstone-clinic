package com.project.back_end.DTO;

public class Login {

    // 1. 'identifier' field
    // Represents the unique identifier for login (email for Doctor/Patient, username for Admin)
    private String identifier;

    // 2. 'password' field
    // Represents the user's password for authentication
    private String password;

    // Default constructor
    public Login() {
    }

    // Constructor with parameters (optional)
    public Login(String identifier, String password) {
        this.identifier = identifier;
        this.password = password;
    }

    // Getter and Setter for 'identifier'
    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    // Getter and Setter for 'password'
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
