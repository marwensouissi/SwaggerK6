package org.example.k6backend.Controllers;

import org.example.k6backend.Services.ScenarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/swagger")
public class SwaggerController {

    @Autowired
    private ScenarioService scenarioService;

    // Endpoint to check if swagger.json is in root
    @GetMapping("/exists")
    public ResponseEntity<Boolean> checkIfSwaggerJsonExists() {
        boolean exists = scenarioService.isSwaggerJsonPresentInRoot();
        return ResponseEntity.ok(exists);
    }

    // Endpoint to upload and save swagger.json
    @PostMapping("/upload")
    public ResponseEntity<String> uploadSwaggerJson(@RequestParam("file") MultipartFile file) {
        ScenarioService.SwaggerFileSaverService fileSaverService = scenarioService.new SwaggerFileSaverService();
        try {
            fileSaverService.saveSwaggerFile(file);
            return ResponseEntity.ok("swagger.json uploaded and saved successfully.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving file: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}