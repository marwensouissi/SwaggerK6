# Use the official xk6 base image
FROM golang:1.23

# Install required dependencies
RUN apt-get update && apt-get install -y git wget curl unzip && \
    go install go.k6.io/xk6/cmd/xk6@latest

# Set working directory
WORKDIR /app

# Copy test scripts and dependencies
COPY . .

# Build K6 with MQTT & File plugins
RUN /go/bin/xk6 build v0.54.0 \
    --with github.com/pmalhaire/xk6-mqtt@latest \
    --with github.com/avitalique/xk6-file@latest \
    --output k6

# Set execute permissions
RUN chmod +x k6

# Set the default command to run K6 tests
ENTRYPOINT ["./k6", "run"]
