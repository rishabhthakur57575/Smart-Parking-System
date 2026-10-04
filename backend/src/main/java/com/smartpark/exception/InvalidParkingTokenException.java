package com.smartpark.exception;

public class InvalidParkingTokenException extends RuntimeException {
    public InvalidParkingTokenException(String message) {
        super(message);
    }
}
