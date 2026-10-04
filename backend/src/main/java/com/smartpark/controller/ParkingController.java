package com.smartpark.controller;

import com.smartpark.dto.*;
import com.smartpark.service.ParkingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parking")
public class ParkingController {

    private final ParkingService parkingService;

    public ParkingController(ParkingService parkingService) {
        this.parkingService = parkingService;
    }

    @GetMapping("/slots")
    public ResponseEntity<List<ParkingSlotResponse>> getAllSlots() {
        List<ParkingSlotResponse> slots = parkingService.getAllSlots();
        return ResponseEntity.ok(slots);
    }

    @GetMapping("/slots/{id}")
    public ResponseEntity<ParkingSlotResponse> getSlotById(@PathVariable Long id) {
        ParkingSlotResponse slot = parkingService.getSlotById(id);
        return ResponseEntity.ok(slot);
    }

    @PostMapping("/book")
    public ResponseEntity<BookingResponse> bookSlot(@Valid @RequestBody BookingRequest request) {
        BookingResponse response = parkingService.bookSlot(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/exit")
    public ResponseEntity<ExitResponse> exitParking(@Valid @RequestBody ExitRequest request) {
        ExitResponse response = parkingService.calculateExit(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<ParkingHistoryResponse>> getParkingHistory() {
        List<ParkingHistoryResponse> history = parkingService.getHistory();
        return ResponseEntity.ok(history);
    }

    @PutMapping("/slots/{id}/free")
    public ResponseEntity<ParkingSlotResponse> freeReservedSlot(@PathVariable Long id) {
        ParkingSlotResponse response = parkingService.freeReservedSlot(id);
        return ResponseEntity.ok(response);
    }
}
