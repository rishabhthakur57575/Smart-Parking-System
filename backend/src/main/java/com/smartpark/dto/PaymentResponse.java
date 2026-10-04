package com.smartpark.dto;

import java.math.BigDecimal;

public class PaymentResponse {

    private String transactionId;
    private String token;
    private BigDecimal amount;
    private String paymentMethod;
    private String paymentStatus;
    private String slotNumber;
    private String parkingStatus;
    private Boolean success = true;
    private String message = "Parking completed successfully. Your parking slot has been released.";

    public PaymentResponse() {
    }

    public PaymentResponse(String transactionId, String token, BigDecimal amount,
                           String paymentMethod, String paymentStatus,
                           String slotNumber, String parkingStatus) {
        this.transactionId = transactionId;
        this.token = token;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.slotNumber = slotNumber;
        this.parkingStatus = parkingStatus;
        this.success = "SUCCESS".equalsIgnoreCase(paymentStatus);
        this.message = "Parking completed successfully. Your parking slot has been released.";
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
        this.success = "SUCCESS".equalsIgnoreCase(paymentStatus);
    }

    public String getSlotNumber() {
        return slotNumber;
    }

    public void setSlotNumber(String slotNumber) {
        this.slotNumber = slotNumber;
    }

    public String getParkingStatus() {
        return parkingStatus;
    }

    public void setParkingStatus(String parkingStatus) {
        this.parkingStatus = parkingStatus;
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
