# Stage 1: Build k6 with xk6-mqtt and xk6-file
FROM golang:1.20 AS builder

# Install xk6
RUN go install go.k6.io/xk6/cmd/xk6@v0.54.0

# Build custom k6 binary with both MQTT and file extensions
RUN xk6 build v0.54.0 \
    --with github.com/pmalhaire/xk6-mqtt@latest \
    --with github.com/avitalique/xk6-file@latest \
    --output /k6

# Stage 2: Use official k6 base image
FROM grafana/k6:latest

# Replace the default k6 binary with our custom one
COPY --from=builder /k6 /usr/bin/k6
