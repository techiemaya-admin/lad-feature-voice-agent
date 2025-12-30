/**
 * Voice Agent Routes
 * LAD Architecture Compliant - Express routes for voice agent management
 */

const express = require('express');
const { 
  VoiceAgentController, 
  CallController, 
  BatchCallController, 
  CallInitiationController 
} = require('../controllers');

function createVoiceAgentRouter(pool, options = {}) {
  const router = express.Router();

  const jwtAuth = typeof options.jwtAuth === 'function'
    ? options.jwtAuth
    : (req, res, next) => next();

  const tenantMiddleware = typeof options.tenantMiddleware === 'function'
    ? options.tenantMiddleware
    : (req, res, next) => {
        req.tenantId = req.user?.tenantId || req.headers['x-tenant-id'] || req.query.tenant_id;
        next();
      };

  const auth = [jwtAuth, tenantMiddleware];

// ============================================
// JWT-Protected Endpoints (User-Specific)  
// ============================================

/**
 * GET /user/available-agents
 * Get available agents for authenticated user
 */
router.get(
  '/user/available-agents',
  auth,
  (req, res) => {
    const controller = new VoiceAgentController(pool);
    controller.getUserAvailableAgents(req, res);
  }
);

  /**
   * GET /user/available-numbers
   * Get available phone numbers for authenticated user
   */
  router.get(
    '/user/available-numbers',
    auth,
    (req, res) => {
      const controller = new VoiceAgentController(pool);
      controller.getUserAvailableNumbers(req, res);
    }
  );

  /**
   * GET /voices/:id/sample-signed-url
   * Get signed URL for voice sample
   */
  router.get(
    '/voices/:id/sample-signed-url',
    auth,
    (req, res) => {
      const controller = new VoiceAgentController(pool);
      controller.getVoiceSampleSignedUrl(req, res);
    }
  );

  /**
   * GET /agents/:agentId/sample-signed-url
   * Get signed URL for agent's voice sample
   */
  router.get(
    '/agents/:agentId/sample-signed-url',
    auth,
    (req, res) => {
      const controller = new VoiceAgentController(pool);
      controller.getAgentVoiceSampleSignedUrl(req, res);
    }
  );

  // ============================================
  // Public/Tenant Endpoints
  // ============================================

  /**
   * GET /test
   * Health check / test endpoint
   */
  router.get('/test', (req, res) => {
    const controller = new VoiceAgentController(pool);
    controller.test(req, res);
  });

  /**
   * GET /all
   * Get all agents for tenant
   */
  router.get(
    '/all',
    auth,
    (req, res) => {
      const controller = new VoiceAgentController(pool);
      controller.getAllAgents(req, res);
    }
  );

  /**
   * GET /agent/:name
   * Get agent by name
   */
  router.get(
    '/agent/:name',
    auth,
    (req, res) => {
      const controller = new VoiceAgentController(pool);
      controller.getAgentByName(req, res);
    }
  );

  /**
   * GET /voices
   * Get all voice profiles
   */
  router.get(
    '/voices',
    auth,
    (req, res) => {
      const controller = new VoiceAgentController(pool);
      controller.getAllVoices(req, res);
    }
  );

  /**
   * GET / (legacy)
   * Get all voices (legacy endpoint)
   */
  router.get(
    '/',
    auth,
    (req, res) => {
      const controller = new VoiceAgentController(pool);
      controller.getAllVoices(req, res);
    }
  );

  /**
   * GET /numbers
   * Get all phone numbers
   */
  router.get(
    '/numbers',
    auth,
    (req, res) => {
      const controller = new VoiceAgentController(pool);
      controller.getAllPhoneNumbers(req, res);
    }
  );

  // ============================================
  // Call Endpoints
  // ============================================

  /**
   * GET /calls
   * Get call logs with optional filters
   */
  router.get(
    '/calls',
    auth,
    (req, res) => {
      const controller = new CallController(pool);
      controller.getCallLogs(req, res);
    }
  );

  /**
   * POST /calls
   * Initiate a single voice call
   */
  router.post(
    '/calls',
    auth,
    (req, res) => {
      const controller = new CallInitiationController(pool);
      controller.initiateCall(req, res);
    }
  );

  /**
   * POST /calls/batch
   * Initiate batch voice calls
   */
  router.post(
    '/calls/batch',
    auth,
    (req, res) => {
      const controller = new BatchCallController(pool);
      controller.batchInitiateCalls(req, res);
    }
  );

  /**
   * GET /calllogs
   * Get call logs (for testing / general listing)
   */
  router.get(
    '/calllogs',
    auth,
    (req, res) => {
      const controller = new CallController(pool);
      controller.getCallLogs(req, res);
    }
  );

  /**
   * GET /calllogs/:call_log_id
   * Get a single call log by ID
   */
  router.get(
    '/calllogs/:call_log_id',
    auth,
    (req, res) => {
      const controller = new CallController(pool);
      controller.getCallLogById(req, res);
    }
  );

  /**
   * GET /calllogs/batch/:batch_id
   * Get call logs for a specific batch
   */
  router.get(
    '/calllogs/batch/:batch_id',
    auth,
    (req, res) => {
      const controller = new CallController(pool);
      controller.getBatchCallLogsByBatchId(req, res);
    }
  );

  /**
   * POST /calls/batch
   * Initiate batch voice calls
   */
  router.post(
    '/calls/batch',
    auth,
    (req, res) => {
      const controller = new CallController(pool);
      controller.batchInitiateCalls(req, res);
    }
  );

  /**
   * GET /calls/:id/recording-signed-url
   * Get signed URL for call recording
   */
  router.get(
    '/calls/:id/recording-signed-url',
    auth,
    (req, res) => {
      const controller = new CallController(pool);
      controller.getCallRecordingSignedUrl(req, res);
    }
  );

  /**
   * GET /calls/recent
   * Get recent calls with filters
   */
  router.get(
    '/calls/recent',
    auth,
    (req, res) => {
      const controller = new CallController(pool);
      controller.getRecentCalls(req, res);
    }
  );

  /**
   * GET /calls/stats
   * Get call statistics
   */
  router.get(
    '/calls/stats',
    auth,
    (req, res) => {
      const controller = new CallController(pool);
      controller.getCallStats(req, res);
    }
  );

  // ============================================
  // Phone Resolution & Sales Summary
  // ============================================

  /**
   * POST /resolve-phones
   * Resolve phone numbers from company/employee caches
   */
  router.post(
    '/resolve-phones',
    auth,
    (req, res) => {
      const controller = new CallController(pool);
      controller.resolvePhones(req, res);
    }
  );

  /**
   * POST /update-summary
   * Update sales summary for company or employee
   */
  router.post(
    '/update-summary',
    auth,
    (req, res) => {
      const controller = new CallController(pool);
      controller.updateSalesSummary(req, res);
    }
  );

  return router;
}

module.exports = createVoiceAgentRouter;
