import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { usageService } from '../services/usage.service';

export const usageRouter = Router();

// GET /api/usage/summary
usageRouter.get(
  '/summary',
  asyncHandler(async (_req, res) => {
    const summary = await usageService.summary();
    res.json(summary);
  }),
);
