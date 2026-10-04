package com.smartpark.repository;

import com.smartpark.entity.ParkingSlot;
import com.smartpark.entity.ParkingSlotStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParkingSlotRepository extends JpaRepository<ParkingSlot, Long> {

    Optional<ParkingSlot> findBySlotNumber(String slotNumber);

    List<ParkingSlot> findByStatus(ParkingSlotStatus status);

    boolean existsBySlotNumber(String slotNumber);

    List<ParkingSlot> findAllByOrderByIdAsc();

    /**
     * Pessimistic write lock to prevent race conditions during concurrent booking attempts.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM ParkingSlot s WHERE s.id = :id")
    Optional<ParkingSlot> findByIdWithLock(@Param("id") Long id);
}
