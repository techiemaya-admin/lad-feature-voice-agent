// Adapter helper for resolving database schema in the voice-agent feature.
// This file is intentionally lightweight and is allowed per LAD_Architecture
// as an adapter that delegates to core/shared infra when available.

let coreSchemaHelper = null;
try {
  // Attempt to load LAD core/shared schema helper if present in host app
  // The host LAD app can alias this path as needed.
  // From backend/features/voice-agent/utils -> project root /core/utils
  // eslint-disable-next-line global-require, import/no-unresolved
  coreSchemaHelper = require('../../../../core/utils/schemaHelper');
} catch (e) {
  coreSchemaHelper = null;
}

/**
 * Get the database schema for the current request/context
 * Delegates to core helper if available, otherwise provides fallback
 * Priority: req.user.schema > req.tenant.schema > env variable > default
 * 
 * @param {Object} req - Express request object (optional)
 * @param {Object} options - Override options
 * @returns {string} Schema name
 */
function getSchema(req = null, options = {}) {
  // 1. Delegate to core helper if present
  if (coreSchemaHelper && typeof coreSchemaHelper.getSchema === 'function') {
    return coreSchemaHelper.getSchema(req, options);
  }

  // 2. Check explicit override
  if (options && options.schema) {
    return options.schema;
  }

  // 3. Check request user object (most common in authenticated routes)
  if (req && req.user && req.user.schema) {
    return req.user.schema;
  }

  // 4. Check tenant object (if passed separately)
  if (req && req.tenant && req.tenant.schema) {
    return req.tenant.schema;
  }

  // 5. Check tenantSchema set by middleware
  if (req && req.tenantSchema) {
    return req.tenantSchema;
  }

  // 6. Check environment variable
  if (process.env.DEFAULT_SCHEMA) {
    return process.env.DEFAULT_SCHEMA;
  }

  if (process.env.DB_SCHEMA) {
    return process.env.DB_SCHEMA;
  }

  // 7. Default to lad_dev for development
  return 'lad_dev';
}

/**
 * Resolve database schema for a request in a multi-tenant environment.
 * This is an alias for getSchema to maintain backward compatibility.
 *
 * @param {Object} req - Express request object
 * @returns {string} Schema name
 */
function getSchemaFromRequest(req) {
  // 1. Delegate to core helper if present
  if (coreSchemaHelper && typeof coreSchemaHelper.getSchemaFromRequest === 'function') {
    return coreSchemaHelper.getSchemaFromRequest(req);
  }

  // 2. Use getSchema with fallback behavior
  return getSchema(req);
}

/**
 * Build a table reference with schema
 * 
 * @param {string} tableName - Table name without schema
 * @param {Object} req - Express request object (optional)
 * @returns {string} Fully qualified table name (schema.table)
 */
function getTable(tableName, req = null) {
  // Delegate to core helper if present
  if (coreSchemaHelper && typeof coreSchemaHelper.getTable === 'function') {
    return coreSchemaHelper.getTable(tableName, req);
  }

  const schema = getSchema(req);
  return `${schema}.${tableName}`;
}

/**
 * Sanitize schema name to prevent SQL injection
 * 
 * @param {string} schema - Schema name to sanitize
 * @returns {string} Sanitized schema name
 */
function sanitizeSchema(schema) {
  // Delegate to core helper if present
  if (coreSchemaHelper && typeof coreSchemaHelper.sanitizeSchema === 'function') {
    return coreSchemaHelper.sanitizeSchema(schema);
  }

  // Only allow alphanumeric and underscore
  return schema.replace(/[^a-zA-Z0-9_]/g, '');
}

module.exports = {
  getSchema,
  getSchemaFromRequest,
  getTable,
  sanitizeSchema,
};
