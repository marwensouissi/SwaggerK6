package org.example.k6backend.Services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.example.k6backend.Entities.Scenario;
import org.example.k6backend.Entities.User;
import org.example.k6backend.Repository.ScenarioRepository;
import org.example.k6backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.StandardOpenOption;
import java.util.Iterator;

@Service
public class ScenarioService {

    @Autowired
    private ScenarioRepository scenarioRepository;

    @Autowired
    private UserRepository userRepository;


    public boolean isSwaggerJsonPresentInRoot() {
        Path swaggerFilePath = Paths.get("swagger.json");
        System.out.println("Checking path: " + swaggerFilePath.toAbsolutePath());
        return Files.exists(swaggerFilePath);
    }


    public class SwaggerFileSaverService {

        public void saveSwaggerFile(MultipartFile file) throws IOException {
            if (file.isEmpty()) {
                throw new IllegalArgumentException("File is empty");
            }

            String filename = "swagger.json";

            // 1. Save to backend root directory (Spring Boot working directory)
            Path backendRootPath = Paths.get(filename);
            Files.write(backendRootPath, file.getBytes(),
                    StandardOpenOption.CREATE,
                    StandardOpenOption.TRUNCATE_EXISTING);

            // 2. Save to UI/dev-helpers/swagger.json (frontend folder inside backend root)
                Path uiDevHelpersPath = Paths.get("../UI/dev-helpers", filename);

            Path parentDir = uiDevHelpersPath.getParent();
            if (parentDir != null) {
                Files.createDirectories(parentDir);
            }
            Files.write(uiDevHelpersPath, file.getBytes(),
                    StandardOpenOption.CREATE,
                    StandardOpenOption.TRUNCATE_EXISTING);
            reduceSwaggerToRequiredOnlyInPlace();
        }


    }


    public void reduceSwaggerToRequiredOnlyInPlace() throws IOException {
        ObjectMapper mapper = new ObjectMapper();

        File swaggerFile = new File("../UI/dev-helpers/swagger.json");

        JsonNode root = mapper.readTree(swaggerFile);
        JsonNode schemas = root.path("components").path("schemas");
        if (schemas.isMissingNode() || !schemas.isObject()) {
            schemas = root.path("definitions"); // Fallback
            if (schemas.isMissingNode() || !schemas.isObject()) {
                System.err.println("❌ No components.schemas or definitions found in Swagger file.");
                return;
            }
        }

        Iterator<String> fieldNames = schemas.fieldNames();
        while (fieldNames.hasNext()) {
            String schemaName = fieldNames.next();
            JsonNode schemaNode = schemas.get(schemaName);

            if (!schemaNode.path("type").asText().equals("object")) {
                if (schemaNode.has("allOf") || schemaNode.has("oneOf")) {
                    System.out.println("⚠️  Skipping composed schema: " + schemaName);
                }
                continue;
            }

            JsonNode required = schemaNode.get("required");
            JsonNode properties = schemaNode.get("properties");

            if (required != null && required.isArray() && properties != null && properties.isObject()) {
                ObjectNode reducedProps = mapper.createObjectNode();

                for (JsonNode requiredField : required) {
                    String fieldName = requiredField.asText();
                    JsonNode propertyNode = properties.get(fieldName);
                    if (propertyNode != null) {
                        reducedProps.set(fieldName, propertyNode);
                    }
                }

                ((ObjectNode) schemaNode).set("properties", reducedProps);
            }
        }

        mapper.writerWithDefaultPrettyPrinter().writeValue(swaggerFile, root);
        System.out.println("✅ Modified swagger.json saved at: " + swaggerFile.getAbsolutePath());
    }



    public Scenario saveScenario(String jsonContent) {
        // Get the currently authenticated username
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // Find the user from DB
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new RuntimeException("Authenticated user not found");
        }

        // Create and save the scenario
        Scenario scenario = new Scenario();
        scenario.setContent(jsonContent);
        scenario.setUser(user);

        return scenarioRepository.save(scenario);
    }

    public String runPythonWithScenario(String jsonContent) {
        try {
            ProcessBuilder pb = new ProcessBuilder("python", "generate_test.py");
            pb.redirectErrorStream(true);
            Process process = pb.start();

            // Write jsonContent to stdin
            try (OutputStream os = process.getOutputStream()) {
                os.write(jsonContent.getBytes("UTF-8"));
                os.flush();
            }

            // Read output
            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), "UTF-8"))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }

            int exitCode = process.waitFor();
            if (exitCode == 0) {
                return output.toString().trim();
            } else {
                throw new RuntimeException("Python script failed with exit code " + exitCode + ": " + output.toString().trim());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error running Python script: " + e.getMessage(), e);
        }
    }
}



