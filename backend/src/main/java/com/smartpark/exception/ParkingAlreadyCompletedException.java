package com.smartpark.exception;

public class ParkingAlreadyCompletedException extends RuntimeException {
    public ParkingAlreadyCompletedException(String message) {
        super(message);
    }
}
