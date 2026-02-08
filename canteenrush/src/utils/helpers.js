export function generateOrderId() {
  return 'ORD-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}

export function generateToken() {
  return 'T-' + String(Math.floor(Math.random() * 900) + 100);
}

export function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export function minutesFromNow(timestamp) {
  const diff = timestamp - Date.now();
  const minutes = Math.ceil(diff / 60000);
  if (minutes <= 0) return 'Now';
  return `${minutes} min`;
}