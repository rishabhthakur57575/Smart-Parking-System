package com.smartpark;

import org.junit.jupiter.api.Test;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class DotenvLoadingTest {

    @Test
    void testDotenvVariablesAreLoaded() throws Exception {
        Path tempEnv = Paths.get("target", "test-dotenv.env");
        Files.createDirectories(tempEnv.getParent());
        Files.writeString(tempEnv, "TEST_DB_URL=jdbc:mysql://localhost:3306/smart_parking\nTEST_DB_USERNAME=root\n# comment\nTEST_DB_PASSWORD=\"securePass\"\n");

        SmartParkApplication.loadDotenvFromPath(tempEnv);

        assertEquals("jdbc:mysql://localhost:3306/smart_parking", System.getProperty("TEST_DB_URL"));
        assertEquals("root", System.getProperty("TEST_DB_USERNAME"));
        assertEquals("securePass", System.getProperty("TEST_DB_PASSWORD"));

        Files.deleteIfExists(tempEnv);
    }
}
