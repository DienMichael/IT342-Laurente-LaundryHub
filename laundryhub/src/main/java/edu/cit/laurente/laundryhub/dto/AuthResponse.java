package edu.cit.laurente.laundryhub.dto;

public class AuthResponse {

    private boolean success;
    private String accessToken;
    private String name;
    private String email;
    private String role;

    public AuthResponse(boolean success, String accessToken, String name, String email, String role) {
        this.success = success;
        this.accessToken = accessToken;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    // Getters and Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}