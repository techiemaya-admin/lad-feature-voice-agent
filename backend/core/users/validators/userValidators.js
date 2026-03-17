const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeString(value) {
  if (value === null) return null;
  if (value === undefined) return undefined;
  const trimmed = String(value).trim();
  return trimmed.length === 0 ? null : trimmed;
}

function validateProfileUpdate(payload) {
  const updates = {};
  const errors = [];

  if (Object.prototype.hasOwnProperty.call(payload, 'email')) {
    const email = normalizeString(payload.email);
    if (email === null) {
      errors.push('Email cannot be empty');
    } else if (!EMAIL_REGEX.test(email)) {
      errors.push('Email is invalid');
    } else {
      updates.email = email;
    }
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'firstName')) {
    updates.firstName = normalizeString(payload.firstName);
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'lastName')) {
    updates.lastName = normalizeString(payload.lastName);
  }

  if (Object.keys(updates).length === 0) {
    errors.push('No valid fields provided for update');
  }

  return {
    isValid: errors.length === 0,
    errors,
    updates
  };
}

module.exports = {
  validateProfileUpdate
};
