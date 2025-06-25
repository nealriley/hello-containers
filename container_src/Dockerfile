# syntax=docker/dockerfile:1

##########################################################
# Lightweight Go web server for Cloudflare Containers  #
##########################################################

# Use multi-stage build for minimal image size
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Copy go mod files and download dependencies
COPY container_src/go.mod ./
COPY container_src/go.sum ./
RUN go mod download

# Copy source code
COPY container_src/main.go ./

# Build the application with optimizations for size
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags='-w -s -extldflags "-static"' \
    -a -installsuffix cgo \
    -o server .

# Final stage: minimal runtime image with distroless
FROM gcr.io/distroless/static-debian12:nonroot

# Copy the binary
COPY --from=builder /app/server /server

# Expose port
EXPOSE 8080

# Run the server as non-root user (distroless nonroot = uid 65532)
CMD ["/server"]