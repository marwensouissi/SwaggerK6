package org.example.k6backend.Controllers;

import org.example.k6backend.Entities.Scenario;
import org.example.k6backend.Entities.User;
import org.example.k6backend.Services.AuthService;
import org.example.k6backend.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    @Autowired
    private UserService userService;


    @PostMapping("/login-test")
    public ResponseEntity<Map<String, String>> loginAndCreateUser(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");

        try {
            return authService.attemptLoginFromSwagger(username, password)
                    .map(token -> ResponseEntity.ok(Map.of("token", token)))
                    .orElseGet(() -> ResponseEntity.status(401).body(Map.of("error", "Login failed or token not found.")));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error reading swagger.json: " + e.getMessage()));
        }
    }
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(user); // password is ignored due to @JsonIgnore
    }
    @GetMapping("/me/scenarios")
    public ResponseEntity<List<Scenario>> getCurrentUserScenarios() {
        List<Scenario> scenarios = userService.getCurrentUserScenarios();
        return ResponseEntity.ok(scenarios);
    }

}




