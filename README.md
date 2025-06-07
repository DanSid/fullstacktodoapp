<p align="center">
    <img src="https://user-images.githubusercontent.com/62269745/174906065-7bb63e14-879a-4740-849c-0821697aeec2.png#gh-light-mode-only" width="40%">
    <img src="https://user-images.githubusercontent.com/62269745/174906068-aad23112-20fe-4ec8-877f-3ee1d9ec0a69.png#gh-dark-mode-only" width="40%">
</p>

# Fullstack Todo List - Containerized Application

A 3-tier containerized todo application with React frontend, Node.js backend, and MongoDB database.

## Architecture

- **Frontend**: React + Vite (Port 80)
- **Backend**: Node.js + Express (Port 3000)  
- **Database**: MongoDB (Port 27017)

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd fullstack-todo-list
   ```

2. **Build and start containers**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:3000
   - Database: localhost:27017

## Detailed Setup Instructions

### 1. Environment Configuration

Copy the environment file:
```bash
cp .env.example .env
```

Modify `.env` if needed:
```env
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=securePassword123!
MONGO_DATABASE=todos
NODE_ENV=production
BACKEND_PORT=3000
```

### 2. Build Services

Build all containers:
```bash
docker-compose build
```

Build specific service:
```bash
docker-compose build frontend
docker-compose build backend
docker-compose build database
```

### 3. Start Services

Start all services:
```bash
docker-compose up -d
```

Start specific service:
```bash
docker-compose up -d database
docker-compose up -d backend
docker-compose up -d frontend
```

### 4. Monitor Services

Check status:
```bash
docker-compose ps
```

View logs:
```bash
docker-compose logs -f
docker-compose logs -f backend
```

## Network and Security Configuration

### Network Setup
- **Custom Bridge Network**: `todo-network` (172.20.0.0/16)
- **Service Discovery**: Services communicate using container names
- **Port Mapping**: Only necessary ports exposed to host

### Security Features
- **Non-root users** in all containers
- **Environment variables** for sensitive data
- **Network isolation** between services
- **Health checks** for all services
- **Security headers** in Nginx
- **Input validation** in backend API

### Exposed Ports
- `80`: Frontend (Nginx)
- `3000`: Backend API
- `27017`: MongoDB (development only)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/todos` | Get todos (with pagination) |
| POST | `/api/todos` | Create todo |
| PUT | `/api/todos/:id` | Update todo |
| DELETE | `/api/todos/:id` | Delete todo |

## Container Testing

### Health Checks
```bash
# Check all services health
docker-compose ps

# Individual health checks
docker exec todo-backend curl -f http://localhost:3000/health
docker exec todo-frontend curl -f http://localhost:80
docker exec todo-database mongosh --eval "db.adminCommand('ping')"
```

### API Testing
```bash
# Test backend directly
curl http://localhost:3000/health

# Test through frontend proxy
curl http://localhost/api/todos

# Create a todo
curl -X POST http://localhost/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Todo","description":"Testing API"}'

# Get todos
curl http://localhost/api/todos
```

### Database Testing
```bash
# Connect to MongoDB
docker exec -it todo-database mongosh -u admin -p securePassword123!

# In MongoDB shell:
use todos
db.todos.find()
```

## Troubleshooting

### Common Issues

**1. Port Already in Use**
```bash
# Check what's using the port
lsof -i :80
lsof -i :3000
lsof -i :27017

# Stop conflicting services
sudo systemctl stop nginx
sudo systemctl stop apache2
```

**2. Database Connection Failed**
```bash
# Check database logs
docker-compose logs database

# Restart database
docker-compose restart database

# Check network connectivity
docker exec todo-backend ping database
```

**3. Frontend Can't Reach Backend**
```bash
# Check backend logs
docker-compose logs backend

# Test backend health
docker exec todo-backend curl http://localhost:3000/health

# Check network
docker network ls
docker network inspect fullstack-todo-list_todo-network
```

**4. Permission Denied Errors**
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
chmod -R 755 .
```

**5. Build Failures**
```bash
# Clean build cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Logs and Debugging

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database

# Execute commands in containers
docker exec -it todo-backend sh
docker exec -it todo-frontend sh
docker exec -it todo-database mongosh
```

### Performance Monitoring

```bash
# Container resource usage
docker stats

# Specific container stats
docker stats todo-backend todo-frontend todo-database
```

## Management Commands

### Start/Stop Services
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart services
docker-compose restart

# Stop and remove everything (including volumes)
docker-compose down -v
```

### Updates and Maintenance
```bash
# Pull latest images
docker-compose pull

# Rebuild and restart
docker-compose up -d --build

# View container sizes
docker images
```

### Backup and Restore
```bash
# Backup database
docker exec todo-database mongodump --out /backup

# Copy backup from container
docker cp todo-database:/backup ./mongodb-backup

# Restore database
docker exec -i todo-database mongorestore /backup
```

## Development vs Production

### Development Mode
```bash
# Use development compose file
docker-compose -f docker-compose.dev.yml up -d
```

### Production Mode
```bash
# Use production settings
NODE_ENV=production docker-compose up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Test with Docker
5. Submit pull request

## License

MIT License
```

