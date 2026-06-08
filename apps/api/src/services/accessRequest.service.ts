import { accessRequestRepository, type AccessRequestFilter } from '../repositories/accessRequest.repository';
import { serviceRepository } from '../repositories/service.repository';
import { auditLogService } from './auditLog.service';
import { apiKeyService } from './apiKey.service';
import { type AuthUser } from './authz.service';
import { badRequest, conflict, forbidden, notFound } from '../utils/errors';

export const accessRequestService = {
  list(filter: AccessRequestFilter = {}) {
    return accessRequestRepository.findAll(filter);
  },

  async requestAccess(currentUser: AuthUser, serviceId: string, reason: string) {
    const service = await serviceRepository.findById(serviceId);
    if (!service) {
      throw notFound('SERVICE_NOT_FOUND', 'Service not found');
    }

    // Duplicate validation: the route already validates `reason` with Zod, but the
    // service re-checks it here too. (Workshop refactor target.)
    if (!reason || reason.trim().length < 10) {
      throw badRequest('A reason of at least 10 characters is required.');
    }

    const created = await accessRequestRepository.create({
      serviceId,
      requesterUserId: currentUser.id,
      reason: reason.trim(),
    });

    await auditLogService.record({
      actorUserId: currentUser.id,
      action: 'access.requested',
      entityType: 'AccessRequest',
      entityId: created.id,
      message: `${currentUser.id} requested access to ${service.name}.`,
    });

    return created;
  },

  async approve(currentUser: AuthUser, requestId: string) {
    const request = await accessRequestRepository.findById(requestId);
    if (!request) {
      throw notFound('ACCESS_REQUEST_NOT_FOUND', 'Access request not found');
    }

    // Authorization check. Developers clearly cannot approve.
    if (currentUser.role === 'developer') {
      throw forbidden('Developers cannot approve access requests.');
    }

    if (request.status !== 'pending') {
      throw conflict(`Request is already ${request.status}.`);
    }

    const updated = await accessRequestRepository.update(requestId, {
      status: 'approved',
      reviewedById: currentUser.id,
      reviewedAt: new Date(),
      rejectionReason: null,
    });

    await auditLogService.record({
      actorUserId: currentUser.id,
      action: 'access.approved',
      entityType: 'AccessRequest',
      entityId: requestId,
      message: `Access to ${request.service.name} approved for ${request.requester.name}.`,
    });

    // Approval issues an API key for the requester.
    const { apiKey, rawKey } = await apiKeyService.generateForAccess({
      serviceId: request.serviceId,
      serviceName: request.service.name,
      userId: request.requesterUserId,
      label: `${request.service.name} access`,
      actorUserId: currentUser.id,
    });

    return { request: updated, apiKey, rawKey };
  },

  async reject(currentUser: AuthUser, requestId: string, rejectionReason: string) {
    const request = await accessRequestRepository.findById(requestId);
    if (!request) {
      throw notFound('ACCESS_REQUEST_NOT_FOUND', 'Access request not found');
    }

    if (currentUser.role === 'developer') {
      throw forbidden('Developers cannot reject access requests.');
    }

    if (request.status !== 'pending') {
      throw conflict(`Request is already ${request.status}.`);
    }

    const updated = await accessRequestRepository.update(requestId, {
      status: 'rejected',
      reviewedById: currentUser.id,
      reviewedAt: new Date(),
      rejectionReason: rejectionReason?.trim() || 'No reason provided',
    });

    return updated;
  },
};
