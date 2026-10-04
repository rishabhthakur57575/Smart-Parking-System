package com.smartpark;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@SpringBootApplication
public class SmartParkApplication {

    public static void main(String[] args) {
        loadDotenv();
        SpringApplication.run(SmartParkApplication.class, args);
    }

    /**
     * Loads local environment variables from .env file during development
     * without exposing or logging sensitive values.
     */
    public static void loadDotenv() {
        Path[] candidatePaths = {
            Paths.get(".env"),
            Paths.get("backend", ".env"),
            Paths.get("..", ".env"),
            Paths.get("..", "backend", ".env")
        };

        for (Path path : candidatePaths) {
            if (Files.exists(path) && !Files.isDirectory(path)) {
                loadDotenvFromPath(path);
                System.out.println("Loaded environment variables from local .env configuration.");
                break;
            }
        }
    }

    public static void loadDotenvFromPath(Path path) {
        if (!Files.exists(path) || Files.isDirectory(path)) {
            return;
        }
        try (BufferedReader reader = Files.newBufferedReader(path)) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty() || line.startsWith("#")) {
                    continue;
                }
                int eqIdx = line.indexOf('=');
                if (eqIdx > 0) {
                    String key = line.substring(0, eqIdx).trim();
                    String value = line.substring(eqIdx + 1).trim();
                    if ((value.startsWith("\"") && value.endsWith("\"")) ||
                        (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.substring(1, value.length() - 1);
                    }
                    if (System.getProperty(key) == null && System.getenv(key) == null) {
                        System.setProperty(key, value);
                    }
                }
            }
        } catch (IOException e) {
            System.err.println("Warning: Could not read .env from " + path.toAbsolutePath());
        }
    }
}
