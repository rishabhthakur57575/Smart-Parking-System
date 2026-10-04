package com.smartpark.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BookingRequest {

    @NotNull(message = "slotId is required")
    private Long slotId;

    @NotBlank(message = "vehicleNumber is required")
    private String vehicleNumber;

    public BookingRequest() {
    }

    public BookingRequest(Long slotId, String vehicleNumber) {
        this.slotId = slotId;
        this.vehicleNumber = vehicleNumber;
    }

    public Long getSlotId() {
        return slotId;
    }

    public void setSlotId(Long slotId) {
        this.slotId = slotId;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }
}
