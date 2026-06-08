import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { requireUser } from '../middleware/currentUser';
import { apiKeyService } from '../services/apiKey.service';
import { apiKeyRepository } from '../repositories/apiKey.repository';
import { serializeApiKey } from '../utils/serializers';

export const apiKeysRouter = Router();

// GET /api/api-keys
apiKeysRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const user = requireUser(req);
    const keys = await apiKeyService.list(
      user.role === 'developer' ? { userId: user.id } : {},
    );
    res.json(keys.map(serializeApiKey));
  }),
);

// POST /api/api-keys/:id/revoke
apiKeysRouter.post(
  '/:id/revoke',
  asyncHandler(async (req, res) => {
    const user = requireUser(req);
    const existing = await apiKeyRepository.findById(req.params.id);
    if (!existing) {
      // NOTE: ad-hoc error shape.
      res.status(404).json({ error: 'API key not found' });
      return;
    }
    const revoked = await apiKeyService.revoke(user, req.params.id);
    res.json(serializeApiKey({ ...revoked, service: existing.service }));
  }),
);
