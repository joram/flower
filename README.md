# 3D Flower in Pot

A Docker-based project that renders a realistic 3D turning flower in a pot using Three.js.

## Features

- Realistic 3D flower with petals, stem, leaves, and pot
- Smooth rotation animation
- Gentle swaying motion
- Modern WebGL rendering

## Running the Project

### Using Docker Compose (Recommended)

```bash
docker-compose up --build
```

Then open your browser to `http://localhost:8080`

### Using Docker

```bash
docker build -t 3d-flower .
docker run -p 8080:80 3d-flower
```

## Technologies

- Three.js (WebGL 3D library)
- Nginx (web server)
- Docker & Docker Compose

