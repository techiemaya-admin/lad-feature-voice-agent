const BatchRepository = require('../repositories/BatchRepository');
const RecordingService = require('./RecordingService');
let logger;
try {
  logger = require('../../../core/utils/logger');
} catch (e) {
  logger = console;
}

class BatchService {
  constructor(pool) {
    this.batchRepository = new BatchRepository(pool);
    this.recordingService = new RecordingService();
  }

  /**
   * Get all batches for a tenant ordered by updated_at DESC with pagination
   */
  async getBatchesView(tenantId, schema, limit = 50, offset = 0) {
    try {
      const batches = await this.batchRepository.getBatchesByTenant(tenantId, schema, limit, offset);
      const total = await this.batchRepository.getBatchesCountByTenant(tenantId, schema);

      const batchesWithSignedAttachments = await Promise.all(
        (batches || []).map(async (batch) => {
          try {
            const attachmentUrl = batch?.attachments;

            if (!attachmentUrl || typeof attachmentUrl !== 'string') {
              return batch;
            }

            const trimmedUrl = attachmentUrl.trim();
            if (!trimmedUrl.startsWith('gs://')) {
              return {
                ...batch,
                attachment_file_name: trimmedUrl.split('/').pop() || null,
                attachment_signed_url: trimmedUrl,
                attachment_expires_at: null
              };
            }

            const parsed = this.recordingService.parseGCSUrl(trimmedUrl);
            const fileName = parsed?.path ? parsed.path.split('/').pop() : null;

            const signed = await this.recordingService.getGCSSignedUrl(trimmedUrl);

            return {
              ...batch,
              attachment_file_name: fileName,
              attachment_signed_url: signed?.success ? signed.signedUrl : null,
              attachment_expires_at: signed?.success ? signed.expiresAt : null
            };
          } catch (e) {
            logger.warn('[BatchService] Failed to sign batch attachment', {
              error: e?.message,
              tenantId,
              batchId: batch?.id
            });
            return {
              ...batch,
              attachment_file_name: null,
              attachment_signed_url: null,
              attachment_expires_at: null
            };
          }
        })
      );

      return {
        success: true,
        data: batchesWithSignedAttachments,
        total
      };
    } catch (error) {
      logger.error('[BatchService] getBatchesView failed', {
        error: error.message,
        tenantId
      });
      throw error;
    }
  }

  /**
   * Get batch details with call logs for a specific batch_id with pagination
   */
  async getBatchById(batchId, tenantId, schema, limit = 50, offset = 0) {
    try {
      // Get total count of entries for this batch
      const total = await this.batchRepository.getCallLogIdsCountByBatchId(batchId, tenantId, schema);

      // Get call_log_ids from batch entries with pagination
      const callLogIds = await this.batchRepository.getCallLogIdsByBatchId(batchId, tenantId, schema, limit, offset);

      if (callLogIds.length === 0 && total === 0) {
        return {
          success: false,
          error: 'No entries found for this batch'
        };
      }

      // Get call logs for these call_log_ids
      const callLogs = await this.batchRepository.getCallLogsByIds(callLogIds, tenantId, schema);

      return {
        success: true,
        data: {
          batch_id: batchId,
          call_logs: callLogs,
          total
        }
      };

    } catch (error) {
      logger.error('[BatchService] getBatchById failed', {
        error: error.message,
        batchId,
        tenantId
      });
      throw error;
    }
  }

  /**
   * Get batch statistics for a tenant
   */
  async getBatchStats(tenantId, schema) {
    try {
      const stats = await this.batchRepository.getBatchStats(tenantId, schema);

      // Calculate total batches
      const total = stats.reduce((sum, item) => sum + parseInt(item.count, 10), 0);

      return {
        success: true,
        data: {
          batches_by_status: stats,
          total_batches: total
        }
      };
    } catch (error) {
      logger.error('[BatchService] getBatchStats failed', {
        error: error.message,
        tenantId
      });
      throw error;
    }
  }
}

module.exports = BatchService;
