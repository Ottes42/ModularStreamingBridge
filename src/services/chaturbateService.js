const axios = require('axios');
const config = require('../config');
const { debugLog, errorLog, infoLog } = require('../utils/logger');
const N8NClient = require('../clients/n8nClient');

class ChaturbateService {
  constructor() {
    this.polling = false;
    this.lastEventId = 0;
    this.n8nClient = null;
  }

  /**
   * Initialize Chaturbate service
   */
  async initialize() {
    // Initialize n8n client if webhook is configured
    if (config.portals.chaturbate.n8nWebhook) {
      this.n8nClient = new N8NClient(config.n8n, config.portals.chaturbate.n8nWebhook);
      debugLog('N8N client initialized for Chaturbate service');
    }

    if (config.portals.chaturbate.eventsUrl) {
      this.startEventPolling();
    } else {
      infoLog('Chaturbate events URL not configured, skipping event polling');
    }
  }

  /**
   * Start long-polling for Chaturbate events
   */
  startEventPolling() {
    if (this.polling) return;
    
    this.polling = true;
    infoLog('🔄 Starting Chaturbate event polling...');
    this.pollEvents();
  }

  /**
   * Poll events from Chaturbate API
   */
  async pollEvents() {
    let eventsUrl = config.portals.chaturbate.eventsUrl;
    
    while (this.polling) {
      try {
        const response = await axios.get(eventsUrl, {
          params: { since: this.lastEventId },
          timeout: 120000 // 2 minutes
        });

        const events = response.data.events || [];
        
        for (const event of events) {
          this.lastEventId = Math.max(this.lastEventId, event.id);
          await this.forwardEventToN8n(event);
        }

        if (response.data.nextUrl) {
          eventsUrl = response.data.nextUrl;
        } else {
          await this.sleep(10000); // Wait 10 seconds
        }
      } catch (error) {
        errorLog('Chaturbate polling error:', error.message);
        
        // Backoff with jitter
        const backoffTime = 2000 + Math.random() * 3000;
        await this.sleep(backoffTime);
      }
    }
  }

  /**
   * Forward event to n8n webhook using N8NClient
   * @param {Object} event - Chaturbate event
   */
  async forwardEventToN8n(event) {
    if (!this.n8nClient) {
      debugLog('No n8n webhook configured for Chaturbate events');
      return;
    }

    try {
      await this.n8nClient.forwardEvent(event, debugLog, errorLog);
    } catch (error) {
      // Error is already logged by the n8nClient
      // Additional error handling can be added here if needed
    }
  }

  /**
   * Sleep utility function
   * @param {number} ms - Milliseconds to sleep
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Stop event polling and disconnect
   */
  async disconnect() {
    this.polling = false;
    infoLog('Chaturbate service disconnected');
  }
}

module.exports = new ChaturbateService();