# API Documentation

This document describes the REST API endpoints provided by the Modular Streaming Bridge.

## Base URL

When running locally: `http://localhost:8080`

## Endpoints

### Health Check

#### `GET /health`

Returns the current health status of the service and its components.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "obs": true
}
```

---

### OBS WebSocket Proxy

#### `POST /obs`

Proxy endpoint for OBS WebSocket requests. Forwards requests to the connected OBS instance.

**Request Body:**
```json
{
  "requestType": "GetSceneList",
  "requestData": {}
}
```

**Response:**
Returns the response from OBS WebSocket directly.

**Examples:**

Get all scenes:
```json
{
  "requestType": "GetSceneList",
  "requestData": {}
}
```

Switch to a scene:
```json
{
  "requestType": "SetCurrentProgramScene",
  "requestData": {
    "sceneName": "Scene Name"
  }
}
```

Get output status:
```json
{
  "requestType": "GetOutputStatus",
  "requestData": {
    "outputName": "adv_stream"
  }
}
```

#### `POST /obs/zoom`

Specialized endpoint for camera zoom and positioning control.

**Request Body:**
```json
{
  "scene": "Main-Cam1-Zoom",
  "source": "Cam-Cam1",
  "x": 0.5,
  "y": 0.3,
  "zoom": 2.0
}
```

**Parameters:**
- `scene` (string, required): Target scene name
- `source` (string, required): Camera source name
- `x` (number, required): X coordinate (0.0 to 1.0)
- `y` (number, required): Y coordinate (0.0 to 1.0)
- `zoom` (number, optional): Zoom factor, default: 2.0

**Response:**
Returns the OBS transform result.

#### `GET /obs/preview`

Get a screenshot of the current preview or program scene.

**Query Parameters:**
- `w` (number, optional): Image width, default: 1920, max: 4096
- `h` (number, optional): Image height, default: 1080, max: 4096

**Response:**
Returns a PNG image.

---

### Chaturbate Service

#### `GET /chaturbate/status`

Get the status of the Chaturbate event polling service.

**Response:**
```json
{
  "polling": true,
  "lastEventId": 12345
}
```

**Fields:**
- `polling` (boolean): Whether event polling is active
- `lastEventId` (number): ID of the last processed event

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `202` - Accepted (request queued, OBS offline)
- `400` - Bad Request (invalid parameters)
- `500` - Internal Server Error
- `503` - Service Unavailable (OBS not connected)

---

## Authentication

Currently, the API does not require authentication. Consider implementing authentication for production deployments.

---

## Rate Limiting

No rate limiting is currently implemented. Consider adding rate limiting for production use.

---

## WebSocket Events

The service connects to OBS Studio via WebSocket and may emit events. These are primarily used internally for connection management and are not exposed via the REST API.