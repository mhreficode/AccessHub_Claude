import { auditLogRepository, type AuditLogInput } from '../repositories/auditLog.repository';

/**
 * Audit logging. Every access lifecycle event should produce one of these.
 * See docs/DOMAIN_RULES.md for the list of events that must be audited.
 *
 * Security: never put raw API keys or other secrets in the message or metadata.
 */
export const auditLogService = {
  record(input: AuditLogInput) {
    return auditLogRepository.create(input);
  },

  list(limit?: number) {
    return auditLogRepository.findAll(limit);
  },
};
