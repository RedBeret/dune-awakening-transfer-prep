import { featureFlags } from '../config/featureFlags';

function stamp() {
  return new Date().toISOString();
}

export const logger = {
  info(event, meta = {}) {
    if (!featureFlags.enableVerboseClientLogs) return;
    console.info(`[${stamp()}] [INFO] ${event}`, meta);
  },
  warn(event, meta = {}) {
    console.warn(`[${stamp()}] [WARN] ${event}`, meta);
  },
  error(event, meta = {}) {
    console.error(`[${stamp()}] [ERROR] ${event}`, meta);
  }
};
