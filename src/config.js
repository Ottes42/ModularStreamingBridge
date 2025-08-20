require('dotenv').config();

const config = {
  server: {
    port: parseInt(process.env.PORT, 10) || 80,
    debug: !!process.env.DEBUG_BRIDGE
  },
  obs: {
    address: process.env.OBS_ADDR || 'ws://localhost:4455',
    password: process.env.OBS_PASS
  },
  n8n: {
    instance: process.env.N8N_INSTANCE,
    apiToken: process.env.N8N_APITOKEN
  },
  portals: {
    chaturbate: {
      eventsUrl: process.env.CB_EVENTS_URL,
      statsUrl: process.env.CB_STATS_URL,
      n8nWebhook: process.env.CB_N8N_EVENTS_WEBHOOK
    }
  }
};

module.exports = config;
