package com.smartpark.config;

import com.smartpark.entity.ParkingSlot;
import com.smartpark.entity.ParkingSlotStatus;
import com.smartpark.repository.ParkingSlotRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final ParkingSlotRepository parkingSlotRepository;

    public DataInitializer(ParkingSlotRepository parkingSlotRepository) {
        this.parkingSlotRepository = parkingSlotRepository;
    }

    @Override
    public void run(String... args) {
        long currentSlotCount = parkingSlotRepository.count();
        if (currentSlotCount == 0) {
            logger.info("Initializing 50 parking slots (P01-P23: RESERVED, P24-P50: AVAILABLE)...");
            List<ParkingSlot> slots = new ArrayList<>();
            for (int i = 1; i <= 50; i++) {
                String slotNumber = String.format("P%02d", i);
                if (i <= 23) {
                    slots.add(new ParkingSlot(slotNumber, ParkingSlotStatus.RESERVED, true));
                } else {
                    slots.add(new ParkingSlot(slotNumber, ParkingSlotStatus.AVAILABLE, false));
                }
            }
            parkingSlotRepository.saveAll(slots);
            logger.info("Successfully initialized 50 parking slots.");
        } else {
            logger.info("Parking slots already exist in database (count: {}). Skipping initialization.", currentSlotCount);
        }
    }
}