### Container Testing Script
```bash:fullstack-todo-list/test-containers.sh
#!/bin/bash

echo " Testing Containerized Todo Application"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_pattern="$3"
    
    echo -n "Testing $test_name... "
    
    if result=$(eval "$test_command" 2>&1); then
        if [[ -z "$expected_pattern" ]] || echo "$result" | grep -q "$expected_pattern"; then
            echo -e "${GREEN}✓ PASSED${NC}"
            ((TESTS_PASSED++))
            return 0
        else
            echo -e "${RED}✗ FAILED${NC}"
            echo "  Expected pattern: $expected_pattern"
            echo "  Got: $result"
            ((TESTS_FAILED++))
            return 1
        fi
    else
        echo -e "${RED}✗ FAILED${NC}"
        echo "  Command failed: $result"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Wait for services to be ready
echo " Waiting for services to start..."
sleep 10

echo -e "\n Container Status Tests"
echo "------------------------"

# Test 1: Check if containers are running
run_test "Database container" "docker-compose ps database | grep 'Up'" "Up"
run_test "Backend container" "docker-compose ps backend | grep 'Up'" "Up"  
run_test "Frontend container" "docker-compose ps frontend | grep 'Up'" "Up"

echo -e "\n Health Check Tests"
echo "--------------------"

# Test 2: Health checks
run_test "Database health" "docker exec todo-database mongosh --eval 'db.adminCommand(\"ping\")' --quiet" "ok.*1"
run_test "Backend health" "curl -s http://localhost:3000/health" "OK"
run_test "Frontend accessibility" "curl -s -o /dev/null -w '%{http_code}' http://localhost" "200"

echo -e "\n🔌 API Endpoint Tests"
echo "--------------------"

# Test 3: API endpoints
run_test "GET /api/todos" "curl -s http://localhost/api/todos" "todos"
run_test "Backend root endpoint" "curl -s http://localhost:3000/" "Todo API Server"

# Test 4: Create a todo
echo -n "Testing POST /api/todos... "
if todo_response=$(curl -s -X POST http://localhost/api/todos \
    -H "Content-Type: application/json" \
    -d '{"title":"Test Todo","description":"Container test"}' 2>&1); then
    
    if echo "$todo_response" | grep -q "todo"; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((TESTS_PASSED++))
        
        # Extract todo ID for further tests
        TODO_ID=$(echo "$todo_response" | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
        
        if [[ -n "$TODO_ID" ]]; then
            # Test 5: Update todo
            run_test "PUT /api/todos/$TODO_ID" \
                "curl -s -X PUT http://localhost/api/todos/$TODO_ID -H 'Content-Type: application/json' -d '{\"isCompleted\":true}'" \
                "todo"
            
            # Test 6: Delete todo
            run_test "DELETE /api/todos/$TODO_ID" \
                "curl -s -X DELETE http://localhost/api/todos/$TODO_ID" \
                "deleted successfully"
        fi
    else
        echo -e "${RED}✗ FAILED${NC}"
        echo "  Response: $todo_response"
        ((TESTS_FAILED++))
    fi
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "  Error: $todo_response"
    ((TESTS_FAILED++))
fi

echo -e "\n Network Connectivity Tests"
echo "-----------------------------"

# Test 7: Inter-container communication
run_test "Backend to Database" "docker exec todo-backend ping -c 1 database" "1 packets transmitted, 1 received"
run_test "Frontend to Backend" "docker exec todo-frontend wget -q --spider http://backend:3000/health" ""

echo -e "\n Database Tests"
echo "----------------"

# Test 8: Database operations
run_test "Database connection" "docker exec todo-database mongosh --eval 'db.runCommand({ping: 1})' --quiet" "ok.*1"
run_test "Database collections" "docker exec todo-database mongosh todos --eval 'db.getCollectionNames()' --quiet" "todos"

echo -e "\n Performance Tests"
echo "-------------------"

# Test 9: Response time tests
echo -n "Testing response time... "
if response_time=$(curl -s -o /dev/null -w '%{time_total}' http://localhost/api/todos); then
    if (( $(echo "$response_time < 2.0" | bc -l) )); then
        echo -e "${GREEN}✓ PASSED${NC} (${response_time}s)"
        ((TESTS_PASSED++))
    else
        echo -e "${YELLOW}⚠ SLOW${NC} (${response_time}s)"
        ((TESTS_PASSED++))
    fi
else
    echo -e "${RED}✗ FAILED${NC}"
    ((TESTS_FAILED++))
fi

echo -e "\n Security Tests"
echo "----------------"

# Test 10: Security headers
run_test "Security headers" "curl -s -I http://localhost" "X-Frame-Options"
run_test "CORS headers" "curl -s -I http://localhost/api/todos" "Access-Control-Allow"

echo -e "\n Summary"
echo "==========="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"

if [[ $TESTS_FAILED -eq 0 ]]; then
    echo -e "\n ${GREEN}All tests passed! Application is ready for deployment.${NC}"
    exit 0
else
    echo -e "\n ${RED}Some tests failed. Please check the issues above.${NC}"
    exit 1
fi
```

Make the script executable:
```bash
chmod +x test-containers.sh
```

## Step 3: Clean Up and Test

```bash
docker-compose down
```

```bash
docker-compose up -d
```

```bash
./test-containers.sh
```

## Step 4: Push to GitHub

### Create .gitignore
```gitignore:fullstack-todo-list/.gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
dist/
build/

# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local

# Docker
.docker/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
```

### Git Commands
```bash
git add .
```

```bash
git commit -m "feat: containerize 3-tier todo application

- Add Dockerfiles for frontend, backend, and database
- Add docker-compose.yml for orchestration
- Add comprehensive documentation and testing
- Configure networking and security settings
- Add health checks and monitoring"
```

```bash
git push origin main
