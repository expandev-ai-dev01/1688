/**
 * @summary
 * Weather service for fetching and managing temperature data.
 * Integrates with external weather API and implements caching and throttling.
 *
 * @module services/weather
 */

import { config } from '@/config';
import { WeatherData, TemperatureUnit } from './weatherTypes';
import { weatherCache } from './weatherCache';
import { weatherThrottle } from './weatherThrottle';

/**
 * @summary
 * Fetches current temperature data from external weather API
 *
 * @function getCurrentTemperature
 *
 * @param {string} location - Location name
 * @param {TemperatureUnit} unit - Temperature unit (celsius or fahrenheit)
 *
 * @returns {Promise<WeatherData>} Current weather data
 *
 * @throws {WeatherAPIError} When API request fails
 */
export async function getCurrentTemperature(
  location: string,
  unit: TemperatureUnit = 'celsius'
): Promise<WeatherData> {
  /**
   * @rule {fn-weather-cache-check} Check cache for recent data
   */
  const cachedData = weatherCache.get(location, unit);
  if (cachedData) {
    return cachedData;
  }

  /**
   * @rule {fn-weather-api-fetch} Fetch from external weather API
   */
  try {
    const response = await fetch(
      `${config.weather.apiUrl}/current.json?key=${config.weather.apiKey}&q=${encodeURIComponent(
        location
      )}&aqi=no`
    );

    if (!response.ok) {
      /**
       * @validation API response validation
       * @throw {WeatherAPIError}
       */
      if (response.status === 404) {
        throw {
          code: 'WEATHER_API_ERROR',
          message: 'Location not found',
          statusCode: 404,
        };
      }
      throw {
        code: 'WEATHER_API_ERROR',
        message: 'Failed to fetch weather data',
        statusCode: 502,
      };
    }

    const apiData = await response.json();

    /**
     * @rule {fn-weather-data-transform} Transform API response to internal format
     */
    const temperature = unit === 'celsius' ? apiData.current.temp_c : apiData.current.temp_f;

    /**
     * @validation Temperature range validation
     * @throw {ValidationError}
     */
    if (temperature < -90 || temperature > 60) {
      throw {
        code: 'VALIDATION_ERROR',
        message: 'Temperature value outside plausible range',
        statusCode: 500,
      };
    }

    const weatherData: WeatherData = {
      temperature: parseFloat(temperature.toFixed(1)),
      unit: unit === 'celsius' ? '°C' : '°F',
      location: `${apiData.location.name}, ${apiData.location.country}`,
      timestamp: new Date().toISOString(),
      status: 'online',
    };

    /**
     * @rule {fn-weather-cache-store} Store data in cache
     */
    weatherCache.set(location, unit, weatherData);

    return weatherData;
  } catch (error: any) {
    /**
     * @rule {fn-weather-offline-fallback} Return cached data if available when API fails
     */
    const offlineData = weatherCache.get(location, unit, true);
    if (offlineData) {
      return {
        ...offlineData,
        status: 'offline',
      };
    }

    throw error;
  }
}

/**
 * @summary
 * Checks if manual refresh is allowed based on throttle limit
 *
 * @function checkRefreshThrottle
 *
 * @param {string} location - Location name
 *
 * @returns {Promise<boolean>} True if refresh is allowed
 */
export async function checkRefreshThrottle(location: string): Promise<boolean> {
  return weatherThrottle.canRefresh(location);
}

/**
 * @summary
 * Forces refresh of temperature data from API
 *
 * @function refreshTemperature
 *
 * @param {string} location - Location name
 * @param {TemperatureUnit} unit - Temperature unit
 *
 * @returns {Promise<WeatherData>} Refreshed weather data
 *
 * @throws {WeatherAPIError} When API request fails
 */
export async function refreshTemperature(
  location: string,
  unit: TemperatureUnit = 'celsius'
): Promise<WeatherData> {
  /**
   * @rule {fn-weather-cache-invalidate} Invalidate cache before refresh
   */
  weatherCache.invalidate(location, unit);

  /**
   * @rule {fn-weather-throttle-record} Record refresh timestamp
   */
  weatherThrottle.recordRefresh(location);

  /**
   * @rule {fn-weather-fetch-fresh} Fetch fresh data from API
   */
  return getCurrentTemperature(location, unit);
}
