/**
 * Voice Agent routes entry point
 *
 * Exports a router factory so both:
 * - standalone dev server (server.js) can call it with a db pool
 * - feature index (index.js) can expose it as createRouter
 */

let sharedPool;
try {
  ({ pool: sharedPool } = require('../../shared/database/connection'));
} catch (e) {
  sharedPool = null;
}

let jwtAuth;
try {
  ({ authenticateToken: jwtAuth } = require('../../core/middleware/auth'));
} catch (e) {
  jwtAuth = (req, res, next) => next();
}

const localPool = require('./db');
const createVoiceAgentRouter = require('./routes/index');

// Default tenant middleware (extracts tenant from JWT user)
const defaultTenantMiddleware = (req, res, next) => {
  req.tenantId = req.user?.tenantId || req.headers['x-tenant-id'] || req.query.tenant_id;
  next();
};

function createRouter(dbPool) {
  const pool = dbPool || sharedPool || localPool;

  // If a pool is explicitly provided (standalone dev server usage),
  // server.js already attaches req.user (JWT or fallback dev user).
  // In that mode we should not enforce the core jwtAuth again.
  const effectiveJwtAuth = dbPool ? ((req, res, next) => next()) : jwtAuth;

  return createVoiceAgentRouter(pool, {
    jwtAuth: effectiveJwtAuth,
    tenantMiddleware: defaultTenantMiddleware,
  });
}

module.exports = createRouter;
