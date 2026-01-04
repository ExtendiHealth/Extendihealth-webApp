export const TWO_FA_CONFIG = {
  sessionDuration: 15 * 60 * 1000, // 15 minutes
  codeLength: 6,
  codeExpiry: 5 * 60 * 1000, // 5 minutes
  maxAttempts: 3,
  resendCooldown: 60 * 1000, // 1 minute
};

export const PIN_VERIFICATION_CONFIG = {
  pinLength: 4,
  maxAttempts: 3,
  lockoutDuration: 30 * 60 * 1000, // 30 minutes
  sessionDuration: 5 * 60 * 1000, // 5 minutes for sensitive data access
};
