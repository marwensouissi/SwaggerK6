package org.example.k6backend.Controllers;

import org.example.k6backend.Services.ScriptGenerationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.net.ServerSocket;
import java.nio.file.Files;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/k6")
public class GenerationController {

    @Autowired
    private ScriptGenerationService service;
    private final ExecutorService executor = Executors.newCachedThreadPool();


    @PostMapping("/generate")
    public ResponseEntity<Map<String, String>> generate(@RequestBody String jsonInput) {
        try {
            Map<String, String> result = service.generateScript(jsonInput);
            return ResponseEntity.ok(result);
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

    @GetMapping(value = "/run/stream/{filename}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamK6Output(@PathVariable String filename) {
        SseEmitter emitter = new SseEmitter(0L); // Never timeout
        Path filePath = Paths.get("generated").resolve(filename);

        if (!Files.exists(filePath)) {
            emitter.completeWithError(new IllegalArgumentException("File not found: " + filename));
            return emitter;
        }

        executor.execute(() -> {
            Process process = null;
            boolean emitterClosed = false;

            try {
                int dashboardPort = findFreePort();

                ProcessBuilder pb = new ProcessBuilder("k6", "run", filePath.toString());
                pb.environment().put("K6_WEB_DASHBOARD", "true");
                pb.environment().put("K6_WEB_DASHBOARD_PORT", String.valueOf(dashboardPort));
                pb.redirectErrorStream(true);

                emitter.send(SseEmitter.event().data("DASHBOARD_PORT:" + dashboardPort));

                process = pb.start();

                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        if (emitterClosed) break;
                        emitter.send(SseEmitter.event().data(line));
                    }
                }

                System.out.println("Waiting for process to finish...");
                int exitCode = process.waitFor();
                System.out.println("Process finished with exit code: " + exitCode);

                if (!emitterClosed) {
                    emitter.send(SseEmitter.event().data("k6 test finished with exit code: " + exitCode));
                    emitter.complete();
                }

            } catch (Exception e) {
                if (!emitterClosed) {
                    try {
                        emitter.send(SseEmitter.event().data("Error: " + e.getMessage()));
                    } catch (Exception ignored) {}
                    emitter.completeWithError(e);
                }
            } finally {
                if (process != null && process.isAlive()) {
                    System.out.println("Destroying k6 process due to emitter close.");
                    process.destroy();
                }
            }
        });


        return emitter;
    }

    // Helper method to find a free local port
    private int findFreePort() throws IOException {
        try (ServerSocket socket = new ServerSocket(0)) {
            socket.setReuseAddress(true);
            return socket.getLocalPort();
        }
    }

    }



//    @GetMapping(value = "/run/stream/{filename}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
//    public SseEmitter streamK6Output(@PathVariable String filename) {
//        SseEmitter emitter = new SseEmitter();
//        Path filePath = Paths.get("generated").resolve(filename);
//
//        if (!filePath.toFile().exists()) {
//            emitter.completeWithError(new IllegalArgumentException("File not found: " + filename));
//            return emitter;
//        }
//
//        executor.execute(() -> {
//            try {
//                // Set up environment variable for K6 web dashboard
//                ProcessBuilder pb = new ProcessBuilder("k6", "run", filePath.toString());
//                pb.environment().put("K6_WEB_DASHBOARD", "true");
//                pb.redirectErrorStream(true);
//
//                Process process = pb.start();
//
//                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
//                    String line;
//                    while ((line = reader.readLine()) != null) {
//                        emitter.send(SseEmitter.event().data(line));
//                    }
//                }
//
//                int exitCode = process.waitFor();
//                emitter.send("k6 test finished with exit code: " + exitCode);
//                emitter.complete();
//            } catch (Exception e) {
//                try {
//                    emitter.send("Error: " + e.getMessage());
//                } catch (Exception ex) {
//                    ex.printStackTrace();
//                }
//                emitter.completeWithError(e);
//            }
//        });
//
//        return emitter;
//    }








