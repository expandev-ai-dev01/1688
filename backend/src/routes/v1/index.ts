/**
 * @summary
 * V1 API router configuration.
 * Organizes routes into external (public) and internal (authenticated) endpoints.
 *
 * @module routes/v1
 */

import { Router } from 'express';
import externalRoutes from './externalRoutes';

const router = Router();

// External (public) routes - /api/v1/external/...
router.use('/external', externalRoutes);

export default router;
