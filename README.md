# Cloudflare Containers Starter

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/containers-template)

![Containers Template Preview](https://imagedelivery.net/_yJ02hpOMj_EnGvsU2aygw/5aba1fb7-b937-46fd-fa67-138221082200/public)

This is an optimized [Cloudflare Containers](https://developers.cloudflare.com/containers/) starter template featuring:

- **Minimal Docker image**: Multi-stage build with scratch base image (~2MB final size)
- **Security-focused**: Non-root user execution
- **Production-ready**: Optimized Go binary with health checks
- **Container orchestration**: Load balancing, error handling, and lifecycle management

## Architecture

- **Worker (`src/index.ts`)**: Routes requests and manages container instances
- **Container (`container_src/`)**: Lightweight Go web server with health endpoints
- **Configuration**: Optimized for minimal memory footprint and fast startup

## Available Endpoints

- `GET /` - Container response with environment info
- `GET /health` - Health check endpoint
- `GET /error` - Error handling demonstration
- `GET /container/:id/*` - Route to specific container instance
- `GET /lb` - Load balance across multiple containers

## Getting Started

Install dependencies:
```bash
npm install
```

Start development server:
```bash
npm run dev
```

Open [http://localhost:8787](http://localhost:8787) to see the result.

## Container Development

Edit the Go server in `container_src/main.go`. The Docker image is automatically built and deployed with your changes.

The container runs on port 8080 and includes:
- Health check endpoint (`/health`)
- Error simulation (`/error`)
- Environment variable support

## Deployment

Deploy to Cloudflare:
```bash
npm run deploy
```

## Performance Optimizations

- **Multi-stage Docker build** reduces image size by 95%
- **Scratch base image** eliminates unnecessary OS overhead
- **Static binary compilation** removes runtime dependencies
- **Non-root execution** enhances security
- **Efficient routing** minimizes request latency

## Learn More

- [Cloudflare Containers Documentation](https://developers.cloudflare.com/containers/)
- [Container Class Reference](https://github.com/cloudflare/containers)

Your feedback and contributions are welcome!
