const axios = require('axios');

/**
 * N8N Client for forwarding events to n8n webhooks
 * @class N8NClient
 */
class N8NClient {
  /**
   * Creates an instance of N8NClient
   * @param {Object} n8nConfig - N8N configuration object
   * @param {string} n8nConfig.instance - N8N instance URL
   * @param {string} n8nConfig.apiToken - Optional API token for authentication
   * @param {string} webhookPath - Webhook path for this client
   */
  constructor(n8nConfig, webhookPath) {
    this.instance = n8nConfig.instance;
    this.apiToken = n8nConfig.apiToken;
    this.webhookPath = webhookPath;
    this.isTestMode = false;
  }

  /**
   * Sets test mode for the client
   * @param {boolean} testMode - Whether to enable test mode
   */
  setTestMode(testMode = true) {
    this.isTestMode = testMode;
  }

  /**
   * Builds the complete webhook URL
   * @returns {string} Complete webhook URL
   * @private
   */
  _buildWebhookUrl() {
    return `${this.instance}webhook${this.isTestMode?'-test':''}/${this.webhookPath}`;
  }

  /**
   * Builds headers for the request
   * @returns {Object} Request headers
   * @private
   */
  _buildHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (this.apiToken) {
      headers['Authorization'] = `Bearer ${this.apiToken}`;
    }

    return headers;
  }

  /**
   * Forwards an event to the n8n webhook
   * @param {Object} event - Event data to forward
   * @param {function} debugLog - Debug logging function
   * @param {function} errorLog - Error logging function
   * @returns {Promise<void>}
   */
  async forwardEvent(event, debugLog = console.log, errorLog = console.error) {
    try {
      const webhookUrl = this._buildWebhookUrl();
      const headers = this._buildHeaders();

      await axios.post(webhookUrl, event, { headers });
      debugLog('Event forwarded to n8n:', event.type || 'unknown');
    } catch (error) {
      errorLog('Failed to forward event to n8n:', error.message);
      throw error;
    }
  }
}

module.exports = N8NClient;