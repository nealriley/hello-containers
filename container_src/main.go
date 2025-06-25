package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

// handler responds with a message and instance information
func handler(w http.ResponseWriter, r *http.Request) {
	message := os.Getenv("MESSAGE")
	if message == "" {
		message = "Hello from Cloudflare Container!"
	}
	
	instanceId := os.Getenv("CLOUDFLARE_DEPLOYMENT_ID")
	if instanceId == "" {
		instanceId = "local-development"
	}

	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	fmt.Fprintf(w, "Hi, I'm a container! Message: \"%s\" | Instance ID: %s\n", message, instanceId)
}

// errorHandler demonstrates error handling for containers
func errorHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Error endpoint called - simulating panic")
	panic("Simulated container error for testing")
}

// healthHandler provides a health check endpoint
func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	fmt.Fprint(w, "OK")
}

func main() {
	log.Println("Starting container server on :8080")
	
	http.HandleFunc("/", handler)
	http.HandleFunc("/health", healthHandler)
	http.HandleFunc("/error", errorHandler)
	
	log.Fatal(http.ListenAndServe(":8080", nil))
}
