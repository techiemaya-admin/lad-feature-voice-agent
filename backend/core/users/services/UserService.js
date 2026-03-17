class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getProfile(userId, tenantId) {
    return this.userRepository.getUserProfile(userId, tenantId);
  }

  async updateProfile(userId, tenantId, updates) {
    return this.userRepository.updateUserProfile(userId, tenantId, updates);
  }
}

module.exports = UserService;
