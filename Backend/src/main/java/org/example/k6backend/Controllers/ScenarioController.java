package org.example.k6backend.Controllers;

import org.example.k6backend.Entities.Scenario;
import org.example.k6backend.Services.ScenarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/scenarios")
public class ScenarioController {

    @Autowired
    private ScenarioService scenarioService;

    @PostMapping
    public ResponseEntity<Scenario> createScenario(@RequestBody String rawJson) {
        Scenario saved = scenarioService.saveScenario(rawJson);
        return ResponseEntity.ok(saved);
    }
}
