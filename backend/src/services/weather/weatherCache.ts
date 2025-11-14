/**
 * @summary
 * Weather data caching implementation.
 * Manages in-memory cache with TTL for weather data.
 *
 * @module services/weather/cache
 */

import { config } from '@/config';
import { WeatherData, TemperatureUnit, CachedWeatherData } from './weatherTypes';

/**
 * @summary
 * In-memory cache storage
 */
const cache = new Map<string, CachedWeatherData>();

/**
 * @summary
 * Generates cache key from location and unit
 *
 * @function getCacheKey
 *
 * @param {string} location - Location name
 * @param {TemperatureUnit} unit - Temperature unit
 *
 * @returns {string} Cache key
 */
function getCacheKey(location: string, unit: TemperatureUnit): string {
  return `${location.toLowerCase()}_${unit}`;
}

/**
 * @summary
 * Retrieves cached weather data if valid
 *
 * @function get
 *
 * @param {string} location - Location name
 * @param {TemperatureUnit} unit - Temperature unit
 * @param {boolean} ignoreExpiration - Return expired data if true
 *
 * @returns {WeatherData | null} Cached data or null
 */
function get(
  location: string,
  unit: TemperatureUnit,
  ignoreExpiration: boolean = false
): WeatherData | null {
  const key = getCacheKey(location, unit);
  const cached = cache.get(key);

  if (!cached) {
    return null;
  }

  const now = Date.now();

  /**
   * @rule {fn-cache-expiration-check} Check if cached data is still valid
   */
  if (!ignoreExpiration && now > cached.expiresAt) {
    cache.delete(key);
    return null;
  }

  /**
   * @rule {fn-cache-staleness-check} Mark data as stale if older than 1 hour
   */
  const oneHourAgo = now - 3600000;
  if (cached.expiresAt < oneHourAgo) {
    return {
      ...cached.data,
      status: 'desatualizado',
    };
  }

  return cached.data;
}

/**
 * @summary
 * Stores weather data in cache with TTL
 *
 * @function set
 *
 * @param {string} location - Location name
 * @param {TemperatureUnit} unit - Temperature unit
 * @param {WeatherData} data - Weather data to cache
 *
 * @returns {void}
 */
function set(location: string, unit: TemperatureUnit, data: WeatherData): void {
  const key = getCacheKey(location, unit);
  const expiresAt = Date.now() + config.cache.ttl * 1000;

  cache.set(key, {
    data,
    expiresAt,
  });
}

/**
 * @summary
 * Invalidates cached data for a location
 *
 * @function invalidate
 *
 * @param {string} location - Location name
 * @param {TemperatureUnit} unit - Temperature unit
 *
 * @returns {void}
 */
function invalidate(location: string, unit: TemperatureUnit): void {
  const key = getCacheKey(location, unit);
  cache.delete(key);
}

/**
 * @summary
 * Clears all cached data
 *
 * @function clear
 *
 * @returns {void}
 */
function clear(): void {
  cache.clear();
}

/**
 * @summary
 * Periodic cleanup of expired cache entries
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, cached] of cache.entries()) {
    if (now > cached.expiresAt) {
      cache.delete(key);
    }
  }
}, config.cache.checkPeriod * 1000);

export const weatherCache = {
  get,
  set,
  invalidate,
  clear,
};
