# Docker Setup Documentation

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git
- 4GB+ available RAM
- Ports 80, 3000, and 27017 available

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/icnoka/fullstack-todo-list
cd fullstack-todo-list
```

### 2. Build and Start Services
```bash
# Build all images and start services
docker-compose up --build -d

# View logs
docker-compose logs -f
```

### 3. Verify Installation
```bash
# Make the test script executable
chmod +x test-containers.sh

# Run tests
./test-containers.sh
```

### 4. Access the Application
- Frontend: http://localhost:80
- Backend API: http://localhost:3000
- Database: localhost:27017

## Network and Security Configurations

### Network Architecture
- **Custom Bridge Network**: `todo-network` (172.20.0.0/16)
- **Service Discovery**: Containers communicate using service names
- **Port Mapping**: Only necessary ports exposed to host

### Security Features
- **Non-root User**: Backend runs as non-privileged user
- **Environment Variables**: Sensitive data stored in .env files
- **Network Isolation**: Services isolated in custom network
- **Health Checks**: All services have health monitoring

### Exposed Ports
- **80**: Frontend (Nginx)
- **3000**: Backend API
- **27017**: MongoDB (for external tools)

## Troubleshooting Guide

### Common Issues

#### Services Won't Start
```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs [service-name]

# Restart services
docker-compose restart
```

#### Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :80
netstat -tulpn | grep :3000
netstat -tulpn | grep :27017

# Stop conflicting services or change ports in docker-compose.yml
```

#### Database Connection Issues
```bash
# Check database logs
docker-compose logs database

# Test database connection
docker exec -it todo-database mongosh

# Reset database
docker-compose down -v
docker-compose up --build -d
```

#### Frontend Can't Reach Backend
```bash
# Check network connectivity
docker exec todo-frontend ping backend

# Verify proxy configuration
docker exec todo-frontend cat /etc/nginx/conf.d/default.conf
```

### Performance Issues
```bash
# Monitor resource usage
docker stats

# Check available disk space
docker system df

# Clean up unused resources
docker system prune -a
```

## Management Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f [service-name]
```

### Rebuild Services
```bash
docker-compose up --build -d
```

### Clean Reset
```bash
docker-compose down -v --remove-orphans
docker system prune -a
docker-compose up --build -d
```
```

## Step 8: Build and Test

```bash
chmod +x test-containers.sh
```

```bash
docker-compose up --build -d
```

```bash
./test-containers.sh
```

## Step 9: Create Submission Package

```bash
mkdir todo-app-containerization
```

```bash
cp -r fullstack-todo-list/* todo-app-containerization/
```

```bash
cd todo-app-containerization && tar -czf ../todo-app-submission.tar.gz .
