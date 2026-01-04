// ============================================================================
// HIPAA COMPLIANCE UTILITIES
// ============================================================================

export const createAuditLog = (action, details, userId, success = true) => {
  const auditEntry = {
    timestamp: new Date().toISOString(),
    action,
    userId: userId || 'anonymous',
    success,
    details,
    ipAddress: 'xxx.xxx.xxx.xxx',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    sessionId: `session_${Date.now()}`,
    complianceFramework: 'HIPAA',
    dataClassification: 'PHI',
  };
  
  console.log('[HIPAA AUDIT LOG]', JSON.stringify(auditEntry, null, 2));
  
  const existingLogs = JSON.parse(sessionStorage.getItem('hipaaAuditLogs') || '[]');
  existingLogs.push(auditEntry);
  sessionStorage.setItem('hipaaAuditLogs', JSON.stringify(existingLogs));
  
  return auditEntry;
};

// ============================================================================
// APPOINTMENT UTILITIES
// ============================================================================

export const generateAppointmentNumber = () => {
  const prefix = 'EH';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

export const calculateLeaveTime = (appointmentTime, travelTimeMinutes, bufferMinutes = 15) => {
  const [time, period] = appointmentTime.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  
  let hour24 = hours;
  if (period === 'PM' && hours !== 12) hour24 += 12;
  if (period === 'AM' && hours === 12) hour24 = 0;
  
  const appointmentDate = new Date();
  appointmentDate.setHours(hour24, minutes, 0, 0);
  
  const leaveTime = new Date(appointmentDate.getTime() - (travelTimeMinutes + bufferMinutes) * 60000);
  
  return leaveTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

// ============================================================================
// FORMAT UTILITIES
// ============================================================================

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatTime = (timeString) => {
  return timeString;
};

export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
  }
  return phone;
};

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10;
};

export const validateHealthCard = (healthCard) => {
  // Ontario health card format
  const cleaned = healthCard.replace(/\D/g, '');
  return cleaned.length === 10;
};

// ============================================================================
// STORAGE UTILITIES
// ============================================================================

export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};
