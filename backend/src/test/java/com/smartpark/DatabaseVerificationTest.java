package com.smartpark;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class DatabaseVerificationTest {

    @BeforeAll
    static void setup() {
        SmartParkApplication.loadDotenv();
    }

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void verifyDatabaseTablesAndSlots() {
        // 1. Verify SHOW TABLES
        List<String> tables = jdbcTemplate.query(
                "SHOW TABLES",
                (rs, rowNum) -> rs.getString(1).toLowerCase()
        );

        System.out.println("Discovered database tables: " + tables);
        assertTrue(tables.contains("parking_slots"), "Table parking_slots must exist");
        assertTrue(tables.contains("parking_records"), "Table parking_records must exist");
        assertTrue(tables.contains("payments"), "Table payments must exist");
        assertTrue(tables.contains("admins"), "Table admins must exist");

        // 2. Verify parking_slots count is exactly 50
        Integer count = jdbcTemplate.queryForObject("SELECT count(*) FROM parking_slots", Integer.class);
        System.out.println("Total parking_slots count: " + count);
        assertEquals(50, count, "There must be exactly 50 parking slots");

        // 3. Verify slot distribution
        Integer p01Count = jdbcTemplate.queryForObject(
                "SELECT count(*) FROM parking_slots WHERE slot_number = 'P01'",
                Integer.class
        );
        Integer p50Count = jdbcTemplate.queryForObject(
                "SELECT count(*) FROM parking_slots WHERE slot_number = 'P50'",
                Integer.class
        );
        assertEquals(1, p01Count);
        assertEquals(1, p50Count);
    }
}
