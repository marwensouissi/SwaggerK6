package org.example.k6backend.Controllers;

import org.example.k6backend.Entities.Scenario;
import org.example.k6backend.Services.ScenarioService;
import org.example.k6backend.Services.ScriptGenerationService ;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/scenarios")
public class ScenarioController {

    @Autowired
    private ScenarioService scenarioService;

    @Autowired
    private ScriptGenerationService scriptGenerationService;


    @PostMapping
    public ResponseEntity<Scenario> createScenario(@RequestBody String rawJson) throws IOException, InterruptedException {
        Scenario saved = scenarioService.saveScenario(rawJson);
        System.out.println(saved);
//        scriptGenerationService.runPythonWithScenario(rawJson);

        return ResponseEntity.ok(saved);


    }
}
