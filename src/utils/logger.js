const config = require('../config');

/**
 * Debug logging function
 * @param {...any} args - Arguments to log
 */
function debugLog(...args) {
  if (config.server.debug) {
    console.log('[DEBUG]', new Date().toISOString(), ...args);
  }
}

/**
 * Error logging function
 * @param {...any} args - Arguments to log
 */
function errorLog(...args) {
  console.error('[ERROR]', new Date().toISOString(), ...args);
}

/**
 * Info logging function
 * @param {...any} args - Arguments to log
 */
function infoLog(...args) {
  console.log('[INFO]', new Date().toISOString(), ...args);
}

module.exports = {
  debugLog,
  errorLog,
  infoLog
};