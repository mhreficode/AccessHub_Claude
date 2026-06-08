import { serviceRepository, type ServiceFilter } from '../repositories/service.repository';
import { auditLogService } from './auditLog.service';
import { assertCanManageService, type AuthUser } from './authz.service';
import { notFound } from '../utils/errors';

export const serviceCatalogService = {
  list(filter: ServiceFilter = {}) {
    return serviceRepository.findAll(filter);
  },

  async getById(id: string) {
    const service = await serviceRepository.findById(id);
    if (!service) {
      throw notFound('SERVICE_NOT_FOUND', 'Service not found');
    }
    return service;
  },

  async update(
    currentUser: AuthUser,
    id: string,
    data: { status?: string; description?: string; docsMarkdown?: string },
  ) {
    const service = await serviceRepository.findById(id);
    if (!service) {
      throw notFound('SERVICE_NOT_FOUND', 'Service not found');
    }
    assertCanManageService(currentUser, service);

    const updated = await serviceRepository.update(id, data);
    await auditLogService.record({
      actorUserId: currentUser.id,
      action: 'service.updated',
      entityType: 'Service',
      entityId: id,
      message: `${service.name} was updated.`,
      metadata: { fields: Object.keys(data) },
    });
    return updated;
  },
};
