const logger = require('../../utils/logger');
const { validateProfileUpdate } = require('../validators/userValidators');
const { toUserProfileDto } = require('../dtos/userDto');

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  async getProfile(req, res) {
    try {
      const userId = req.user?.userId || req.user?.id;
      const tenantId = req.user?.tenantId;

      if (!tenantId) {
        return res.status(400).json({
          success: false,
          error: 'Tenant context required'
        });
      }

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User context required'
        });
      }

      const profile = await this.userService.getProfile(userId, tenantId);
      if (!profile) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      return res.json({
        success: true,
        profile: toUserProfileDto(profile)
      });
    } catch (error) {
      logger.error('[Users] Failed to get profile', { error: error.message });
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch profile'
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user?.userId || req.user?.id;
      const tenantId = req.user?.tenantId;

      if (!tenantId) {
        return res.status(400).json({
          success: false,
          error: 'Tenant context required'
        });
      }

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User context required'
        });
      }

      const validation = validateProfileUpdate(req.body || {});
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: 'Invalid profile update',
          details: validation.errors
        });
      }

      const updated = await this.userService.updateProfile(
        userId,
        tenantId,
        validation.updates
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        profile: toUserProfileDto(updated)
      });
    } catch (error) {
      logger.error('[Users] Failed to update profile', { error: error.message });
      return res.status(500).json({
        success: false,
        error: 'Failed to update profile'
      });
    }
  }
}

module.exports = UserController;
