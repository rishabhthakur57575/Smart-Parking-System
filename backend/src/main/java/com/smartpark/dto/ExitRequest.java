package com.smartpark.dto;

import jakarta.validation.constraints.NotBlank;

public class ExitRequest {

    @NotBlank(message = "Parking token is required")
    private String token;

    public ExitRequest() {
    }

    public ExitRequest(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
