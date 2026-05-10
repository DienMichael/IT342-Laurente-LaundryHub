package edu.cit.laurente.laundryhub.features.machine;

import jakarta.validation.constraints.NotBlank;

public class StatusRequest {
    @NotBlank(message = "Status is required")
    private String status;

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}