/**
 * FERRO Neural Prediction Logic
 * Theme: Industrial High-Contrast Protocol
 */

const RUSH_WINDOWS = [
  { start: 9.5, end: 10.5, intensity: 1.4, label: 'MORNING_BREAK_SYNC' },
  { start: 12, end: 13.5, intensity: 1.8, label: 'PEAK_LUNCH_TRAFFIC' },
  { start: 15, end: 16, intensity: 1.3, label: 'AFTERNOON_PEAK' },
  { start: 17, end: 18, intensity: 1.1, label: 'EVENING_ROUTINE' },
];

export function getRushMultiplier(date = new Date()) {
  const hours = date.getHours() + date.getMinutes() / 60;
  for (const window of RUSH_WINDOWS) {
    if (hours >= window.start && hours <= window.end) {
      return { multiplier: window.intensity, label: window.label };
    }
  }
  return { multiplier: 1.0, label: 'NOMINAL_FLOW' };
}

export function predictWaitTime({
  itemsPrepTime,
  activeOrders,
  vendorCapacity,
  avgVendorPrepTime,
  pickupTime = null, // ADDED: Now properly received as an argument
}) {
  const now = new Date();
  const rush = getRushMultiplier(pickupTime || now);

  // Math: Calculate Queue Latency based on Node Capacity
  const queueWaves = Math.ceil(activeOrders / vendorCapacity);
  const queueDelay = queueWaves * avgVendorPrepTime;

  const rawEstimate = queueDelay + itemsPrepTime;
  const adjustedEstimate = Math.ceil(rawEstimate * rush.multiplier);

  // Math: Determine Confidence Interval
  const confidence = Math.max(
    0.6,
    Math.min(0.98, 1 - (activeOrders / (vendorCapacity * 5)) - (rush.multiplier - 1) * 0.15)
  );

  const baseTime = pickupTime || now;
  const estimatedReadyTime = new Date(baseTime.getTime() + adjustedEstimate * 60000);

  return {
    estimatedMinutes: adjustedEstimate,
    estimatedReadyTime,
    confidence: Math.round(confidence * 100),
    // Ensure this is a raw number (e.g., 1, 2, 3)
    queuePosition: Number(activeOrders + 1), 
    breakdown: {
      prepTime: itemsPrepTime,
      queueDelay,
    }
  };
}

export function getDemandForecast() {
  const now = new Date();
  const currentHour = now.getHours();
  const forecast = [];

  for (let i = 0; i < 8; i++) {
    const hour = currentHour + i;
    if (hour > 20) break;
    const rush = getRushMultiplier(
      new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour)
    );

    const baseDemand = 15;
    const demand = Math.round(baseDemand * rush.multiplier + (Math.random() * 8 - 4));

    forecast.push({
      time: `${hour % 12 || 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
      loadUnits: Math.max(3, demand),
      trafficIntensity: rush.multiplier > 1.3 ? 'CRITICAL' : rush.multiplier > 1.0 ? 'ELEVATED' : 'NOMINAL',
      protocolLabel: rush.label,
    });
  }

  return forecast;
}

export function formatTechnicalTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false, // Switching to 24H format for industrial feel
  });
}