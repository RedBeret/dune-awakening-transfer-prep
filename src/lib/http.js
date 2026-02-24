import { logger } from './logger';

export async function fetchJsonWithRetry(url, options = {}) {
  const {
    timeoutMs = 5000,
    retries = 2,
    backoffMs = 400,
    signal
  } = options;

  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(new Error('Timeout')), timeoutMs);

      if (signal) {
        signal.addEventListener(
          'abort',
          () => controller.abort(new Error('Aborted by caller')),
          { once: true }
        );
      }

      const response = await fetch(url, { signal: controller.signal, cache: 'no-cache' });
      clearTimeout(timer);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();
      return json;
    } catch (error) {
      lastError = error;
      logger.warn('fetch_json_attempt_failed', { url, attempt, error: String(error) });
      if (attempt < retries) {
        const delay = backoffMs * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(`Failed to fetch ${url}: ${String(lastError)}`);
}
