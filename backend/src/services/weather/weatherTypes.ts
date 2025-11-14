/**
 * @summary
 * Type definitions for weather service.
 *
 * @module services/weather/types
 */

/**
 * @interface WeatherData
 * @description Weather data structure returned by the service
 *
 * @property {number} temperature - Temperature value with one decimal place
 * @property {string} unit - Temperature unit symbol (°C or °F)
 * @property {string} location - Location name (city, country)
 * @property {string} timestamp - ISO timestamp of last update
 * @property {string} status - Connection status (online, offline, desatualizado)
 */
export interface WeatherData {
  temperature: number;
  unit: string;
  location: string;
  timestamp: string;
  status: 'online' | 'offline' | 'desatualizado';
}

/**
 * @type TemperatureUnit
 * @description Supported temperature units
 */
export type TemperatureUnit = 'celsius' | 'fahrenheit';

/**
 * @interface CachedWeatherData
 * @description Cached weather data with expiration
 *
 * @property {WeatherData} data - Weather data
 * @property {number} expiresAt - Expiration timestamp
 */
export interface CachedWeatherData {
  data: WeatherData;
  expiresAt: number;
}

/**
 * @interface ThrottleRecord
 * @description Throttle tracking for manual refresh
 *
 * @property {string} location - Location identifier
 * @property {number} lastRefresh - Last refresh timestamp
 */
export interface ThrottleRecord {
  location: string;
  lastRefresh: number;
}
