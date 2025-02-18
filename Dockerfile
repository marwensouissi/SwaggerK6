# Use multi-stage build for efficiency
FROM golang:1.23 AS builder

# Install dependencies
RUN go install go.k6.io/xk6/cmd/xk6@latest

WORKDIR /build

# Remove COPY go.mod and go.sum if they're not needed
# COPY go.mod go.sum ./  

# Copy the entire source code
COPY . .

# Build xK6 with MQTT & File plugins
RUN /go/bin/xk6 build v0.54.0 \
    --with github.com/pmalhaire/xk6-mqtt@latest \
    --with github.com/avitalique/xk6-file@latest \
    --output k6

# Final image
FROM alpine:latest
WORKDIR /app
COPY --from=builder /build/k6 /app/k6
RUN chmod +x /app/k6

ENTRYPOINT ["/app/k6", "run"]
