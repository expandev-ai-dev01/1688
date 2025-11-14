/**
 * @summary
 * Throttle management for manual weather refresh.
 * Prevents excessive API calls by enforcing minimum interval between refreshes.
 *
 * @module services/weather/throttle
 */

import { ThrottleRecord } from './weatherTypes';

/**
 * @summary
 * Throttle interval in milliseconds (30 seconds)
 */
const THROTTLE_INTERVAL = 30000;

/**
 * @summary
 * In-memory throttle tracking
 */
const throttleMap = new Map<string, number>();

/**
 * @summary
 * Checks if refresh is allowed for a location
 *
 * @function canRefresh
 *
 * @param {string} location - Location name
 *
 * @returns {boolean} True if refresh is allowed
 */
function canRefresh(location: string): boolean {
  const key = location.toLowerCase();
  const lastRefresh = throttleMap.get(key);

  if (!lastRefresh) {
    return true;
  }

  const now = Date.now();
  const timeSinceLastRefresh = now - lastRefresh;

  /**
   * @rule {fn-throttle-interval-check} Enforce minimum 30 second interval
   */
  return timeSinceLastRefresh >= THROTTLE_INTERVAL;
}

/**
 * @summary
 * Records a refresh timestamp for a location
 *
 * @function recordRefresh
 *
 * @param {string} location - Location name
 *
 * @returns {void}
 */
function recordRefresh(location: string): void {
  const key = location.toLowerCase();
  throttleMap.set(key, Date.now());
}

/**
 * @summary
 * Clears throttle record for a location
 *
 * @function clearThrottle
 *
 * @param {string} location - Location name
 *
 * @returns {void}
 */
function clearThrottle(location: string): void {
  const key = location.toLowerCase();
  throttleMap.delete(key);
}

/**
 * @summary
 * Clears all throttle records
 *
 * @function clearAll
 *
 * @returns {void}
 */
function clearAll(): void {
  throttleMap.clear();
}

/**
 * @summary
 * Periodic cleanup of old throttle records (older than 5 minutes)
 */
setInterval(() => {
  const now = Date.now();
  const fiveMinutesAgo = now - 300000;

  for (const [key, timestamp] of throttleMap.entries()) {
    if (timestamp < fiveMinutesAgo) {
      throttleMap.delete(key);
    }
  }
}, 60000);

export const weatherThrottle = {
  canRefresh,
  recordRefresh,
  clearThrottle,
  clearAll,
};
