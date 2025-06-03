package org.example.k6backend.Services;

import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ScriptGenerationService {

    public String generateScript(String jsonInput) throws IOException, InterruptedException {
        // Write JSON to a temp file
        Path tempJsonFile = Files.createTempFile("k6_input", ".json");
        Files.writeString(tempJsonFile, jsonInput);

        String projectPath = new File(".").getCanonicalPath();
        String pythonScriptDir = projectPath + "/src/main/resources/python";
        String scriptPath = pythonScriptDir + "/generate_k6_script.py";
        String outputFilePath = projectPath + "/generated_test.js";

        // venv Python interpreter path (adjust if needed)
        String venvPython = projectPath + "/venv/Scripts/python.exe"; // Windows
        if (!new File(venvPython).exists()) {
            throw new RuntimeException("Python venv not found at: " + venvPython);
        }

        // Build command
        ProcessBuilder pb = new ProcessBuilder(
                venvPython, scriptPath,
                tempJsonFile.toString(),
                pythonScriptDir,
                outputFilePath
        );

        pb.redirectErrorStream(true);
        Process process = pb.start();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            reader.lines().forEach(System.out::println);
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new RuntimeException("Python script failed");
        }

        return Files.readString(Paths.get(outputFilePath));
    }
}
