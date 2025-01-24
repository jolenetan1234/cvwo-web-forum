# Step 1: Use the official Golang image to build the app
FROM golang:1.23 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the Go modules manifests
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the Go app
# RUN go build -o main .

# Build the Go app statically
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o main .

# Step 2: Use a lightweight image to run the app
FROM debian:bullseye-slim

# Set the working directory in the final image
WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/main .
COPY .env /app/

# Set env variables
# ENV DB_DSN="host=localhost user=postgres password=password dbname=cvwo-web-forum port=5432"
# ENV JWT_SECRET=MYnSsI2ZUgRlVz3cbQmVojq7gjLHIJzH9D3LcxqoJR0
# ENV ALLOWED_CORS="http://localhost:3000,http://127.0.0.1:3000,http://0.0.0.0:3000"

# Expose the port your app runs on
EXPOSE 8080

# Command to run the binary
CMD ["./main"]
