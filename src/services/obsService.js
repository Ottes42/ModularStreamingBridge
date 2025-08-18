const OBSWebSocket = require('obs-websocket-js').default;
const config = require('../config');
const { debugLog, errorLog, infoLog } = require('../utils/logger');

class ObsService {
  constructor() {
    this.obs = new OBSWebSocket();
    this.ready = false;
    this.attempt = 0;
    this.queue = [];
    this.maxBackoff = 60000;
    this.baseBackoff = 2000;
  }

  /**
   * Initialize OBS connection and event handlers
   */
  async initialize() {
    this.setupErrorHandlers();
    this.setupEventHandlers();
    this.setupHeartbeat();
    await this.connect();
  }

  /**
   * Setup global error handlers for OBS connection issues
   */
  setupErrorHandlers() {
    process.on('uncaughtException', (err) => {
      const msg = err && err.message;
      if (msg && msg.includes('Unexpected server response')) {
        // OBS Handshake-504 catch
        return;
      }
      errorLog('💥 Uncaught Exception:', err);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason) => {
      const msg = reason && reason.message;
      if (msg && msg.includes('Unexpected server response')) {
        infoLog('⚠️ Caught OBS handshake rejection, forcing reconnect…');
        return;
      }
      errorLog('💥 Unhandled Rejection:', reason);
      process.exit(1);
    });
  }

  /**
   * Setup OBS event handlers
   */
  setupEventHandlers() {
    this.obs.on('ConnectionError', (err) => {
      this.attempt++;
      errorLog('OBS connection error:', err.message);
    });

    this.obs.on('ConnectionClosed', () => {
      this.ready = false;
      infoLog('❌ OBS connection lost.');
      this.connect();
    });

    this.obs.on('CurrentProgramSceneChanged', (data) => {
      infoLog('OBS Scene Changed:', data?.sceneName || 'Unknown');
      // TODO: Send back to n8n if needed
    });
  }

  /**
   * Setup heartbeat to maintain connection
   */
  setupHeartbeat() {
    setInterval(() => {
      if (this.ready) {
        this.obs.call('GetVersion').catch((err) => {
          errorLog('OBS heartbeat failed:', err.message);
        });
      }
    }, 30000);
  }

  /**
   * Connect to OBS with exponential backoff
   */
  async connect() {
    const delay = Math.min(this.baseBackoff * (2 ** this.attempt), this.maxBackoff);
    const jitter = delay * (0.9 + Math.random() * 0.2);

    setTimeout(async () => {
      try {
        infoLog('🎥 Connecting to OBS...');
        await this.obs.connect(config.obs.address, config.obs.password);
        this.ready = true;
        this.attempt = 0;
        infoLog('🎥 Connected to OBS');
        this.flushQueue();
      } catch (error) {
        errorLog(`OBS reconnect failed: ${error.message}. Retry in ${Math.round(jitter)}ms`);
      }
    }, jitter);
  }

  /**
   * Process queued requests when connection is restored
   */
  flushQueue() {
    while (this.queue.length) {
      const queueItem = this.queue.shift();
      // Handle the queued request without blocking
      this.handleQueuedRequest(queueItem.req, queueItem.res).catch((error) => {
        errorLog('Error handling queued request:', error.message);
      });
    }
  }

  /**
   * Handle queued request with proper response handling
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async handleQueuedRequest(req, res) {
    // Check if response has already been sent
    if (res.headersSent) {
      debugLog('Response already sent for queued request');
      return;
    }

    try {
      const { requestType, requestData } = req.body;
      
      // Validate request data
      if (!requestType) {
        return res.status(400).json({ error: 'requestType is required' });
      }

      const result = await this.callObs(requestType, requestData);
      return res.json(result);
    } catch (error) {
      errorLog('Error in handleQueuedRequest:', error.message);
      
      // Only send error response if headers haven't been sent
      if (!res.headersSent) {
        return res.status(500).json({ error: error.message });
      }
    }
  }

  /**
   * Queue request when OBS is not ready with timeout handling
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  queueRequest(req, res) {
    // Add timestamp to track queue time
    const queueItem = { 
      req, 
      res, 
      timestamp: Date.now() 
    };
    
    this.queue.push(queueItem);
    
    // Set timeout for queued request (30 seconds)
    setTimeout(() => {
      const index = this.queue.findIndex(item => item === queueItem);
      if (index !== -1 && !res.headersSent) {
        this.queue.splice(index, 1);
        res.status(408).json({ error: 'Request timeout while OBS was connecting' });
      }
    }, 30000);
  }

  /**
   * Call OBS with request type and data
   * @param {string} requestType - OBS request type
   * @param {Object} requestData - Request data
   * @returns {Promise<Object>} OBS response
   */
  async callObs(requestType, requestData = {}) {
    if (!this.ready) {
      throw new Error('OBS not connected');
    }

    try {
      debugLog('OBS IN:', { requestType, requestData });
      const result = await this.obs.call(requestType, requestData) || {};
      return result;
    } catch (error) {
      errorLog('OBS call failed:', error.message);
      throw error;
    }
  }

  /**
   * Check if OBS is ready
   * @returns {boolean} OBS ready status
   */
  isReady() {
    return this.ready;
  }

  /**
   * Get OBS instance for direct access (use sparingly)
   * @returns {OBSWebSocket} OBS WebSocket instance
   */
  getObsInstance() {
    return this.obs;
  }

  /**
   * Disconnect from OBS
   */
  async disconnect() {
    if (this.ready) {
      await this.obs.disconnect();
      this.ready = false;
    }
  }
}

module.exports = new ObsService();