package org.example.k6backend.Controllers;

import org.example.k6backend.Services.ScriptGenerationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/k6")
public class GenerationController {

    @Autowired
    private ScriptGenerationService service;

    @PostMapping("/generate")
    public ResponseEntity<Map<String, String>> generate(@RequestBody String jsonInput) {
        try {
            String scriptContent = service.generateScript(jsonInput);

            // Also return the filename
            Map<String, String> response = new HashMap<>();
            response.put("filename", "generated_test_" + System.currentTimeMillis() + ".js");
            response.put("content", scriptContent);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    // POST /api/k6/run
    @PostMapping("/run")
    public ResponseEntity<String> runK6Test(@RequestBody K6RunRequest request) {
        try {
            // Call the instance method on the injected service
            String output = service.runTest(request.getFilename());
            return ResponseEntity.ok(output);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error running k6 test: " + e.getMessage());
        }
    }

    public static class K6RunRequest {
        private String filename;

        public String getFilename() {
            return filename;
        }

        public void setFilename(String filename) {
            this.filename = filename;
        }
    }
}





