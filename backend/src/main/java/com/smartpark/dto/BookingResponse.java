package com.smartpark.dto;

import java.time.LocalDateTime;

public class BookingResponse {

    private String token;
    private String slotNumber;
    private String vehicleNumber;
    private LocalDateTime entryTime;
    private String status;
    private Boolean success = true;

    public BookingResponse() {
    }

    public BookingResponse(String token, String slotNumber, String vehicleNumber, LocalDateTime entryTime, String status) {
        this.token = token;
        this.slotNumber = slotNumber;
        this.vehicleNumber = vehicleNumber;
        this.entryTime = entryTime;
        this.status = status;
        this.success = true;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getSlotNumber() {
        return slotNumber;
    }

    public void setSlotNumber(String slotNumber) {
        this.slotNumber = slotNumber;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public LocalDateTime getEntryTime() {
        return entryTime;
    }

    public void setEntryTime(LocalDateTime entryTime) {
        this.entryTime = entryTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }
}
