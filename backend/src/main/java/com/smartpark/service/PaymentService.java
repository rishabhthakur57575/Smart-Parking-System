package com.smartpark.service;

import com.smartpark.dto.PaymentRequest;
import com.smartpark.dto.PaymentResponse;
import com.smartpark.entity.*;
import com.smartpark.exception.InvalidParkingTokenException;
import com.smartpark.exception.ParkingAlreadyCompletedException;
import com.smartpark.exception.PaymentException;
import com.smartpark.repository.ParkingRecordRepository;
import com.smartpark.repository.ParkingSlotRepository;
import com.smartpark.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Random;

@Service
public class PaymentService {

    private static final int RATE_PER_HOUR = 30;

    private final ParkingRecordRepository parkingRecordRepository;
    private final ParkingSlotRepository parkingSlotRepository;
    private final PaymentRepository paymentRepository;
    private final Random random = new Random();

    public PaymentService(ParkingRecordRepository parkingRecordRepository,
                          ParkingSlotRepository parkingSlotRepository,
                          PaymentRepository paymentRepository) {
        this.parkingRecordRepository = parkingRecordRepository;
        this.parkingSlotRepository = parkingSlotRepository;
        this.paymentRepository = paymentRepository;
    }

    @Transactional
    public PaymentResponse processPayment(PaymentRequest request) {
        String token = request.getToken().trim().toUpperCase();

        // 1. Find the active parking record using token
        ParkingRecord record = parkingRecordRepository.findByToken(token)
                .orElseThrow(() -> new InvalidParkingTokenException("Invalid parking token: " + request.getToken()));

        if (record.getStatus() == ParkingRecordStatus.COMPLETED) {
            throw new ParkingAlreadyCompletedException("Parking record for token " + token + " is already completed.");
        }

        // Parse payment method
        PaymentMethod paymentMethod;
        try {
            paymentMethod = PaymentMethod.valueOf(request.getPaymentMethod().trim().toUpperCase());
        } catch (Exception e) {
            throw new PaymentException("Invalid payment method: " + request.getPaymentMethod() + ". Supported methods: UPI, CARD, CASH");
        }

        // 2. Ensure exit calculations are performed if not already calculated
        if (record.getExitTime() == null || record.getAmount() == null) {
            LocalDateTime exitTime = LocalDateTime.now();
            Duration duration = Duration.between(record.getEntryTime(), exitTime);
            long seconds = Math.max(1, duration.getSeconds());
            long totalMinutes = (seconds + 59) / 60;
            int durationHours = (int) Math.ceil(totalMinutes / 60.0);
            if (durationHours < 1) {
                durationHours = 1;
            }
            record.setExitTime(exitTime);
            record.setDurationHours(durationHours);
            record.setAmount(BigDecimal.valueOf((long) durationHours * RATE_PER_HOUR));
        }

        // 3. Generate unique transaction ID (e.g. TXN-849321)
        String transactionId = generateUniqueTransactionId();
        LocalDateTime paymentTime = LocalDateTime.now();

        // 4. Create and save Payment record
        Payment payment = new Payment(
                token,
                record.getAmount(),
                paymentMethod,
                PaymentStatus.SUCCESS,
                transactionId,
                paymentTime,
                record
        );
        paymentRepository.save(payment);

        // 7. Mark ParkingRecord status = COMPLETED
        record.setStatus(ParkingRecordStatus.COMPLETED);
        parkingRecordRepository.save(record);

        // 9. Release the corresponding ParkingSlot
        ParkingSlot slot = record.getParkingSlot();
        if (slot != null) {
            slot.setStatus(ParkingSlotStatus.AVAILABLE);
            slot.setReserved(false);
            parkingSlotRepository.save(slot);
        }

        String slotNumber = slot != null ? slot.getSlotNumber() : "";

        return new PaymentResponse(
                transactionId,
                token,
                record.getAmount(),
                paymentMethod.name(),
                PaymentStatus.SUCCESS.name(),
                slotNumber,
                record.getStatus().name()
        );
    }

    private String generateUniqueTransactionId() {
        String txnId;
        do {
            int num = 100000 + random.nextInt(900000);
            txnId = "TXN-" + num;
        } while (paymentRepository.existsByTransactionId(txnId));
        return txnId;
    }
}
