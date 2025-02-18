# ================================
# 🔹 Stage 1: Build K6 with Plugins
# ================================
FROM golang:1.23 AS builder

# Install required dependencies
RUN apt-get update && apt-get install -y git wget curl unzip && \
    go install go.k6.io/xk6/cmd/xk6@latest

# Set working directory
WORKDIR /build

# Copy Go modules first (for caching)
COPY go.mod go.sum ./
RUN go mod download

# Copy the entire source code (including test scripts)
COPY . .

# Build K6 with MQTT & File plugins
RUN /go/bin/xk6 build v0.54.0 \
    --with github.com/pmalhaire/xk6-mqtt@latest \
    --with github.com/avitalique/xk6-file@latest \
    --output k6

# ================================
# 🔹 Stage 2: Create a Minimal Runtime Image
# ================================
FROM debian:bullseye

# Set working directory
WORKDIR /app

# Copy only the built K6 binary from the builder stage
COPY --from=builder /build/k6 /usr/local/bin/k6

# Copy the test scripts
COPY final/ /app/final/

# Set execute permissions
RUN chmod +x /usr/local/bin/k6

# Default entrypoint to run K6 tests
ENTRYPOINT ["k6", "run"]
