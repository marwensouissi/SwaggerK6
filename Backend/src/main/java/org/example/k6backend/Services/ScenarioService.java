package org.example.k6backend.Services;

import org.example.k6backend.Entities.Scenario;
import org.example.k6backend.Entities.User;
import org.example.k6backend.Repository.ScenarioRepository;
import org.example.k6backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class ScenarioService {

    @Autowired
    private ScenarioRepository scenarioRepository;

    @Autowired
    private UserRepository userRepository;

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
}
