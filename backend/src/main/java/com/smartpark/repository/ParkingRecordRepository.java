package com.smartpark.repository;

import com.smartpark.entity.ParkingRecord;
import com.smartpark.entity.ParkingRecordStatus;
import com.smartpark.entity.ParkingSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParkingRecordRepository extends JpaRepository<ParkingRecord, Long> {

    Optional<ParkingRecord> findByToken(String token);

    Optional<ParkingRecord> findByParkingSlotAndStatus(ParkingSlot parkingSlot, ParkingRecordStatus status);

    List<ParkingRecord> findAllByOrderByEntryTimeDesc();

    boolean existsByToken(String token);
}
