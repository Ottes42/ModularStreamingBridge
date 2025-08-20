# Modular Streaming Bridge

[![Node.js](https://img.shields.io/badge/Node.js-24+-green.svg)](https://nodejs.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A Node.js REST API bridge that connects streaming platforms with OBS Studio and n8n automation workflows. This service handles real-time event polling, webhook forwarding, and OBS WebSocket communication for automated streaming setups.

## ✨ Features

- 🎥 **OBS Studio Integration**: WebSocket control for scenes, sources, and camera operations
- 🔗 **Streaming Platform Support**: Real-time event polling from Chaturbate
- ⚡ **n8n Automation**: Forward events to n8n workflows for automated responses
- 🎛️ **Web Interface**: Control panel for OBS camera positioning and zoom
- 🔄 **Real-time Processing**: Long-polling with automatic reconnection
- 🐳 **Docker Ready**: Containerized deployment with Docker Compose
- 📊 **Health Monitoring**: Built-in health checks and service status

## 📋 Prerequisites

- **Node.js** 24+ (LTS recommended)
- **OBS Studio** with WebSocket plugin enabled (port 4455)
- **n8n instance** (optional, for automation workflows)
- **Streaming platform credentials** (optional, for event polling)

## 🚀 Quick Start

### Using Docker Compose (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/ottes/ModularStreamingBridge.git
   cd ModularStreamingBridge
   ```

2. Create environment file:
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. Start the service:
   ```bash
   docker-compose up -d
   ```

4. Access the web interface at `http://localhost:8080`

### Manual Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   ```bash
   cp env.example .env
   # Edit .env with your settings
   ```

3. Start the service:
   ```bash
   npm start
   ```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `8080` | No |
| `DEBUG_BRIDGE` | Enable debug logging | `0` | No |
| **OBS Configuration** |
| `OBS_ADDR` | OBS WebSocket address | `ws://localhost:4455` | No |
| `OBS_PASS` | OBS WebSocket password | - | If OBS has password |
| **n8n Configuration** |
| `N8N_INSTANCE` | n8n instance URL | - | For automation |
| `N8N_APITOKEN` | n8n API token | - | For automation |
| **Chaturbate Configuration** |
| `CB_EVENTS_URL` | Chaturbate events API URL | - | For event polling |
| `CB_STATS_URL` | Chaturbate stats API URL | - | For stats |
| `CB_N8N_EVENTS_WEHOOK` | n8n webhook path for events | - | For event forwarding |

### Example Configuration

```env
# Server
PORT=8080
DEBUG_BRIDGE=1

# OBS
OBS_ADDR=ws://localhost:4455
OBS_PASS=your_obs_password

# n8n
N8N_INSTANCE=https://your-n8n.domain.com/
N8N_APITOKEN=your_api_token

# Chaturbate
CB_EVENTS_URL=https://eventsapi.chaturbate.com/events/your_broadcaster/
CB_N8N_EVENTS_WEHOOK=chaturbate-events
```

## 📖 API Documentation

### Health Check
```http
GET /health
```
Returns service status and component health.

### OBS Control
```http
POST /obs
Content-Type: application/json

{
  "requestType": "GetSceneList",
  "requestData": {}
}
```

#### Camera Zoom Control
```http
POST /obs/zoom
Content-Type: application/json

{
  "scene": "Scene Name",
  "source": "Camera Source",
  "x": 0.5,
  "y": 0.3,
  "zoom": 2
}
```

#### Scene Preview
```http
GET /obs/preview?w=1920&h=1080
```
Returns PNG image of current preview/program scene.

### Chaturbate Status
```http
GET /chaturbate/status
```
Returns polling status and last processed event ID.

## 🔄 Event Processing

The service polls events from streaming platforms and forwards them to n8n workflows:

### Chaturbate Events
Events are polled using long-polling with a 120-second timeout. Each event is forwarded to the configured n8n webhook.

**Example event structure:**
```json
{
  "method": "mediaPurchase",
  "object": {
    "broadcaster": "example_broadcaster",
    "user": {
      "username": "example_user",
      "inFanclub": false,
      "gender": "m",
      "hasTokens": true,
      "recentTips": "none",
      "isMod": false
    },
    "media": {
      "id": 1,
      "name": "photoset1",
      "type": "photos",
      "tokens": 25
    }
  },
  "id": "UNIQUE_EVENT_ID"
}
```

### n8n Workflow Integration
Events can be processed in n8n workflows and trigger actions like:
- 🎯 **Tips** → Toy pattern activation
- 💬 **Chat messages** → OBS overlay updates
- 🎁 **Media purchases** → Scene transitions
- 👥 **Followers** → Light effects

## 🖥️ Web Interface

The web interface provides:
- **OBS Preview**: Real-time scene preview with click-to-zoom
- **Camera Control**: Position and zoom controls
- **Service Status**: Health monitoring dashboard

Access at `http://localhost:8080` after starting the service.

## 🐳 Docker Deployment

### Building the Image
```bash
docker build -t modular-streaming-bridge .
```

### Using Docker Compose
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Environment Configuration
Mount your `.env` file or set environment variables in `docker-compose.yml`.

## 🛠️ Development

### Running in Development Mode
```bash
npm run dev
```

Uses nodemon for automatic restart on file changes.

### Project Structure
```
src/
├── controllers/     # Express route handlers
├── services/        # Business logic and external integrations
├── clients/         # External API clients
├── utils/           # Utility functions and helpers
├── config.js        # Configuration management
├── app.js          # Express app setup
└── server.js       # Server startup

www/                 # Static web files
```

## 🔧 Troubleshooting

### Common Issues

**OBS Connection Failed**
- Ensure OBS WebSocket server is enabled (Tools → WebSocket Server Settings)
- Check the address and password configuration
- Verify port 4455 is accessible

**Event Polling Errors**
- Verify streaming platform API URLs and credentials
- Check network connectivity
- Review debug logs with `DEBUG_BRIDGE=1`

**n8n Webhook Issues**
- Confirm webhook URL and path configuration
- Check n8n instance accessibility
- Verify API token permissions

### Debug Logging
Enable detailed logging:
```env
DEBUG_BRIDGE=1
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📚 **Documentation**: Check this README and inline code comments
- 🐛 **Issues**: Report bugs via GitHub Issues
- 💡 **Feature Requests**: Submit enhancement ideas via GitHub Issues