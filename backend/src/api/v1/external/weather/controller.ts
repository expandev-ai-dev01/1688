/**
 * @summary
 * Weather controller for temperature display feature.
 * Handles requests for current temperature data from external weather API.
 *
 * @module api/v1/external/weather
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/utils/response';
import { weatherService } from '@/services/weather';

/**
 * @api {get} /api/v1/external/weather/current Get Current Temperature
 * @apiName GetCurrentTemperature
 * @apiGroup Weather
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves current temperature data for a specified location
 *
 * @apiParam {String} location Location name (city, state/country)
 * @apiParam {String} [unit=celsius] Temperature unit (celsius or fahrenheit)
 *
 * @apiSuccess {Number} temperature Current temperature value
 * @apiSuccess {String} unit Temperature unit
 * @apiSuccess {String} location Location name
 * @apiSuccess {String} timestamp Last update timestamp
 * @apiSuccess {String} status Connection status
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} WeatherAPIError External API error
 * @apiError {String} ServerError Internal server error
 */
export async function getCurrentHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    /**
     * @validation Query parameter validation
     * @throw {ValidationError}
     */
    const querySchema = z.object({
      location: z.string().min(1).max(50),
      unit: z.enum(['celsius', 'fahrenheit']).optional().default('celsius'),
    });

    const validated = querySchema.parse(req.query);

    /**
     * @rule {fn-weather-fetch} Fetch current weather data from external API
     */
    const weatherData = await weatherService.getCurrentTemperature(
      validated.location,
      validated.unit
    );

    res.json(successResponse(weatherData));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res
        .status(400)
        .json(errorResponse('Invalid request parameters', 'VALIDATION_ERROR', error.errors));
    } else if (error.code === 'WEATHER_API_ERROR') {
      res.status(502).json(errorResponse(error.message, 'WEATHER_API_ERROR'));
    } else {
      next(error);
    }
  }
}

/**
 * @api {post} /api/v1/external/weather/refresh Refresh Temperature
 * @apiName RefreshTemperature
 * @apiGroup Weather
 * @apiVersion 1.0.0
 *
 * @apiDescription Manually refreshes temperature data for a location
 *
 * @apiParam {String} location Location name
 * @apiParam {String} [unit=celsius] Temperature unit
 *
 * @apiSuccess {Number} temperature Updated temperature value
 * @apiSuccess {String} unit Temperature unit
 * @apiSuccess {String} location Location name
 * @apiSuccess {String} timestamp Update timestamp
 * @apiSuccess {String} status Update status
 *
 * @apiError {String} ThrottleError Too many refresh requests
 * @apiError {String} WeatherAPIError External API error
 */
export async function refreshHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    /**
     * @validation Body parameter validation
     * @throw {ValidationError}
     */
    const bodySchema = z.object({
      location: z.string().min(1).max(50),
      unit: z.enum(['celsius', 'fahrenheit']).optional().default('celsius'),
    });

    const validated = bodySchema.parse(req.body);

    /**
     * @rule {fn-weather-throttle} Check throttle limit for manual refresh
     */
    const canRefresh = await weatherService.checkRefreshThrottle(validated.location);

    if (!canRefresh) {
      res
        .status(429)
        .json(
          errorResponse('Please wait 30 seconds before requesting another update', 'THROTTLE_ERROR')
        );
      return;
    }

    /**
     * @rule {fn-weather-refresh} Force refresh weather data from API
     */
    const weatherData = await weatherService.refreshTemperature(validated.location, validated.unit);

    res.json(successResponse(weatherData));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res
        .status(400)
        .json(errorResponse('Invalid request parameters', 'VALIDATION_ERROR', error.errors));
    } else if (error.code === 'WEATHER_API_ERROR') {
      res.status(502).json(errorResponse(error.message, 'WEATHER_API_ERROR'));
    } else {
      next(error);
    }
  }
}
