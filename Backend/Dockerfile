# Use official Golang image to build the app
FROM golang:1.24 AS builder

# Set environment variables
ENV GO111MODULE=on \
    CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

# Set working directory for the Go build
WORKDIR /app

# Copy Go modules and install dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code into the working directory
COPY . .

# Build the Go binary
RUN go build -o gradehub cmd/main.go

# Use a smaller base image for production
FROM alpine:latest

# Set working directory
WORKDIR /root/

# Copy the built Go binary from the builder stage
COPY --from=builder /app/gradehub .

# Expose the backend port
EXPOSE 8080

# Run the backend binary
CMD ["./gradehub"]
