const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config');
const obsController = require('./controllers/obsController');
const chaturbateController = require('./controllers/chaturbateController');
const { debugLog } = require('./utils/logger');

/**
 * Creates and configures the Express application
 * @returns {express.Application} Configured Express app
 */
function createApp() {
  const app = express();
  
  // Middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, '../www')));
  
  // Routes
  app.use('/obs', obsController);
  app.use('/chaturbate', chaturbateController);
  
  app.get('/health', (req, res) => {
    debugLog('HTTP IN: /health');
    // const obsService = require('./services/obsService');
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      obs: obsService.isReady(),
      // Add other service statuses as needed
    });
  });
  
  return app;
}

module.exports = createApp;