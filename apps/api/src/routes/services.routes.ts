import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { requireUser } from '../middleware/currentUser';
import { serviceRepository } from '../repositories/service.repository';
import { serviceCatalogService } from '../services/serviceCatalog.service';
import { accessRequestService } from '../services/accessRequest.service';
import { updateServiceSchema } from '../validators/service.validators';

export const servicesRouter = Router();

// GET /api/services  — list with optional filters
servicesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const services = await serviceCatalogService.list({
      status: typeof req.query.status === 'string' ? req.query.status : undefined,
      ownerTeamId: typeof req.query.ownerTeamId === 'string' ? req.query.ownerTeamId : undefined,
      search: typeof req.query.search === 'string' ? req.query.search : undefined,
    });
    res.json(services);
  }),
);

// GET /api/services/:id  — service detail
servicesRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const service = await serviceRepository.findById(req.params.id);
    if (!service) {
      // NOTE: ad-hoc error shape.
      res.status(404).json({ message: 'Service not found' });
      return;
    }
    res.json(service);
  }),
);

// POST /api/services/:id/access-requests  — request access to a service
servicesRouter.post(
  '/:id/access-requests',
  asyncHandler(async (req, res) => {
    const user = requireUser(req);
    const reason: string = req.body?.reason ?? '';
    if (reason.trim().length < 10) {
      // NOTE: ad-hoc error shape, and duplicates the check in accessRequestService.
      res.status(400).json({ message: 'reason must be at least 10 characters' });
      return;
    }
    const created = await accessRequestService.requestAccess(user, req.params.id, reason);
    res.status(201).json(created);
  }),
);

// PATCH /api/services/:id  — update a service (owners / admins)
servicesRouter.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const user = requireUser(req);
    const data = updateServiceSchema.parse(req.body);
    const updated = await serviceCatalogService.update(user, req.params.id, data);
    res.json(updated);
  }),
);
