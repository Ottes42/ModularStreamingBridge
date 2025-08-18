# Modular Streaming Bridge

A Node.js REST API bridge that connects streaming platforms (Chaturbate) with OBS Studio and n8n automation workflows. This service handles event polling, webhook forwarding, and OBS WebSocket communication.

## 📋 Prerequisites

- Node.js 24+ (LTS recommended)
- OBS Studio with WebSocket plugin enabled
- n8n instance (optional)
- Chaturbate API credentials (optional)

## Features

### Events-Polling → n8n

- Holt Events von `CB_EVENTS_URL` (Long-Polling, Timeout 120 s).
- Sendet jedes Event unverändert als POST an `N8N_WEBHOOK_URL`.
- Nutzt `nextUrl` aus der API-Antwort, um fortzusetzen.
- Optional im n8n-Workflow nach `method` verzweigen (z. B. `tip` ⇒ Toy-Pattern, `chatMessage` ⇒ OBS-Overlay).

**Beispiel-Antwort der Chaturbate Events API:**

```json
{
  "events": [
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
  ],
  "nextUrl": "https://eventsapi.chaturbate.com/events/…/?i=UNIQUE_EVENT_ID&timeout=10"
}

## TODO

### Panel / Index

- Access nur von zu Hause erlauben via nginx reverse proxy (aktuell htaccess, doku!)
- Preview zeigt immer vollbild (oder nach zoom wieder) und bei Dropdown die richtige Cam, für Zoom+Switch
- Unzoom + Switch?

### n8n Automatisierungen

- n8n könnte Licht im Raum anpassen (Spot, Wolkendecke, nur ein Hinweis)
  - Streamstatus
  - OBS Status
  - neue Follower
  - neue Tipps über x lassen blinken?
  - Farbe im Raum via Tipps ändern?
  - bei lagg-erkennung (wie? restreamer oder event? bei schwarzem bild? offline/brb scene)
  - Glitch Filter bei special Events ein/aus?
  - Sollten Mods Scenen wechseln können?
  - KI Auswerungen von Nachrichten oder Tipps oder PMs für Hinweise auf den Desktop? 
    - Spam, Beleidigungen, aber auch positives?