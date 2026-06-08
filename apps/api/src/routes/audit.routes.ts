import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { requireUser } from '../middleware/currentUser';
import { auditLogService } from '../services/auditLog.service';
import { forbidden } from '../utils/errors';

export const auditRouter = Router();

// GET /api/audit-log  — owners and admins only
auditRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const user = requireUser(req);
    if (user.role === 'developer') {
      throw forbidden('Only service owners and platform admins can view the audit log.');
    }
    const logs = await auditLogService.list(100);
    res.json(logs);
  }),
);
