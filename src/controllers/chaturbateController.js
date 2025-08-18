const express = require('express');
const chaturbateService = require('../services/chaturbateService');

const router = express.Router();

/**
 * Get Chaturbate service status
 * GET /chaturbate/status
 */
router.get('/status', (req, res) => {
  res.json({
    polling: chaturbateService.polling,
    lastEventId: chaturbateService.lastEventId
  });
});

module.exports = router;