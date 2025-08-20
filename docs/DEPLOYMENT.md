# Deployment Guide

This guide covers different deployment options for the Modular Streaming Bridge.

## 🐳 Docker Deployment (Recommended)

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+

### Quick Start with Docker Compose

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ottes/ModularStreamingBridge.git
   cd ModularStreamingBridge
   ```

2. **Configure environment:**
   ```bash
   cp env.example .env
   nano .env  # Edit with your settings
   ```

3. **Start the service:**
   ```bash
   docker-compose up -d
   ```

4. **Check logs:**
   ```bash
   docker-compose logs -f
   ```

5. **Access the web interface:**
   Open `http://localhost:8080` in your browser

### Environment Configuration for Docker

Key settings for Docker deployment:

```env
# Server Configuration
PORT=8080
DEBUG_BRIDGE=0  # Set to 1 for debugging

# OBS WebSocket (adjust for Docker networking)
OBS_ADDR=ws://host.docker.internal:4455
OBS_PASS=your_obs_password

# n8n Configuration
N8N_INSTANCE=https://your-n8n.domain.com/
N8N_APITOKEN=your_api_token

# Chaturbate Configuration
CB_EVENTS_URL=https://eventsapi.chaturbate.com/events/your_broadcaster/
CB_N8N_EVENTS_WEHOOK=chaturbate-events
```

**Important Docker Networking Notes:**
- Use `host.docker.internal` to access services on the Docker host
- For OBS running on the same machine: `OBS_ADDR=ws://host.docker.internal:4455`
- For OBS on another machine: `OBS_ADDR=ws://obs-host-ip:4455`

### Custom Docker Build

Build your own image:
```bash
docker build -t modular-streaming-bridge .
```

### Production Docker Compose

For production, create a `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  modular-streaming-bridge:
    image: modular-streaming-bridge:latest
    ports:
      - "8080:8080"
    environment:
      - DEBUG_BRIDGE=0
      - OBS_ADDR=${OBS_ADDR}
      - OBS_PASS=${OBS_PASS}
      - N8N_INSTANCE=${N8N_INSTANCE}
      - N8N_APITOKEN=${N8N_APITOKEN}
      - CB_EVENTS_URL=${CB_EVENTS_URL}
      - CB_N8N_EVENTS_WEHOOK=${CB_N8N_EVENTS_WEHOOK}
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    networks:
      - streaming-bridge

networks:
  streaming-bridge:
    driver: bridge
```

## 🖥️ Manual Deployment

### Prerequisites

- Node.js 24+ (LTS recommended)
- npm 10+
- OBS Studio with WebSocket plugin

### Installation Steps

1. **Clone and setup:**
   ```bash
   git clone https://github.com/ottes/ModularStreamingBridge.git
   cd ModularStreamingBridge
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp env.example .env
   nano .env  # Edit configuration
   ```

3. **Start the service:**
   ```bash
   npm start
   ```

4. **For development:**
   ```bash
   npm run dev  # Uses nodemon for auto-restart
   ```

### Service Management (Linux)

Create a systemd service for production:

```ini
# /etc/systemd/system/streaming-bridge.service
[Unit]
Description=Modular Streaming Bridge
After=network.target

[Service]
Type=simple
User=streaming
WorkingDirectory=/opt/streaming-bridge
ExecStart=/usr/bin/node src/server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
EnvironmentFile=/opt/streaming-bridge/.env

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable streaming-bridge
sudo systemctl start streaming-bridge
sudo systemctl status streaming-bridge
```

## 🔧 OBS Studio Configuration

### WebSocket Server Setup

1. **Enable WebSocket Server:**
   - Open OBS Studio
   - Go to **Tools** → **WebSocket Server Settings**
   - Check **Enable WebSocket server**
   - Set **Server Port**: `4455`
   - Set **Server Password** (optional but recommended)

2. **Firewall Configuration:**
   ```bash
   # Allow OBS WebSocket port
   sudo ufw allow 4455/tcp
   ```

### Scene Naming Convention

The bridge expects specific scene naming patterns:
- Zoom scenes: `Main-{CameraName}-Zoom`
- Main scenes: `Main-{CameraName}`
- Camera sources: `Cam-{CameraName}`

Example:
- Scene: `Main-Cam1-Zoom`
- Source: `Cam-Cam1`

## 🌐 Network Configuration

### Firewall Rules

```bash
# Application port
sudo ufw allow 8080/tcp

# OBS WebSocket (if accessing remotely)
sudo ufw allow 4455/tcp
```

### Reverse Proxy Setup (nginx)

```nginx
server {
    listen 80;
    server_name streaming-bridge.yourdomain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📊 Monitoring

### Health Checks

Monitor service health:
```bash
curl -f http://localhost:8080/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "obs": true
}
```

### Log Monitoring

Docker logs:
```bash
docker-compose logs -f modular-streaming-bridge
```

Service logs (systemd):
```bash
journalctl -u streaming-bridge -f
```

## 🔒 Security Considerations

### Production Hardening

1. **Environment Variables:**
   - Never commit `.env` files
   - Use secrets management in production
   - Rotate API tokens regularly

2. **Network Security:**
   - Use HTTPS in production
   - Implement proper firewall rules
   - Consider VPN for OBS connections

3. **Authentication:**
   - Add authentication middleware
   - Implement API rate limiting
   - Monitor access logs

### Docker Security

```yaml
# Add security options to docker-compose.yml
security_opt:
  - no-new-privileges:true
read_only: true
tmpfs:
  - /tmp
user: 1000:1000
```

## 🚨 Troubleshooting

### Common Issues

**OBS Connection Failed:**
```bash
# Check OBS WebSocket settings
# Verify firewall rules
# Test connection manually
```

**Port Already in Use:**
```bash
# Find process using port 8080
sudo lsof -i :8080
# Kill process or change port
```

**Permission Denied:**
```bash
# Fix file permissions
sudo chown -R $USER:$USER /path/to/project
```

### Debug Mode

Enable detailed logging:
```env
DEBUG_BRIDGE=1
```

## 📋 Maintenance

### Updates

Docker deployment:
```bash
docker-compose pull
docker-compose up -d
```

Manual deployment:
```bash
git pull
npm install
sudo systemctl restart streaming-bridge
```

### Backup

Backup configuration:
```bash
cp .env .env.backup
# Backup any custom configurations
```