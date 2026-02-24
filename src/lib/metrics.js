const KEY = 'duneTransferPrep:metrics';

function safeRead() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || '{}');
    if (typeof parsed === 'object' && parsed) return parsed;
    return {};
  } catch {
    return {};
  }
}

function safeWrite(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Ignore quota issues. Metrics are best effort.
  }
}

export function incrementMetric(name, amount = 1) {
  if (!name) return;
  const metrics = safeRead();
  metrics[name] = Number(metrics[name] || 0) + amount;
  safeWrite(metrics);
}

export function getMetricsSnapshot() {
  return safeRead();
}
