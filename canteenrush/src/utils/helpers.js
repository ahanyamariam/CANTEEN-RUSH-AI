/**
 * FERRO Industrial Utility Protocol
 * Data: Transaction and Token Generation
 */

export function generateOrderId() {
  // Logic: Unique Transaction ID for System Log
  return 'TXN-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}

export function generateToken() {
  // Logic: Technical Token for Collection Verification
  return 'TKN-' + String(Math.floor(Math.random() * 900) + 100);
}

export function calculateElapsed(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'JUST_NOW';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}M_ELAPSED`;
  const hours = Math.floor(minutes / 60);
  return `${hours}H_ELAPSED`;
}

export function minutesFromNow(timestamp) {
  const diff = timestamp - Date.now();
  const minutes = Math.ceil(diff / 60000);
  if (minutes <= 0) return 'NODE_READY';
  return `${minutes}M_REMAINING`;
}