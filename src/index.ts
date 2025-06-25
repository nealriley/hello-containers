import { Container, loadBalance, getContainer } from "@cloudflare/containers";
import { Hono } from "hono";

export class MyContainer extends Container {
  // Container configuration
  defaultPort = 8080;
  sleepAfter = "2m"; // Increased for better performance
  
  // Environment variables passed to the container
  envVars = {
    MESSAGE: "Optimized Cloudflare Container!",
  };

  // Lifecycle hooks for monitoring and debugging
  override onStart() {
    console.log("Container started successfully");
  }

  override onStop() {
    console.log("Container stopped gracefully");
  }

  override onError(error: unknown) {
    console.error("Container error:", error);
  }
}

// Hono app with proper Cloudflare Workers typing
const app = new Hono<{
  Bindings: { MY_CONTAINER: DurableObjectNamespace<MyContainer> };
}>();

// Root endpoint with API documentation
app.get("/", (c) => {
  return c.json({
    message: "Cloudflare Containers API",
    endpoints: {
      "/": "API documentation",
      "/container/:id": "Start container with specific ID",
      "/container/:id/*": "Proxy requests to container",
      "/lb": "Load balanced container requests",
      "/error": "Test error handling",
      "/singleton": "Single container instance"
    },
    status: "healthy"
  });
});

// Load balancer endpoint
app.get("/lb", async (c) => {
  const container = await loadBalance(c.env.MY_CONTAINER, 3); // Load balance across 3 containers
  return container.fetch(c.req.raw);
});

// Error handling demonstration
app.get("/error", async (c) => {
  const container = await getContainer(c.env.MY_CONTAINER, "error-test");
  return container.fetch(new Request("http://localhost/error"));
});

// Singleton container
app.get("/singleton", async (c) => {
  const container = await getContainer(c.env.MY_CONTAINER, "singleton");
  return container.fetch(c.req.raw);
});

// Dynamic container routing with path proxying
app.all("/container/:id/*", async (c) => {
  const { id } = c.req.param();
  
  // Extract the path after /container/<id>
  const basePath = `/container/${id}`;
  const targetPath = c.req.path.slice(basePath.length) || "/";
  
  // Get container instance by ID
  const stubId = c.env.MY_CONTAINER.idFromName(id);
  const stub = c.env.MY_CONTAINER.get(stubId);
  
  // Create new request with rewritten path
  const url = new URL(c.req.url);
  url.pathname = targetPath;
  const proxiedRequest = new Request(url.toString(), c.req.raw);
  
  return stub.fetch(proxiedRequest);
});

// Fallback for direct container access
app.all("/container/:id", async (c) => {
  const { id } = c.req.param();
  const stubId = c.env.MY_CONTAINER.idFromName(id);
  const stub = c.env.MY_CONTAINER.get(stubId);
  
  return stub.fetch(c.req.raw);
});

export default app;
