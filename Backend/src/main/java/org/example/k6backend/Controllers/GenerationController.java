package org.example.k6backend.Controllers;

import org.example.k6backend.Services.ScriptGenerationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/k6")
public class GenerationController {

    @Autowired
    private ScriptGenerationService service;

    @PostMapping("/generate")
    public ResponseEntity<String> generate(@RequestBody String jsonInput) {
        try {
            String result = service.generateScript(jsonInput);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
