/**
 * Utility functions for OBS operations
 */

const sourceResolutionsCache = {};
const sceneItemIdCache = {};

/**
 * Get source resolution with caching
 * @param {string} sourceName - Name of the source
 * @param {OBSWebSocket} obs - OBS WebSocket instance
 * @returns {Promise<{camW: number, camH: number}>} Source resolution
 */
async function getSourceResolution(sourceName, obs) {
  if (sourceResolutionsCache[sourceName]) {
    return sourceResolutionsCache[sourceName];
  }
  
  const resolution = await getSourceResolutionFromOBS(sourceName, obs);
  sourceResolutionsCache[sourceName] = resolution;
  return resolution;
}

/**
 * Get source resolution from OBS directly
 * @param {string} sourceName - Name of the source
 * @param {OBSWebSocket} obs - OBS WebSocket instance
 * @returns {Promise<{camW: number, camH: number}>} Source resolution
 */
async function getSourceResolutionFromOBS(sourceName, obs) {
  try {
    const { inputSettings } = await obs.call("GetInputSettings", { inputName: sourceName });
    const camW = inputSettings.width;
    const camH = inputSettings.height;
    if (camW && camH) return { camW, camH };
  } catch (err) {
    console.warn(`⚠️ Could not get resolution for ${sourceName}:`, err.message);
  }
  return { camW: 1920, camH: 1080 };
}

/**
 * Get scene item ID with caching
 * @param {string} sceneName - Name of the scene
 * @param {string} sourceName - Name of the source
 * @param {OBSWebSocket} obs - OBS WebSocket instance
 * @returns {Promise<number>} Scene item ID
 */
async function getSceneItemId(sceneName, sourceName, obs) {
  const key = `${sceneName}-${sourceName}`;
  if (!sceneItemIdCache[key]) {
    const { sceneItemId } = await obs.call('GetSceneItemId', { sceneName, sourceName });
    sceneItemIdCache[key] = sceneItemId;
  }
  return sceneItemIdCache[key];
}

/**
 * Calculate crop values for focus/zoom effect
 * @param {Object} params - Parameters for crop calculation
 * @param {number} params.camW - Camera width
 * @param {number} params.camH - Camera height
 * @param {number} params.zoom - Zoom factor (default: 2)
 * @param {number} params.x - X coordinate (0-1)
 * @param {number} params.y - Y coordinate (0-1)
 * @returns {Object} Crop values
 */
function cropsForFocus({ camW, camH, zoom = 2, x, y }) {
  const winW = Math.round(camW / zoom);
  const winH = Math.round(camH / zoom);
  const cx = Math.round(x * camW);
  const cy = Math.round(y * camH);

  let left = cx - Math.round(winW / 2);
  let top = cy - Math.round(winH / 2);

  left = Math.max(0, Math.min(left, camW - winW));
  top = Math.max(0, Math.min(top, camH - winH));

  return {
    cropLeft: left,
    cropRight: camW - (left + winW),
    cropTop: top,
    cropBottom: camH - (top + winH),
  };
}

/**
 * Clear all caches
 */
function clearCaches() {
  Object.keys(sourceResolutionsCache).forEach(key => delete sourceResolutionsCache[key]);
  Object.keys(sceneItemIdCache).forEach(key => delete sceneItemIdCache[key]);
}

module.exports = {
  getSourceResolution,
  getSourceResolutionFromOBS,
  getSceneItemId,
  cropsForFocus,
  clearCaches
};