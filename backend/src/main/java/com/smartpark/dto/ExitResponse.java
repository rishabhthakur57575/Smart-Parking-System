package com.smartpark.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ExitResponse {

    private String token;
    private String vehicleNumber;
    private String slotNumber;
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;
    private Integer durationHours;
    private Integer ratePerHour;
    private BigDecimal amount;
    private BigDecimal totalAmount;
    private String duration;
    private String rate;
    private String currentTime;
    private String status;

    public ExitResponse() {
    }

    public ExitResponse(String token, String vehicleNumber, String slotNumber, LocalDateTime entryTime,
                        LocalDateTime exitTime, Integer durationHours, Integer ratePerHour,
                        BigDecimal amount, String status) {
        this.token = token;
        this.vehicleNumber = vehicleNumber;
        this.slotNumber = slotNumber;
        this.entryTime = entryTime;
        this.exitTime = exitTime;
        this.durationHours = durationHours;
        this.ratePerHour = ratePerHour;
        this.amount = amount;
        this.totalAmount = amount;
        this.duration = durationHours + " Hours";
        this.rate = "₹" + ratePerHour + "/hour";
        this.currentTime = exitTime != null ? exitTime.toString() : null;
        this.status = status;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public String getSlotNumber() {
        return slotNumber;
    }

    public void setSlotNumber(String slotNumber) {
        this.slotNumber = slotNumber;
    }

    public LocalDateTime getEntryTime() {
        return entryTime;
    }

    public void setEntryTime(LocalDateTime entryTime) {
        this.entryTime = entryTime;
    }

    public LocalDateTime getExitTime() {
        return exitTime;
    }

    public void setExitTime(LocalDateTime exitTime) {
        this.exitTime = exitTime;
        if (exitTime != null) {
            this.currentTime = exitTime.toString();
        }
    }

    public Integer getDurationHours() {
        return durationHours;
    }

    public void setDurationHours(Integer durationHours) {
        this.durationHours = durationHours;
        if (durationHours != null) {
            this.duration = durationHours + " Hours";
        }
    }

    public Integer getRatePerHour() {
        return ratePerHour;
    }

    public void setRatePerHour(Integer ratePerHour) {
        this.ratePerHour = ratePerHour;
        if (ratePerHour != null) {
            this.rate = "₹" + ratePerHour + "/hour";
        }
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
        this.totalAmount = amount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount != null ? totalAmount : amount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getDuration() {
        return duration != null ? duration : (durationHours != null ? durationHours + " Hours" : null);
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getRate() {
        return rate != null ? rate : (ratePerHour != null ? "₹" + ratePerHour + "/hour" : "₹30/hour");
    }

    public void setRate(String rate) {
        this.rate = rate;
    }

    public String getCurrentTime() {
        return currentTime;
    }

    public void setCurrentTime(String currentTime) {
        this.currentTime = currentTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
