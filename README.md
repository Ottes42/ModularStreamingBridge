# Modular Streaming Bridge

A Node.js REST API bridge that connects streaming platforms (Chaturbate) with OBS Studio and n8n automation workflows. This service handles event polling, webhook forwarding, and OBS WebSocket communication.

## 📋 Prerequisites

- Node.js 24+ (LTS recommended)
- OBS Studio with WebSocket plugin enabled
- n8n instance (optional)
- Chaturbate API credentials (optional)

# TODO

### Panel / Index

- Access nur von zu Hause erlauben via nginx reverse proxy (aktuell htaccess, doku!)
- Preview zeigt immer vollbild (oder nach zoom wieder) und bei Dropdown die richtige Cam, für Zoom+Switch
- Unzoom + Switch?
- Ganzes Regiepanel bauen? Alle Cams die Zommbar sind zeigen evtl?
- Stream/Recording Status Anzeige + Aktionen!

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