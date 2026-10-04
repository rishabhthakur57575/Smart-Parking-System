package com.smartpark.dto;

public class ParkingSlotResponse {

    private Long id;
    private String slotNumber;
    private String status;
    private Boolean reserved;

    public ParkingSlotResponse() {
    }

    public ParkingSlotResponse(Long id, String slotNumber, String status, Boolean reserved) {
        this.id = id;
        this.slotNumber = slotNumber;
        this.status = status;
        this.reserved = reserved;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSlotNumber() {
        return slotNumber;
    }

    public void setSlotNumber(String slotNumber) {
        this.slotNumber = slotNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getReserved() {
        return reserved;
    }

    public void setReserved(Boolean reserved) {
        this.reserved = reserved;
    }
}
