/**
 * @summary
 * External API routes configuration for V1.
 * Handles public endpoints that do not require authentication.
 *
 * @module routes/v1/externalRoutes
 */

import { Router } from 'express';
import * as weatherController from '@/api/v1/external/weather/controller';

const router = Router();

// Weather routes
router.get('/weather/current', weatherController.getCurrentHandler);
router.post('/weather/refresh', weatherController.refreshHandler);

export default router;
