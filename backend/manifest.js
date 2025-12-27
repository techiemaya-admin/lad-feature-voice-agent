/**
 * Backend Manifest
 * 
 * This is a root manifest file that exports the voice agent feature manifest
 * to maintain backward compatibility with the CI/CD pipeline.
 */

const voiceAgentManifest = require('./features/voice-agent/manifest');

// Export the voice agent manifest as the default export
module.exports = voiceAgentManifest;
