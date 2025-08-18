const createApp = require('./app');
const config = require('./config');
const obsService = require('./services/obsService');
const chaturbateService = require('./services/chaturbateService');

/**
 * Starts the server and initializes services
 */
async function startServer() {
  const app = createApp();
  
  const server = app.listen(config.server.port, () => {
    console.log(`🚀 Server running on port ${config.server.port}`);
  });
  
  // Initialize services
  await obsService.initialize();
  await chaturbateService.initialize();
  
  // Graceful shutdown
  const shutdown = async () => {
    console.log('🔻 Shutting down...');
    server.close();
    await obsService.disconnect();
    await chaturbateService.disconnect();
    process.exit(0);
  };
  
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

if (require.main === module) {
  startServer().catch(console.error);
}

module.exports = { startServer };