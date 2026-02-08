const RUSH_WINDOWS = [
  { start: 9.5, end: 10.5, intensity: 1.4, label: 'Morning Break Rush' },
  { start: 12, end: 13.5, intensity: 1.8, label: 'Lunch Rush (Peak)' },
  { start: 15, end: 16, intensity: 1.3, label: 'Afternoon Break' },
  { start: 17, end: 18, intensity: 1.1, label: 'Evening Snack' },
];

export function getRushMultiplier(date = new Date()) {
  const hours = date.getHours() + date.getMinutes() / 60;
  for (const window of RUSH_WINDOWS) {
    if (hours >= window.start && hours <= window.end) {
      return { multiplier: window.intensity, label: window.label };
    }
  }
  return { multiplier: 1.0, label: 'Off-Peak' };
}

export function predictWaitTime({
  itemsPrepTime,
  activeOrders,
  vendorCapacity,
  avgVendorPrepTime,
  pickupTime = null,
}) {
  const now = new Date();
  const rush = getRushMultiplier(pickupTime || now);

  const queueWaves = Math.ceil(activeOrders / vendorCapacity);
  const queueDelay = queueWaves * avgVendorPrepTime;

  const rawEstimate = queueDelay + itemsPrepTime;
  const adjustedEstimate = Math.ceil(rawEstimate * rush.multiplier);

  const confidence = Math.max(
    0.6,
    Math.min(0.98, 1 - (activeOrders / (vendorCapacity * 5)) - (rush.multiplier - 1) * 0.15)
  );

  const baseTime = pickupTime || now;
  const estimatedReadyTime = new Date(baseTime.getTime() + adjustedEstimate * 60000);

  const marginMinutes = Math.ceil((1 - confidence) * 5);
  const windowStart = new Date(estimatedReadyTime.getTime() - marginMinutes * 60000);
  const windowEnd = new Date(estimatedReadyTime.getTime() + marginMinutes * 60000);

  return {
    estimatedMinutes: adjustedEstimate,
    estimatedReadyTime,
    confidence: Math.round(confidence * 100),
    rushInfo: rush,
    queuePosition: activeOrders + 1,
    breakdown: {
      prepTime: itemsPrepTime,
      queueDelay,
      rushMultiplier: rush.multiplier,
      rushLabel: rush.label,
    },
    window: {
      start: windowStart,
      end: windowEnd,
      margin: marginMinutes,
    },
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
      hour: `${hour % 12 || 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
      demand: Math.max(3, demand),
      intensity: rush.multiplier > 1.3 ? 'high' : rush.multiplier > 1.0 ? 'medium' : 'low',
      label: rush.label,
    });
  }

  return forecast;
}

export function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}