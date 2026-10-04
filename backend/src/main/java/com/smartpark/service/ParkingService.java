package com.smartpark.service;

import com.smartpark.dto.*;
import com.smartpark.entity.ParkingRecord;
import com.smartpark.entity.ParkingRecordStatus;
import com.smartpark.entity.ParkingSlot;
import com.smartpark.entity.ParkingSlotStatus;
import com.smartpark.exception.InvalidParkingTokenException;
import com.smartpark.exception.ParkingAlreadyCompletedException;
import com.smartpark.exception.SlotNotFoundException;
import com.smartpark.exception.SlotUnavailableException;
import com.smartpark.repository.ParkingRecordRepository;
import com.smartpark.repository.ParkingSlotRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ParkingService {

    private static final int RATE_PER_HOUR = 30;

    private final ParkingSlotRepository parkingSlotRepository;
    private final ParkingRecordRepository parkingRecordRepository;

    public ParkingService(ParkingSlotRepository parkingSlotRepository, ParkingRecordRepository parkingRecordRepository) {
        this.parkingSlotRepository = parkingSlotRepository;
        this.parkingRecordRepository = parkingRecordRepository;
    }

    @Transactional(readOnly = true)
    public List<ParkingSlotResponse> getAllSlots() {
        return parkingSlotRepository.findAllByOrderByIdAsc().stream()
                .map(this::mapToSlotResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ParkingSlotResponse getSlotById(Long id) {
        ParkingSlot slot = parkingSlotRepository.findById(id)
                .orElseThrow(() -> new SlotNotFoundException("Parking slot not found with ID: " + id));
        return mapToSlotResponse(slot);
    }

    @Transactional
    public BookingResponse bookSlot(BookingRequest request) {
        Long slotId = request.getSlotId();
        String vehicleNumber = request.getVehicleNumber().trim().toUpperCase();

        // Use pessimistic lock to prevent concurrent booking of the same slot
        ParkingSlot slot = parkingSlotRepository.findByIdWithLock(slotId)
                .orElseThrow(() -> new SlotNotFoundException("Parking slot not found with ID: " + slotId));

        if (slot.getStatus() == ParkingSlotStatus.RESERVED || Boolean.TRUE.equals(slot.getReserved())) {
            throw new SlotUnavailableException("Parking slot " + slot.getSlotNumber() + " is reserved and cannot be booked.");
        }

        if (slot.getStatus() == ParkingSlotStatus.OCCUPIED) {
            throw new SlotUnavailableException("Parking slot " + slot.getSlotNumber() + " is no longer available.");
        }

        if (slot.getStatus() != ParkingSlotStatus.AVAILABLE) {
            throw new SlotUnavailableException("Parking slot " + slot.getSlotNumber() + " is not available for booking.");
        }

        // Generate unique token: PK-2026-XXXXX
        String token = generateUniqueToken();
        LocalDateTime entryTime = LocalDateTime.now();

        // Mark slot as OCCUPIED
        slot.setStatus(ParkingSlotStatus.OCCUPIED);
        slot.setReserved(false);
        parkingSlotRepository.save(slot);

        // Create active ParkingRecord
        ParkingRecord record = new ParkingRecord(token, vehicleNumber, slot, entryTime, ParkingRecordStatus.ACTIVE);
        parkingRecordRepository.save(record);

        return new BookingResponse(
                token,
                slot.getSlotNumber(),
                vehicleNumber,
                entryTime,
                ParkingRecordStatus.ACTIVE.name()
        );
    }

    @Transactional
    public ExitResponse calculateExit(ExitRequest request) {
        String token = request.getToken().trim().toUpperCase();

        ParkingRecord record = parkingRecordRepository.findByToken(token)
                .orElseThrow(() -> new InvalidParkingTokenException("Invalid parking token: " + request.getToken()));

        if (record.getStatus() == ParkingRecordStatus.COMPLETED) {
            throw new ParkingAlreadyCompletedException("Parking record for token " + token + " is already settled.");
        }

        LocalDateTime exitTime = LocalDateTime.now();
        Duration duration = Duration.between(record.getEntryTime(), exitTime);
        long seconds = Math.max(1, duration.getSeconds());
        long totalMinutes = (seconds + 59) / 60;
        int durationHours = (int) Math.ceil(totalMinutes / 60.0);
        if (durationHours < 1) {
            durationHours = 1;
        }

        BigDecimal amount = BigDecimal.valueOf((long) durationHours * RATE_PER_HOUR);

        // Store calculated exit parameters on record, but keep status ACTIVE and slot OCCUPIED until payment
        record.setExitTime(exitTime);
        record.setDurationHours(durationHours);
        record.setAmount(amount);
        parkingRecordRepository.save(record);

        String slotNumber = record.getParkingSlot() != null ? record.getParkingSlot().getSlotNumber() : "";

        return new ExitResponse(
                record.getToken(),
                record.getVehicleNumber(),
                slotNumber,
                record.getEntryTime(),
                exitTime,
                durationHours,
                RATE_PER_HOUR,
                amount,
                record.getStatus().name()
        );
    }

    @Transactional(readOnly = true)
    public List<ParkingHistoryResponse> getHistory() {
        return parkingRecordRepository.findAllByOrderByEntryTimeDesc().stream()
                .map(record -> new ParkingHistoryResponse(
                        record.getToken(),
                        record.getVehicleNumber(),
                        record.getParkingSlot() != null ? record.getParkingSlot().getSlotNumber() : "N/A",
                        record.getEntryTime(),
                        record.getExitTime(),
                        record.getDurationHours(),
                        record.getAmount(),
                        record.getStatus().name()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public ParkingSlotResponse freeReservedSlot(Long id) {
        ParkingSlot slot = parkingSlotRepository.findById(id)
                .orElseThrow(() -> new SlotNotFoundException("Parking slot not found with ID: " + id));

        if (slot.getStatus() == ParkingSlotStatus.OCCUPIED) {
            throw new SlotUnavailableException("Occupied slot " + slot.getSlotNumber() + " cannot be freed.");
        }

        if (slot.getStatus() == ParkingSlotStatus.AVAILABLE && !Boolean.TRUE.equals(slot.getReserved())) {
            return mapToSlotResponse(slot);
        }

        if (slot.getStatus() != ParkingSlotStatus.RESERVED) {
            throw new SlotUnavailableException("Only reserved slots can be freed.");
        }

        slot.setStatus(ParkingSlotStatus.AVAILABLE);
        slot.setReserved(false);
        ParkingSlot updated = parkingSlotRepository.save(slot);

        return mapToSlotResponse(updated);
    }

    private String generateUniqueToken() {
        String token;
        do {
            String hex = UUID.randomUUID().toString().replace("-", "").substring(0, 5).toUpperCase();
            token = "PK-2026-" + hex;
        } while (parkingRecordRepository.existsByToken(token));
        return token;
    }

    private ParkingSlotResponse mapToSlotResponse(ParkingSlot slot) {
        return new ParkingSlotResponse(
                slot.getId(),
                slot.getSlotNumber(),
                slot.getStatus().name(),
                slot.getReserved()
        );
    }
}
