const express = require('express');
const { Buffer } = require('buffer');
const obsService = require('../services/obsService');
const { getSourceResolution, getSceneItemId, cropsForFocus } = require('../utils/obsHelpers');
const { errorLog, debugLog } = require('../utils/logger');

const router = express.Router();

/**
 * Handle OBS requests
 * POST /obs
 * Body: { requestType: string, requestData?: Object }
 */
router.post('/', async (req, res) => {
  try {
    debugLog('HTTP IN: /obs', req.body);
    
    if (!obsService.isReady()) {
      obsService.queueRequest(req, res);
      return res.status(202).send('OBS offline, command queued');
    }

    const { requestType, requestData } = req.body;
    
    if (!requestType) {
      return res.status(400).json({ error: 'requestType is required' });
    }

    const result = await obsService.callObs(requestType, requestData);
    res.json(result);
  } catch (error) {
    errorLog('OBS controller error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get OBS preview/program scene screenshot
 * GET /obs/preview?w=1920&h=1080
 */
router.get('/preview', async (req, res) => {
  try {
    if (!obsService.isReady()) {
      return res.status(503).send('OBS not connected');
    }

    let sceneName;
    try {
      const { currentPreviewSceneName } = await obsService.callObs('GetCurrentPreviewScene');
      sceneName = currentPreviewSceneName;
    } catch (e) {
      const { currentProgramSceneName } = await obsService.callObs('GetCurrentProgramScene');
      sceneName = currentProgramSceneName;
    }

    const w = Math.max(64, Math.min(4096, parseInt(req.query.w || '1920', 10)));
    const h = Math.max(64, Math.min(4096, parseInt(req.query.h || '1080', 10)));

    const { imageData } = await obsService.callObs('GetSourceScreenshot', {
      sourceName: sceneName,
      imageFormat: 'jpeg',
      imageWidth: w,
      imageHeight: h
    });

    const base64 = imageData.startsWith('data:')
      ? imageData.split(',', 2)[1]
      : imageData;

    res.set('Content-Type', 'image/jpeg');
    res.set('Cache-Control', 'no-store');
    res.send(Buffer.from(base64, 'base64'));
  } catch (error) {
    errorLog('Preview error:', error?.message || error);
    
    if ((error?.message || '').includes('Your request type is not valid')) {
      return res
        .status(500)
        .send('OBS-WebSocket does not understand the request. Please check that you are using OBS-WebSocket v5.x and the request name is correct.');
    }
    res.status(500).send('Preview failed');
  }
});

/**
 * Apply zoom/crop to OBS source
 * POST /obs/zoom
 * Body: { scene: string, source: string, x: number, y: number, zoom?: number }
 */
router.post('/zoom', async (req, res) => {
  try {
    if (!obsService.isReady()) {
      return res.status(503).send('OBS not connected');
    }

    const { scene, source, x, y, zoom = 2 } = req.body;
    if (!scene || !source || typeof x !== 'number' || typeof y !== 'number') {
      return res.status(400).send('scene, source, x, y are required fields');
    }

    const { camW, camH } = await getSourceResolution(source, obsService.getObsInstance());
    const sceneItemId = await getSceneItemId(scene, source, obsService.getObsInstance());

    const { cropLeft, cropRight, cropTop, cropBottom } = cropsForFocus({ camW, camH, zoom, x, y });

    await obsService.callObs('SetSceneItemTransform', {
      sceneName: scene,
      sceneItemId,
      sceneItemTransform: { cropLeft, cropRight, cropTop, cropBottom }
    });

    await obsService.callObs('SetCurrentProgramScene', { sceneName: scene });

    res.json({ 
      ok: true, 
      scene, 
      source, 
      camW, 
      camH, 
      cropLeft, 
      cropRight, 
      cropTop, 
      cropBottom 
    });
  } catch (error) {
    errorLog('Zoom error:', error);
    res.status(500).send(error.message);
  }
});

module.exports = router;