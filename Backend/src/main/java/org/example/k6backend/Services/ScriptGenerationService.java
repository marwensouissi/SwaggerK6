package org.example.k6backend.Services;

import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@Service
public class ScriptGenerationService {

    public Map<String, String> generateScript(String jsonInput) throws IOException, InterruptedException {
        // Write JSON to a temp file
        Path tempJsonFile = Files.createTempFile("k6_input", ".json");
        Files.writeString(tempJsonFile, jsonInput);

        // Get project root path
        String projectPath = new File(".").getCanonicalPath();

        // Use Path for platform-independent paths
        Path pythonScriptDir = Paths.get(projectPath, "src", "main", "resources", "python");
        Path scriptPath = pythonScriptDir.resolve("generate_k6_script.py");

        // Ensure /generated directory exists
        Path generatedDir = Paths.get(projectPath, "generated");
        if (!Files.exists(generatedDir)) {
            Files.createDirectories(generatedDir);
        }

        // Generate unique filename
        String uniqueFilename = "generated_test_" + System.currentTimeMillis() + ".js";
        Path outputFilePath = generatedDir.resolve(uniqueFilename);

        // Determine OS
        String osName = System.getProperty("os.name").toLowerCase();
        boolean isWindows = osName.contains("win");

        // Set venv Python path based on OS
        Path venvPython;
        if (isWindows) {
            venvPython = Paths.get(projectPath, "venv", "Scripts", "python.exe");
        } else {
            venvPython = Paths.get(projectPath, "venv", "bin", "python");
        }

        if (!Files.exists(venvPython)) {
            throw new RuntimeException("Python venv not found at: " + venvPython);
        }

        // Build command
        ProcessBuilder pb = new ProcessBuilder(
                venvPython.toString(),
                scriptPath.toString(),
                tempJsonFile.toString(),
                pythonScriptDir.toString(),
                outputFilePath.toString()
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

        String scriptContent = Files.readString(outputFilePath);

        Map<String, String> result = new HashMap<>();
        result.put("filename", uniqueFilename);
        result.put("content", scriptContent);
        return result;
    }


    private static final Path GENERATED_DIR = Paths.get("generated");

    public String runTest(String filename) throws IOException, InterruptedException {
        Path filePath = GENERATED_DIR.resolve(filename);

        if (!Files.exists(filePath)) {
            throw new IOException("Test file not found: " + filePath);
        }

        // Run k6 command: `k6 run <file>`
        ProcessBuilder pb = new ProcessBuilder("k6", "run", filePath.toString());
        pb.redirectErrorStream(true);

        Process process = pb.start();

        StringBuilder output = new StringBuilder();
        try (var reader = new java.io.BufferedReader(new java.io.InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append(System.lineSeparator());
            }
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new RuntimeException("k6 test failed with exit code " + exitCode);
        }

        return output.toString();
    }

}
