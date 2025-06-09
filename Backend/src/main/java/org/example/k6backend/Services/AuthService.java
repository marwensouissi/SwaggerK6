package org.example.k6backend.Services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.k6backend.Entities.User;
import org.example.k6backend.Repository.UserRepository;
import org.example.k6backend.Security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.IOException;
import java.util.*;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private File getSwaggerFile() {
        return new File("swagger.json"); // Make sure this is placed at the project root
    }

    public List<Endpoint> extractEndpointsFromSwagger() throws IOException {
        JsonNode rootNode = objectMapper.readTree(getSwaggerFile());
        JsonNode pathsNode = rootNode.path("paths");

        List<Endpoint> loginEndpoints = new ArrayList<>();

        for (Iterator<String> it = pathsNode.fieldNames(); it.hasNext(); ) {
            String path = it.next();
            JsonNode pathItem = pathsNode.get(path);

            for (String method : List.of("post", "get")) {
                JsonNode operation = pathItem.get(method);
                if (operation == null) continue;

                String summary = operation.path("summary").asText("").toLowerCase();
                String operationId = operation.path("operationId").asText("").toLowerCase();

                if (path.contains("login") || path.contains("auth") || summary.contains("login") || operationId.contains("login")) {
                    loginEndpoints.add(new Endpoint(path, method));
                }
            }
        }

        return loginEndpoints;
    }

    public Optional<String> attemptLoginFromSwagger(String username, String password) throws IOException {
        List<Endpoint> endpoints = extractEndpointsFromSwagger();
        JsonNode swaggerRoot = objectMapper.readTree(getSwaggerFile());

        String baseUrl = swaggerRoot.path("servers").get(0).path("url").asText();
        if (baseUrl == null || baseUrl.isBlank()) return Optional.empty();

        for (Endpoint endpoint : endpoints) {
            String fullUrl = baseUrl + endpoint.path();

            try {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                Map<String, String> payload = Map.of(
                        "username", username,
                        "password", password
                );

                HttpEntity<Map<String, String>> request = new HttpEntity<>(payload, headers);

                ResponseEntity<String> response = new RestTemplate().exchange(
                        fullUrl,
                        HttpMethod.valueOf(endpoint.method().toUpperCase()),
                        request,
                        String.class
                );

                if (response.getStatusCode().is2xxSuccessful()) {
                    JsonNode body = objectMapper.readTree(response.getBody());

                    for (String key : List.of("token", "access_token", "jwt")) {
                        if (body.has(key)) {
                            String externalToken = body.get(key).asText();

                            // Check if user exists, else create
                            User existingUser = userRepository.findByUsername(username);
                            if (existingUser == null) {
                                User user = new User();
                                user.setUsername(username);
                                user.setPassword(password);
                                userRepository.save(user);
                            }

                            // Generate our own JWT
                            String internalJwt = jwtUtils.generateToken(username);
                            return Optional.of(internalJwt);
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("Failed to test " + endpoint.method().toUpperCase() + " " + endpoint.path() + ": " + e.getMessage());
            }
        }

        return Optional.empty();
    }

    public record Endpoint(String path, String method) {}
}
