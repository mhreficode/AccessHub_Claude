import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { requireUser } from '../middleware/currentUser';
import { accessRequestService } from '../services/accessRequest.service';
import { rejectAccessRequestSchema } from '../validators/access.validators';
import { serializeApiKey } from '../utils/serializers';

export const accessRequestsRouter = Router();

// GET /api/access-requests
accessRequestsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const user = requireUser(req);
    const filter =
      user.role === 'developer'
        ? { requesterUserId: user.id }
        : { status: typeof req.query.status === 'string' ? req.query.status : undefined };
    const requests = await accessRequestService.list(filter);
    res.json(requests);
  }),
);

// POST /api/access-requests/:id/approve
accessRequestsRouter.post(
  '/:id/approve',
  asyncHandler(async (req, res) => {
    const user = requireUser(req);
    const result = await accessRequestService.approve(user, req.params.id);
    res.json({
      request: result.request,
      apiKey: serializeApiKey(result.apiKey),
      // The raw key is returned exactly once so the requester can copy it.
      rawKey: result.rawKey,
    });
  }),
);

// POST /api/access-requests/:id/reject
accessRequestsRouter.post(
  '/:id/reject',
  asyncHandler(async (req, res) => {
    const user = requireUser(req);
    const { rejectionReason } = rejectAccessRequestSchema.parse(req.body);
    const updated = await accessRequestService.reject(user, req.params.id, rejectionReason);
    res.json(updated);
  }),
);
